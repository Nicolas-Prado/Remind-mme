import express from "express"
import * as userController from "./../controllers/UserController"

const router = express.Router()

router.route('/')
    .post(userController.createUser)
    .put(userController.updateUser)

router.route('/username/:username')
    .get(userController.getUserByUsername)

router.route('/login')
    .post(userController.getUserGeneretingCookie)

router.route('/webtoken')
    .get(userController.getUserByWebToken)

export = router