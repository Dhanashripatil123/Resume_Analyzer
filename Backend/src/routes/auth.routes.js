const {Router} = require('express')
const authController = require("../controllers/auth.controller")
const authmiddleware = require("../middeleware/auth.middleware")

const authRouter = Router()
/** 
*@route POST /api/auth/register
* @description Register a new userModel
* @access Public
*/

authRouter.post("/register",authmiddleware.authUser, authController.registerUserController)

/**
 * @route POST /api/auth/login
 * @description login user with email and password
 * @access public  
 */
authRouter.post("/login",authmiddleware.authUser, authController.loginUserController)

/**
 * @route GET /api/auth/logout
 * @description clear token from user cookie addd token in blacklist
 * @access public
 */

authRouter.get("/logout",authmiddleware.authUser, authController.logoutUserController)

/**
 * @route GET/api/auth/get-me
 * @description get the current logged in user details
 * @access private 
 */
authRouter.get("/get-me", authmiddleware.authUser, authController.getMeController)
module.exports = authRouter