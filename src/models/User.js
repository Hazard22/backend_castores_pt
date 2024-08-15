import { DataTypes } from 'sequelize';
import { sequelize } from '..//middlewares/database.js';

export const User = sequelize.define('User', {
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
    password: DataTypes.TEXT
});