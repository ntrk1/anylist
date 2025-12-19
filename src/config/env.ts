import 'dotenv/config';
import * as joi from 'joi';

interface EnvVars {
    JWT_SECRET: string;
}

const envSchema = joi.object({
    JWT_SECRET: joi.string().required()
}).unknown(true);



const {error, value} = envSchema.validate(process.env);
if(error) {
    throw new Error(error.message);
}



const envVars: EnvVars = value;
export const envs = {
    jwt: envVars.JWT_SECRET
}