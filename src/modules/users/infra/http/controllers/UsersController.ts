import { Request, Response } from 'express'
import { container } from 'tsyringe'
// import { classToClass } from 'class-transformer';

import CreateUserService from '@modules/users/services/CreateUserService'

export default class UsersController {
	public async create(request: Request, response: Response): Promise<Response> {
		const { restaurant_name, user_name, email, password, cnpj } = request.body

		const createUser = container.resolve(CreateUserService)

		const user = await createUser.run({
			restaurant_name,
			user_name,
			email,
			password,
			cnpj,
		})

		return response.status(201).json(user)
		// return response.json(classToClass(user));
	}
}
