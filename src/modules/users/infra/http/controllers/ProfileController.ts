import { Request, Response } from 'express'
import { container } from 'tsyringe'
// import { classToClass } from 'class-transformer'

import UpdateProfileService from '@modules/users/services/UpdateProfileService'
import ShowProfileService from '@modules/users/services/ShowProfileService'

export default class Profilecontroller {
	public async show(request: Request, response: Response): Promise<Response> {
		const user_id = request.user.id

		const showProfile = container.resolve(ShowProfileService)

		const user = await showProfile.run({ user_id })

		// return response.json(classToClass(user))
		return response.json(user)
	}

	public async update(request: Request, response: Response): Promise<Response> {
		const user_id = request.user.id
		const {
			restaurant_name,
			user_name,
			email,
			old_password,
			password,
			cnpj,
		} = request.body

		const updateProfile = container.resolve(UpdateProfileService)

		const user = await updateProfile.run({
			user_id,
			restaurant_name,
			user_name,
			email,
			old_password,
			password,
			cnpj,
		})

		// return response.json(classToClass(user))
		return response.json(user)
	}
}
