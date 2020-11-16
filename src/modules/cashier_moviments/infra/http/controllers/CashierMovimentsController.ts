import CreateManyCashierMovimentsService from '@modules/cashier_moviments/services/CreateManyCashierMovimentsService'
import RegisterCashierMovimentService from '@modules/cashier_moviments/services/RegisterCashierMovimentService'
import CloseCashierMovimentService from '@modules/cashier_moviments/services/CloseCashierMovimentService'
import { Request, Response } from 'express'
import { container } from 'tsyringe'
import GetMovimentsToCloseCashierService from '@modules/cashier_moviments/services/GetMovimentsToCloseCashierService'
import GetCashierSituationService from '@modules/cashier_moviments/services/GetCashierSituationService'

export default class CashierMovimentsController {
	public async open(request: Request, response: Response): Promise<Response> {
		const { value, password } = request.body
		const action = 0
		const { id: user_id } = request.user

		const openCashierMoviment = container.resolve(
			RegisterCashierMovimentService,
		)

		const cashierMoviment = await openCashierMoviment.run({
			value,
			user_id,
			action,
			password,
		})

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

	public async show(request: Request, response: Response): Promise<Response> {
		const getCashierSituation = container.resolve(GetCashierSituationService)

		const { id } = request.user
		const cashierSituation = await getCashierSituation.run({
			user_id: id,
		})

		return response.json(cashierSituation)
	}
}
