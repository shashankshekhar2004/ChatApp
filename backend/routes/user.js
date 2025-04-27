import express from 'express'
import { GetUser, Login, Register } from '../controllers/user.js'
import { upload } from '../middlewares/Multer.js'

const AuthRoutes=express.Router()

AuthRoutes.post('/register',upload.single('profile'),Register)
AuthRoutes.post('/login', Login)
AuthRoutes.get('/get_user', GetUser)

export default AuthRoutes