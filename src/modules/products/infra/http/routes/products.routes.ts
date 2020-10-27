import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated'
import { Router } from 'express'
import ProductsController from '../controllers/ProductsController'

const productsRouter = Router()
const productsController = new ProductsController()

productsRouter.use(ensureAuthenticated)

productsRouter.get('/', productsController.index)
productsRouter.post('/', productsController.create)
productsRouter.put('/:product_id', productsController.update)
productsRouter.delete('/:product_id', productsController.delete)
productsRouter.get('/:product_id', productsController.show)

export default productsRouter
