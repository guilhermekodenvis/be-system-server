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
			user_id: Joi.string().required(),
			action: Joi.number().required(),
		},
	}),
	cashierMovimentsController.create,
)

export default cashierMovimentsRoutes
