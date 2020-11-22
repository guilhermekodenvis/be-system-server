import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated'
import { Router } from 'express'
import CategoriesController from '../controllers/CategoriesController'

const categoriesRouter = Router()
const categoriesController = new CategoriesController()

categoriesRouter.use(ensureAuthenticated)

categoriesRouter.get('/', categoriesController.index)

export default categoriesRouter
