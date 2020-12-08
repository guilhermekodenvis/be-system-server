import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated'
import { celebrate, Segments, Joi } from 'celebrate'
import { Router } from 'express'
import RegistersController from '../controllers/RegistersController'
import OpenCashierController from '../controllers/OpenCashierController'
import CloseCashierController from '../controllers/CloseCashierController'

const cashiersRoutes = Router()
cashiersRoutes.use(ensureAuthenticated)
const registersController = new RegistersController()
const openCashierController = new OpenCashierController()
const closeCashierController = new CloseCashierController()

cashiersRoutes.post(
	'/open',
	celebrate({
		[Segments.BODY]: {
			value: Joi.number().required(),
			password: Joi.string().required(),
		},
	}),
	openCashierController.create,
)

cashiersRoutes.post(
	'/register',
	celebrate({
		[Segments.BODY]: {
			value: Joi.number().required(),
			action: Joi.number().integer().required(),
		},
	}),
	registersController.create,
)

cashiersRoutes.post(
	'/close',
	celebrate({
		[Segments.BODY]: {
			password: Joi.string().required(),
		},
	}),
	closeCashierController.create,
)

export default cashiersRoutes
