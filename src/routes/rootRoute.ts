import express from "express";
import { authRoute } from "./authRoute";
import { eventRoute } from "./eventRoute";


export const rootRoute = express()

// rootRoute.use('/')

rootRoute.use('/api/auth',authRoute)
rootRoute.use('/api/event', eventRoute)






