import IHashProvider from '@modules/users/providers/HashProvider/models/IHashProvider'
import IUsersRepository from '@modules/users/repositories/IUsersRepository'
import AppError from '@shared/errors/AppError'
import { inject, injectable } from 'tsyringe'
import { v4 } from 'uuid'
import ICloseCashierDTO from '../dtos/ICloseCashierDTO'
import { CLOSE_CASHIER_MOVIMENT } from '../enums/cashierMovimentActions'
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

		const cashier = await this.cashiersRepository.findCashierByUserId(user_id)

		if (!cashier) {
			throw new AppError('Caixa não encontrado')
		}

		if (!cashier.is_open) {
			throw new AppError('Não será possível fechar um caixa já fechado.')
		}

		cashier.is_open = false
		cashier.working_dates[cashier.working_dates.length - 1].registers.push({
			action: CLOSE_CASHIER_MOVIMENT,
			key: v4(),
			value: 0,
		})
		await this.cashiersRepository.update(cashier)

		return cashier
	}
}
