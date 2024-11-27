import express from "express";
import { getAllauthors, getMyProfile, login, logout, register } from "../controllers/UserController.js";
import { isAuthenticated,  } from "../middlewares/auth.js";

const router = express.Router()


router.post('/register',register)
router.post('/login',login)
router.get('/logout',isAuthenticated, logout)
router.get('/myprofile',  isAuthenticated,   getMyProfile)
router.get('/getallauthors',   getAllauthors)


export default router;