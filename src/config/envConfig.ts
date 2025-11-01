
import dotenv from 'dotenv'
import { BadRequestError } from '../httpClass/exceptions'
dotenv.config({path:'.env'})

interface Config {
    APP_NAME?: string
    NODE_ENV?: string
    AUTH_JWT_TOKEN: string
    AUTH_JWT_RESET_TOKEN : string
    API_BASE_URL : string
    CLIENT_URL :string
    DB_PROVIDER: string
    DATABASE_URL: string
    GOOGLE_CLIENT_ID: string
    GOOGLE_CLIENT_SECRET: string
    GOOGLE_CALLBACK_URL: string
    FACEBOOK_APP_ID?: string
    FACEBOOK_APP_SECRET?: string
    FACEBOOK_CALLBACK_URL?: string
    PORT: string


}


export const config : Config ={
    APP_NAME : process.env.APP_NAME,
    NODE_ENV : process.env.NODE_ENV,
    AUTH_JWT_TOKEN: process.env.AUTH_JWT_TOKEN!,
    AUTH_JWT_RESET_TOKEN : process.env.AUTH_JWT_RESET_TOKEN!,
    API_BASE_URL : process.env.API_BASE_URL!,
    CLIENT_URL : process.env.CLIENT_URL!,
    DB_PROVIDER : process.env.DB_PROVIDER!,
    DATABASE_URL : process.env.DATABASE_URL!,
    GOOGLE_CLIENT_ID : process.env.GOOGLE_CLIENT_ID!,
    GOOGLE_CLIENT_SECRET : process.env.GOOGLE_CLIENT_SECRET!,
    GOOGLE_CALLBACK_URL : process.env.CALLBACK_URL!,
    FACEBOOK_APP_ID : process.env.FACEBOOK_APP_ID,
    FACEBOOK_APP_SECRET : process.env.FACEBOOK_APP_SECRET,
    FACEBOOK_CALLBACK_URL : process.env.FACEBOOK_CALLBACK_URL,
    PORT : process.env.PORT || '5000',

}

Object.keys(config).forEach((key) => {
    if (!config[key as keyof Config]){
        throw new BadRequestError(`Environment variable ${key} is not set`)
    }
})

