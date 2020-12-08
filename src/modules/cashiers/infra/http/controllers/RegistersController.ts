import { Request, Response } from 'express'
import { container } from 'tsyringe'
import CreateRegisterInCashierWorkingDateService from '@modules/cashiers/services/CreateRegisterInCashierWorkingDateService'

export default class RegistersController {
	public async create(request: Request, response: Response): Promise<Response> {
		const { value, action } = request.body
		const { id: user_id } = request.user

		const createRegisterInCashier = container.resolve(
			CreateRegisterInCashierWorkingDateService,
		)

		const cashierMoviment = await createRegisterInCashier.run({
			value,
			user_id,
			action,
		})

		return response.json(cashierMoviment).status(201)
	}
}
