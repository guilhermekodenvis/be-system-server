import { Router } from 'express'
import multer from 'multer'
import uploadConfig from '@config/upload'
import { celebrate, Segments, Joi } from 'celebrate'

import UsersController from '../controllers/UsersController'
import ensureAuthenticated from '../middlewares/ensureAuthenticated'
import UserAvatarController from '../controllers/UserAvatarController'

const usersRouter = Router()
const usersController = new UsersController()
const userAvatarController = new UserAvatarController()

const upload = multer(uploadConfig.multer)

usersRouter.post(
	'/',
	celebrate({
		[Segments.BODY]: {
			restaurant_name: Joi.string().required(),
			user_name: Joi.string().required(),
			email: Joi.string().email().required(),
			password: Joi.string().required(),
			cnpj: Joi.string().required().length(14).regex(new RegExp('^[0-9]+$')),
		},
	}),
	usersController.create,
)

usersRouter.patch(
	'/avatar',
	ensureAuthenticated,
	upload.single('avatar'),
	userAvatarController.update,
)

export default usersRouter
