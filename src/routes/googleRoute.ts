import express from 'express'
import { google, googleCallback, googleSwitch } from '../controller/googleController'


export const googleRoute = express.Router()



// Existing auth routes
googleRoute.get('/', google)
googleRoute.get('/switch', googleSwitch)
googleRoute.get('/callback', googleCallback)


