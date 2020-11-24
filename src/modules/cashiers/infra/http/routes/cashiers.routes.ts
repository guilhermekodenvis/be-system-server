import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated'
import { celebrate, Segments, Joi } from 'celebrate'
import { Router } from 'express'
import CashiersController from '../controllers/CashiersController'

const cashiersRoutes = Router()
cashiersRoutes.use(ensureAuthenticated)
const cashiersController = new CashiersController()

cashiersRoutes.get('/', cashiersController.index)

cashiersRoutes.post(
	'/',
	celebrate({
		[Segments.BODY]: {
			value: Joi.number().required(),
			action: Joi.number().required(),
		},
	}),
	cashiersController.create,
)

cashiersRoutes.get('/details', cashiersController.show)

export default cashiersRoutes
