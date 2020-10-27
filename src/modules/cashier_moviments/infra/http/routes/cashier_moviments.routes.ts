import OpenCashierService from '@modules/cashier_moviments/services/OpenCashierService'
import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated'
import { Router } from 'express'
import { container } from 'tsyringe'

const cashierMovimentsRoutes = Router()
cashierMovimentsRoutes.use(ensureAuthenticated)

cashierMovimentsRoutes.post('/open-cashier', (req, res) => {
	const openCashierMoviment = container.resolve(OpenCashierService)
	const { value, user_id } = req.body
	const cashierMoviment = openCashierMoviment.run({ value, user_id })

	return res.status(201).json(cashierMoviment)
})

export default cashierMovimentsRoutes
