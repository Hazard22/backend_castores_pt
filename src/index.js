import app from './app.js'
import dotenv from 'dotenv'
import { sequelize } from './middlewares/database.js';
dotenv.config()



async function main() {

    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
        await sequelize.sync();
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }

  app.listen(process.env.PORT);
  console.log("Server running");
}

main();