import { Router } from 'express'

import usersRouter from '@modules/users/infra/http/routes/users.routes'
import sessionsRouter from '@modules/users/infra/http/routes/sessions.routes'
import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated'
import passwordRouter from '@modules/users/infra/http/routes/password.routes'
import productsRouter from '@modules/products/infra/http/routes/products.routes'
import cashierMovimentsRoutes from '@modules/cashier_moviments/infra/http/routes/cashier_moviments.routes'
import tableResquestsRoutes from '@modules/table_requests/infra/http/routes/tableRequests.routes'
import profileRouter from '@modules/users/infra/http/routes/profile.routes'

const routes = Router()

routes.get('/', ensureAuthenticated, (req, res) => res.send('eae parcero!!!'))

routes.use('/users', usersRouter)
routes.use('/sessions', sessionsRouter)
routes.use('/password', passwordRouter)
routes.use('/products', productsRouter)
routes.use('/profile', profileRouter)
routes.use('/cashier-moviments', cashierMovimentsRoutes)
routes.use('/table-request', tableResquestsRoutes)

export default routes
