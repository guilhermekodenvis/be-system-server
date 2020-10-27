import { injectable, inject } from 'tsyringe'

import AppError from '@shared/errors/AppError'
import IHashProvider from '../providers/HashProvider/models/IHashProvider'
import IUsersRepository from '../repositories/IUsersRepository'

import User from '../infra/typeorm/entities/User'

interface IRequest {
	user_id: string
	user_name: string
	restaurant_name: string
	email: string
	old_password?: string
	password?: string
	cnpj: string
}

@injectable()
class UpdateProfileService {
	constructor(
		@inject('UsersRepository')
		private usersRepository: IUsersRepository,

		@inject('HashProvider')
		private hashProvider: IHashProvider,
	) {}

	public async run({
		user_id,
		restaurant_name,
		user_name,
		cnpj,
		email,
		old_password,
		password,
	}: IRequest): Promise<User> {
		const user = await this.usersRepository.findById(user_id)

		if (!user) {
			throw new AppError('Usuário não encontrado.')
		}

		const userWithUpdatedEmail = await this.usersRepository.findByEmail(email)

		if (userWithUpdatedEmail && userWithUpdatedEmail.id !== user_id) {
			throw new AppError('O e-mail já está em uso.')
		}

		user.restaurant_name = restaurant_name
		user.user_name = user_name
		user.email = email
		user.cnpj = cnpj

		if (password && !old_password) {
			throw new AppError('Informe a senha antiga para poder trocar de senha.')
		}

		if (password && old_password) {
			const checkOldPassword = await this.hashProvider.compareHash(
				old_password,
				user.password,
			)

			if (!checkOldPassword) {
				throw new AppError('A senha antiga está errada.')
			}

			user.password = await this.hashProvider.generateHash(password)
		}

		return this.usersRepository.save(user)
	}
}

export default UpdateProfileService
