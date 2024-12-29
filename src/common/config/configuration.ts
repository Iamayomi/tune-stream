import { configType } from './types/config.type';

export default (): configType => ({
  port: parseInt(process.env.PORT),
  secret: process.env.SECRET,
  host: process.env.DB_HOST,
  dbPort: parseInt(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.PASSWORD,
  database: process.env.DB_NAME,
});
