import { Router } from 'express'
import { celebrate, Segments, Joi } from 'celebrate'

import ProfileController from '../controllers/ProfileController'

import ensureAuthenticated from '../middlewares/ensureAuthenticated'

const profileRouter = Router()
const profileController = new ProfileController()

profileRouter.use(ensureAuthenticated)

profileRouter.get('/', profileController.show)
profileRouter.put(
	'/',
	celebrate({
		[Segments.BODY]: {
			restaurant_name: Joi.string().required(),
			user_name: Joi.string().required(),
			email: Joi.string().email().required(),
			cnpj: Joi.string().required().length(14).regex(new RegExp('^[0-9]+$')),
		},
	}),
	profileController.update,
)

profileRouter.put(
	'/password',
	celebrate({
		[Segments.BODY]: {
			old_password: Joi.string().required(),
			password: Joi.string().required(),
		},
	}),
	profileController.updatePassword,
)

export default profileRouter
