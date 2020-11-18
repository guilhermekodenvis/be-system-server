import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated'
import { Router } from 'express'
import { celebrate, Segments, Joi } from 'celebrate'
import ProductsController from '../controllers/ProductsController'

const productsRouter = Router()
const productsController = new ProductsController()

productsRouter.use(ensureAuthenticated)

productsRouter.get('/', productsController.index)
productsRouter.post(
	'/',
	celebrate({
		[Segments.BODY]: {
			name: Joi.string().required(),
			price: Joi.number().required(),
			category: Joi.string().required(),
			description: Joi.string().default(''),
			ingredients: Joi.string().default(''),
		},
	}),
	productsController.create,
)
productsRouter.get('/categories', productsController.categories)

productsRouter.put(
	'/:product_id',
	celebrate({
		[Segments.BODY]: {
			name: Joi.string().required(),
			price: Joi.number().required(),
			category: Joi.string().required(),
			description: Joi.string().default(''),
			ingredients: Joi.string().default(''),
		},
	}),
	productsController.update,
)
productsRouter.delete('/:product_id', productsController.delete)

productsRouter.get('/:product_id', productsController.show)

export default productsRouter
