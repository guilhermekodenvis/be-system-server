import IHashProvider from '@modules/users/providers/HashProvider/models/IHashProvider'
import IUsersRepository from '@modules/users/repositories/IUsersRepository'
import AppError from '@shared/errors/AppError'
import { inject, injectable } from 'tsyringe'
import IRegisterCashierMovimentDTO from '../dtos/IRegisterCashierMovimentDTO'
import CashierMoviment from '../infra/typeorm/entities/CashierMoviment'
import ICashierMovimentsRepository from '../repositories/ICashierMovimentsRepository'

@injectable()
export default class RegisterCashierMovimentService {
	constructor(
		@inject('CashierMovimentsRepository')
		private cashierMovimentsRepository: ICashierMovimentsRepository,

		@inject('UsersRepository')
		private usersRepository: IUsersRepository,

		@inject('HashProvider')
		private hashProvider: IHashProvider,
	) {}

	public async run({
		value,
		user_id,
		action,
		password,
	}: IRegisterCashierMovimentDTO): Promise<CashierMoviment> {
		const user = await this.usersRepository.findById(user_id)

		if (!user) throw new AppError('Bah! o usuário não foi encontrado')

		const passwordMatched = await this.hashProvider.compareHash(
			password,
			user.password,
		)

		if (!passwordMatched) {
			throw new AppError('Senha incorreta, tente novamente.')
		}

		const openedCashier = await this.cashierMovimentsRepository.create({
			value,
			user_id,
			action,
		})

		console.log(openedCashier)

		return openedCashier
	}
}
