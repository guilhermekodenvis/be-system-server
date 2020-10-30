import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated'
import { Router } from 'express'
import { celebrate, Joi, Segments } from 'celebrate'
import TableRequestsController from '../controllers/TableRequestsController'

const tableResquestsRoutes = Router()
const tableRequestsController = new TableRequestsController()

tableResquestsRoutes.use(ensureAuthenticated)

tableResquestsRoutes.post(
	'/',
	celebrate({
		[Segments.BODY]: {
			table_number: Joi.number().required(),
		},
	}),
	tableRequestsController.create,
)

tableResquestsRoutes.post(
	'/create-table',
	celebrate({
		[Segments.BODY]: {
			products: Joi.array().items(
				Joi.object({
					product_id: Joi.string().required(),
					quantity: Joi.number().default(1),
					product_price: Joi.number(),
					product_name: Joi.string().required(),
					observation: Joi.string(),
				}),
			),
			table_number: Joi.number(),
			user_id: Joi.string().required(),
			table_id: Joi.string(),
		},
	}),
	tableRequestsController.create,
)

export default tableResquestsRoutes
