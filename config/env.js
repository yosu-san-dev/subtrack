import { config } from 'dotenv';

config({ path: `.env.${process.env.NODE_ENV || 'development'}.local` });

export const {
    PORT,
    NODE_ENV,
    SERVER_URL,
    DB_PATH,
    JWT_SECRET,
} = process.env;