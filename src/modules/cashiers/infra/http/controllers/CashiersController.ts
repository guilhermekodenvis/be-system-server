import GetCashierSituationService from '@modules/cashiers/services/GetCashierSituationService'
import { Request, Response } from 'express'
import { container } from 'tsyringe'

export default class CashiersController {
	public async show(request: Request, response: Response): Promise<Response> {
		const { id } = request.user

		const getCashierSituation = container.resolve(GetCashierSituationService)

		const isOpen = await getCashierSituation.run({ user_id: id })

		return response.status(200).json({ isOpen })
	}

	public async index(request: Request, response: Response): Promise<Response> {
		return response.send('eae')
	}
}
