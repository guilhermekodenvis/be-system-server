import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated'
import { Router } from 'express'
import { celebrate, Joi, Segments } from 'celebrate'
import TableRequestsController from '../controllers/TableRequestsController'
import ProducstInTableRequestController from '../controllers/ProducstInTableRequestController'

const tableResquestsRoutes = Router()
const tableRequestsController = new TableRequestsController()
const producstInTableRequestController = new ProducstInTableRequestController()

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
	'/add-products',
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
			table_id: Joi.string().required(),
		},
	}),
	producstInTableRequestController.create,
)

tableResquestsRoutes.get('/', tableRequestsController.index)

tableResquestsRoutes.get('/:id', producstInTableRequestController.show)

export default tableResquestsRoutes
