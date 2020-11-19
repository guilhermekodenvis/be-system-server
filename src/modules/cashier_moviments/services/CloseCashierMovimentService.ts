import IHashProvider from '@modules/users/providers/HashProvider/models/IHashProvider'
import IUsersRepository from '@modules/users/repositories/IUsersRepository'
import AppError from '@shared/errors/AppError'
import { inject, injectable } from 'tsyringe'
import ICloseCashierDTO from '../dtos/ICloseCashierDTO'
import ICashierMovimentsRepository from '../repositories/ICashierMovimentsRepository'

@injectable()
export default class CloseCashierMovimentService {
	constructor(
		@inject('CashierMovimentsRepository')
		private cashierMovimentsRepository: ICashierMovimentsRepository,

		@inject('UsersRepository')
		private usersRepository: IUsersRepository,

		@inject('HashProvider')
		private hashProvider: IHashProvider,
	) {}

	public async run({
		action,
		// observation,
		user_id,
		password,
	}: ICloseCashierDTO): Promise<void> {
		const user = await this.usersRepository.findById(user_id)

		if (!user) throw new AppError('Bah! o usuário não foi encontrado')

		const passwordMatched = await this.hashProvider.compareHash(
			password,
			user.password,
		)

		if (!passwordMatched) {
			throw new AppError('Senha incorreta, tente novamente.')
		}

		this.cashierMovimentsRepository.create({
			action,
			user_id,
			value: 0,
		})
	}
}
