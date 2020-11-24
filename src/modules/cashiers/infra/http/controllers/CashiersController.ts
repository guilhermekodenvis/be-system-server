import { Request, Response } from 'express'
import { container } from 'tsyringe'
import GetAllRegistersSinceLastAppertureService from '@modules/cashiers/services/GetAllRegistersSinceLastAppertureService'
import GetCashierSituationService from '@modules/cashiers/services/GetCashierSituationService'
import CreateRegisterInCashierWorkingDateService from '@modules/cashiers/services/CreateRegisterInCashierWorkingDateService'

export default class CashiersController {
	public async index(request: Request, response: Response): Promise<Response> {
		const getMovimentsToCloseCashier = container.resolve(
			GetAllRegistersSinceLastAppertureService,
		)

		const { id } = request.user
		const cashierMoviments = await getMovimentsToCloseCashier.run({
			user_id: id,
		})

		return response.json(cashierMoviments)
	}

	public async show(request: Request, response: Response): Promise<Response> {
		const showCashierMovimentsDetails = container.resolve(
			GetCashierSituationService,
		)

		const { id } = request.user
		const cashierSituation = await showCashierMovimentsDetails.run({
			user_id: id,
		})

		return response.json(cashierSituation)
	}

	public async create(request: Request, response: Response): Promise<Response> {
		const { value, password, action } = request.body
		const { id: user_id } = request.user

		const createMovimentInCashier = container.resolve(
			CreateRegisterInCashierWorkingDateService,
		)

		const cashierMoviment = await createMovimentInCashier.run({
			value,
			user_id,
			action,
			password,
		})

		return response.json(cashierMoviment).status(201)
	}
}
