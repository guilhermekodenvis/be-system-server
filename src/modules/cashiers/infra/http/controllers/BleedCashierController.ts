import RegisterBleedMovimentService from '@modules/cashiers/services/RegisterBleedMovimentService'
import { Request, Response } from 'express'
import { container } from 'tsyringe'

export default class BleedCashierController {
	public async create(request: Request, response: Response): Promise<Response> {
		const { id: user_id } = request.user
		const { password, value } = request.body
		const bleedCashier = container.resolve(RegisterBleedMovimentService)
		const register = await bleedCashier.run({ user_id, password, value })

		return response.status(201).json(register)
	}
}
