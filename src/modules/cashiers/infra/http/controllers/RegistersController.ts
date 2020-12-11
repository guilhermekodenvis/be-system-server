import { Request, Response } from 'express'
import { container } from 'tsyringe'
import CreateRegisterInCashierWorkingDateService from '@modules/cashiers/services/CreateRegisterInCashierWorkingDateService'
import RemoveRegisterInCashierWorkingDateService from '@modules/cashiers/services/RemoveRegisterInCashierWorkingDateService'

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

	public async delete(request: Request, response: Response): Promise<Response> {
		const { id } = request.params
		const { id: user_id } = request.user

		const removeRegisterInCashier = container.resolve(
			RemoveRegisterInCashierWorkingDateService,
		)

		await removeRegisterInCashier.run({
			id,
			user_id,
		})

		return response.json('ok')
	}
}
