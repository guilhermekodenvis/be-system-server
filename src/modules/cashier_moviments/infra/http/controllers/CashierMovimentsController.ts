import CreateManyCashierMovimentsService from '@modules/cashier_moviments/services/CreateManyCashierMovimentsService'
import RegisterCashierMovimentService from '@modules/cashier_moviments/services/RegisterCashierMovimentService'
import { Request, Response } from 'express'
import { container } from 'tsyringe'

export default class CashierMovimentsController {
	public async create(request: Request, response: Response): Promise<Response> {
		const openCashierMoviment = container.resolve(
			RegisterCashierMovimentService,
		)
		const { value } = request.body
		const action = 1
		const { id: user_id } = request.user
		const cashierMoviment = openCashierMoviment.run({ value, user_id, action })

		return response.status(201).json(cashierMoviment)
	}

	public async createMany(
		request: Request,
		response: Response,
	): Promise<Response> {
		const { payments, table_id } = request.body
		const { id } = request.user

		const createManyCashierMoviments = container.resolve(
			CreateManyCashierMovimentsService,
		)
		await createManyCashierMoviments.run({
			payments,
			user_id: id,
			table_id,
		})

		return response.status(201).json('ok')
	}
}
