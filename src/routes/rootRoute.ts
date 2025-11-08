import express from "express";
import { authRoute } from "./authRoute";
import { eventRoute } from "./eventRoute";
import { attachmentController } from "../controller/attachmentController";


export const rootRoute = express()


rootRoute.use('/api/auth',authRoute)
rootRoute.use('/api/events', eventRoute)
rootRoute.get('/attachment/:filename',attachmentController)






