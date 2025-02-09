export const envs = {
    env: process.env.NODE_ENV as "development" | "production" | "test",
    port: process.env.PORT as string,

    authSecret: process.env.AUTH_SECRET as string,

    host: process.env.DB_HOST as string,

    dbPort: parseInt(process.env.DB_PORT)as number,

    username: process.env.DB_USER as string,

    password: process.env.DB_PASSWORD as string,
}