import { User } from '../models/User.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { Op } from 'sequelize'
import { recaptchaValidation } from '../middlewares/recaptcha.js'
import { UserFavorites } from '../models/UserFavorites.js'

export async function getUsers(req, res){
    try {
        const users = await User.findAll()
        return res.status(200).json(users)
    } catch (error) {
        return res.status(500).send(error)
    }
}

export async function getUserData(req, res){
    try {
        const token = req.cookies.authToken

        if (!token) {
            return res.status(401).json({ error: 'Token no encontrado' });
        }

        jwt.verify(token, process.env.SECRET, async (err, decoded) => {
            if (err) {
                return res.status(401).json({ error: 'Token inválido' });
            }
            const data = await User.findByPk(decoded.id)
            if(!data){
                return res.status(404).send('No existe un usuario asociado a este usuario o correo')
            }
            return res.status(200).json(data)
        })
    } catch (error) {
        console.log(error);
        return res.status(500).send(error)
    }
}

export async function registerUser(req, res){
    try {
        const { name, lastname, username, email, password, recaptchaToken } = req.body
        const recaptchaValidate = await recaptchaValidation(recaptchaToken)
        if(recaptchaValidate){
            const hashedPassword = await bcrypt.hash(password, 10);
            const security_code = getSecurityCode()
            const hashedCode = await bcrypt.hash(security_code, 10)
            await User.create({
                name,
                lastname,
                username,
                email,
                password: hashedPassword,
                security_code: hashedCode
            })

            return res.status(200).json({security_code})
        }
        else{
            return res.status(409).json({ message: 'Error al validar el captcha' });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send(error)
    }
}

export async function login(req, res) {
    
    try {
        const { credential, password, recaptchaToken } = req.body
        const recaptchaValidate = await recaptchaValidation(recaptchaToken)
        if(recaptchaValidate){
            const user = await User.findOne({
                where: {
                    [Op.or]: [{ username: credential }, { email: credential }],
                },
            });
            if (!user) {
                return res.status(404).json({message:'El nombre de usuario no existe'});
            }
            if (user && bcrypt.compareSync(password, user.password)) {
                const id = user.id
                const token = jwt.sign({ id }, process.env.SECRET);
                
                res.cookie('authToken', token, {
                    secure:true,
                    sameSite: 'none',
                    maxAge: 24 * 60 * 60 * 1000 ,
                });
                res.send('Login ok');
                
                
            }
            else {
                res.status(403).json({message:"La contraseña ingresada es incorrecta"});
            }
        }
        else{
            return res.status(409).json({ message: 'Error al validar el captcha' });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: error.message });
    }
}

export async function verififySecurityCode(req, res){
    try {
        const {credential, security_code } = req.body
        const user = await User.findOne({
            where: {
                [Op.or]: [{ username: credential }, { email: credential }],
            },
        })
        if(!user){
            return res.status(404).send('No existe un usuario asociado a este usuario o correo')
        }
        if (user && bcrypt.compareSync(security_code, user.security_code)){
            return res.status(200).send('Ok')
        }
        else{
            return res.status(403).send('Codigo invalido')
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: error.message });
    }
}

export async function updatePassword(req, res){
    try {
        
        
        const {password, credential} = req.body
        const user = await User.findOne({
            where: {
                [Op.or]: [{ username: credential }, { email: credential }],
            },
        })
        
        if(!user){
            return res.status(404).send('No se encontro al usuario')
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword
        await user.save()
        return res.status(200).send('Ok')
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: error.message });
    }
}

export async function AddFavorite(req, res) {
    try {
        const token = req.cookies.authToken
        jwt.verify(token, process.env.SECRET, async (err, decoded) => {
            if (err) {
                return res.status(401).json({ error: 'Token inválido' });
            }
            const { video_id } = req.query
            const data = await User.findByPk(decoded.id)
            if(!data){
                return res.status(404).send('Usuario no encontrado')
            }
            await UserFavorites.create({
                userId: data.id,
                video_id
            })
            return res.status(200).send('Ok')
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: error.message });
    }
}

export async function RemoveFavorite(req, res) {
    try {
        const token = req.cookies.authToken
        jwt.verify(token, process.env.SECRET, async (err, decoded) => {
            if (err) {
                return res.status(401).json({ error: 'Token inválido' });
            }
            const { video_id } = req.query
            const data = await User.findByPk(decoded.id)
            if(!data){
                return res.status(404).send('Usuario no encontrado')
            }
            await UserFavorites.destroy({
                where: {
                    userId: data.id,
                    video_id
                }
            })
            return res.status(200).send('Ok')
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: error.message });
    }
}

function getSecurityCode() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 4; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        result += characters.charAt(randomIndex);
    }
    return result;
}
