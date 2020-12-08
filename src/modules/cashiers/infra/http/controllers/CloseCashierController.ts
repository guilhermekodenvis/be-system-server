import CloseCashierService from '@modules/cashiers/services/CloseCashierService'
import { Request, Response } from 'express'
import { container } from 'tsyringe'

export default class OpenCashierController {
	public async create(request: Request, response: Response): Promise<Response> {
		const { id } = request.user
		const { password } = request.body
		const closeCashier = container.resolve(CloseCashierService)

		const cashier = closeCashier.run({
			password,
			user_id: id,
		})

		return response.status(201).json(cashier)
	}
}
