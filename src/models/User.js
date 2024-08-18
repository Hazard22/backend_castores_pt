import { DataTypes } from 'sequelize';
import { sequelize } from '..//middlewares/database.js';
import { UserFavorites } from './UserFavorites.js';


export const User = sequelize.define('user', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: DataTypes.STRING,
    lastname: DataTypes.STRING,
    username: DataTypes.STRING,
    email: {
        type: DataTypes.STRING,
        validate: {
            isEmail: true
        }
    },
    password: DataTypes.TEXT,
    security_code: DataTypes.STRING
});

User.hasMany(UserFavorites)
UserFavorites.belongsTo(User)