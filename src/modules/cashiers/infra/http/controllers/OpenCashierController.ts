import OpenCashierService from '@modules/cashiers/services/OpenCashierService'
import { Request, Response } from 'express'
import { container } from 'tsyringe'

export default class OpenCashierController {
	public async create(request: Request, response: Response): Promise<Response> {
		const { id } = request.user
		const { password, value } = request.body
		const openCashier = container.resolve(OpenCashierService)

		const cashier = await openCashier.run({
			password,
			user_id: id,
			value,
		})

		return response.status(201).json(cashier)
	}
}
