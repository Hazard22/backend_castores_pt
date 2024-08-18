import { DataTypes } from 'sequelize';
import { sequelize } from '..//middlewares/database.js';

export const UserFavorites = sequelize.define('user_favorites', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    video_id: DataTypes.STRING,
});