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
		},
	}),
	cashierMovimentsController.create,
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

export default cashierMovimentsRoutes
