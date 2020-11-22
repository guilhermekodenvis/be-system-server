import AppError from '@shared/errors/AppError'
import { injectable, inject } from 'tsyringe'
import User from '../infra/typeorm/entities/User'
import IHashProvider from '../providers/HashProvider/models/IHashProvider'
import IUsersRepository from '../repositories/IUsersRepository'

interface IRequest {
	old_password: string
	password: string
	user_id: string
}

@injectable()
export default class UpdatePasswordService {
	constructor(
		@inject('UsersRepository')
		private usersRepository: IUsersRepository,

		@inject('HashProvider')
		private hashProvider: IHashProvider,
	) {}

	public async run({
		password,
		old_password,
		user_id,
	}: IRequest): Promise<User> {
		const user = await this.usersRepository.findById(user_id)

		if (!user) {
			throw new AppError('Usuário não encontrado')
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

			const savedUser = await this.usersRepository.save(user)

			return savedUser
		}
		throw new AppError('Informe a senha nova e a antiga para continuar')
	}
}
