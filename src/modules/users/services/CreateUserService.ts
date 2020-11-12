import { injectable, inject } from 'tsyringe'

import AppError from '@shared/errors/AppError'
// import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import IUsersRepository from '../repositories/IUsersRepository'
import IHashProvider from '../providers/HashProvider/models/IHashProvider'

import User from '../infra/typeorm/entities/User'
import ICreateUserDTO from '../dtos/ICreateUserDTO'

@injectable()
class CreateUserService {
	constructor(
		@inject('UsersRepository')
		private usersRepository: IUsersRepository,

		@inject('HashProvider')
		private hashProvider: IHashProvider, // @inject('CacheProvider') // private cacheProvider: ICacheProvider,
	) {}

	public async run({
		restaurant_name,
		user_name,
		email,
		password,
		cnpj,
	}: ICreateUserDTO): Promise<User> {
		const checkUserEmailExists = await this.usersRepository.findByEmail(email)

		console.log(checkUserEmailExists)
		if (checkUserEmailExists) {
			throw new AppError('Ops! O e-mail já está em uso...')
		}

		const checkUserCnpjExists = await this.usersRepository.findByCnpj(cnpj)

		if (checkUserCnpjExists) {
			throw new AppError('Ops! O cnpj já está em uso...')
		}

		const hashedPassword = await this.hashProvider.generateHash(password)

		const user = await this.usersRepository.create({
			restaurant_name,
			user_name,
			email,
			password: hashedPassword,
			cnpj,
		})

		// await this.cacheProvider.invalidatePrefix('providers-list');

		return user
	}
}

export default CreateUserService
