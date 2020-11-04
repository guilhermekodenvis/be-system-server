import CreateManyCashierMovimentsService from '@modules/cashier_moviments/services/CreateManyCashierMovimentsService'
import RegisterCashierMovimentService from '@modules/cashier_moviments/services/RegisterCashierMovimentService'
import CloseCashierMovimentService from '@modules/cashier_moviments/services/CloseCashierMovimentService'
import { Request, Response } from 'express'
import { container } from 'tsyringe'
import GetMovimentsToCloseCashierService from '@modules/cashier_moviments/services/GetMovimentsToCloseCashierService'

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

	public async close(request: Request, response: Response): Promise<Response> {
		const closeCashierMoviment = container.resolve(CloseCashierMovimentService)
		const { observation } = request.body
		const action = 6
		const { id: user_id } = request.user
		const cashierMoviment = closeCashierMoviment.run({
			observation,
			user_id,
			action,
		})

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

	public async index(request: Request, response: Response): Promise<Response> {
		const getMovimentsToCloseCashier = container.resolve(
			GetMovimentsToCloseCashierService,
		)

		const { id } = request.user
		const cashierMoviments = await getMovimentsToCloseCashier.run({
			user_id: id,
		})

		return response.json(cashierMoviments)
	}
}
