import IHashProvider from '@modules/users/providers/HashProvider/models/IHashProvider'
import IUsersRepository from '@modules/users/repositories/IUsersRepository'
import AppError from '@shared/errors/AppError'
import { inject, injectable } from 'tsyringe'
import ICloseCashierDTO from '../dtos/ICloseCashierDTO'
import Cashier from '../infra/typeorm/schemas/Cashier'
import ICashiersRepository from '../repositories/ICashiersRepository'

@injectable()
export default class CloseCashierService {
	constructor(
		@inject('CashiersRepository')
		private cashiersRepository: ICashiersRepository,

		@inject('HashProvider')
		private hashProvider: IHashProvider,

		@inject('UsersRepository')
		private usersRepository: IUsersRepository,
	) {}

	public async run({ user_id, password }: ICloseCashierDTO): Promise<Cashier> {
		const user = await this.usersRepository.findById(user_id)
		if (!user) {
			throw new AppError('Usuário não encontrado')
		}

		const passwordVerify = await this.hashProvider.compareHash(
			password,
			user.password,
		)

		if (!passwordVerify) {
			throw new AppError('A senha não corresponde')
		}

		const isOpen = await this.cashiersRepository.getCashierSituation(user_id)

		if (!isOpen) {
			throw new AppError('Não será possível fechar um caixa já fechado.')
		}

		const cashier = await this.cashiersRepository.closeCashier(user_id)

		return cashier
	}
}
