import fetch from 'node-fetch';
import dotenv from 'dotenv'
dotenv.config()


export async function recaptchaValidation(token){
    try {
        const secret_key = process.env.SECRET_KEY_CAPTCHA
        const captchaVerificationUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secret_key}&response=${token}`;
        const response = await fetch(captchaVerificationUrl, {
            method: 'POST',
        });
        const data = await response.json();
        
        if(data.success){
            return true
        }
        else{
            return false
        }
    } catch (error) {
        console.log(error);
        return false
    }
    
}