import { Router } from 'express'

import usersRouter from '@modules/users/infra/http/routes/users.routes'
import sessionsRouter from '@modules/users/infra/http/routes/sessions.routes'
import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated'
import passwordRouter from '@modules/users/infra/http/routes/password.routes'
import productsRouter from '@modules/products/infra/http/routes/products.routes'
import cashierMovimentsRoutes from '@modules/cashier_moviments/infra/http/routes/cashier_moviments.routes'

const routes = Router()

routes.get('/', ensureAuthenticated, (req, res) => res.send('eae parcero!!!'))

routes.use('/users', usersRouter)
routes.use('/sessions', sessionsRouter)
routes.use('/password', passwordRouter)
routes.use('/products', productsRouter)
routes.use('/cashier-moviments', cashierMovimentsRoutes)

export default routes
