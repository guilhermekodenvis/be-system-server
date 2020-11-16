import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated'
import { celebrate, Segments, Joi } from 'celebrate'
import { Router } from 'express'
import CashierMovimentsController from '../controllers/CashierMovimentsController'

const cashierMovimentsRoutes = Router()
cashierMovimentsRoutes.use(ensureAuthenticated)
const cashierMovimentsController = new CashierMovimentsController()

cashierMovimentsRoutes.post(
	'/open',
	celebrate({
		[Segments.BODY]: {
			value: Joi.number().required(),
			password: Joi.string().required(),
		},
	}),
	cashierMovimentsController.open,
)

cashierMovimentsRoutes.post(
	'/close',
	celebrate({
		[Segments.BODY]: {
			observation: Joi.string().required(),
		},
	}),
	cashierMovimentsController.close,
)

cashierMovimentsRoutes.post(
	'/finish-payment',
	celebrate({
		[Segments.BODY]: {
			table_id: Joi.string().required(),
			payments: Joi.array().items(
				Joi.object({
					value: Joi.number().required(),
					type: Joi.number().required(),
				}),
			),
		},
	}),
	cashierMovimentsController.createMany,
)

cashierMovimentsRoutes.get('/', cashierMovimentsController.index)

cashierMovimentsRoutes.get('/situation', cashierMovimentsController.show)

export default cashierMovimentsRoutes
