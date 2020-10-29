import RegisterCashierMovimentService from '@modules/cashier_moviments/services/RegisterCashierMovimentService'
import { Request, Response } from 'express'
import { container } from 'tsyringe'

export default class CashierMovimentsController {
	public async create(request: Request, response: Response): Promise<Response> {
		const openCashierMoviment = container.resolve(
			RegisterCashierMovimentService,
		)
		const { value, user_id, action } = request.body
		const cashierMoviment = openCashierMoviment.run({ value, user_id, action })

		return response.status(201).json(cashierMoviment)
	}
}
