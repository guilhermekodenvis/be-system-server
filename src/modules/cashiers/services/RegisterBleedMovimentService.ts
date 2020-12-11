import IHashProvider from '@modules/users/providers/HashProvider/models/IHashProvider'
import IUsersRepository from '@modules/users/repositories/IUsersRepository'
import AppError from '@shared/errors/AppError'
import { inject, injectable } from 'tsyringe'
import { v4 } from 'uuid'
import IOpenCashierDTO from '../dtos/IOpenCashierDTO'
import {
	BLEED_MOVIMENT,
	OPEN_CASHIER_MOVIMENT,
	PAYBACK_MOVIMENT,
	PAY_WITH_MONEY_MOVIMENT,
} from '../enums/cashierMovimentActions'
import Cashier from '../infra/typeorm/schemas/Cashier'
import ICashiersRepository from '../repositories/ICashiersRepository'

@injectable()
export default class RegisterBleedMovimentService {
	constructor(
		@inject('CashiersRepository')
		private cashiersRepository: ICashiersRepository,

		@inject('HashProvider')
		private hashProvider: IHashProvider,

		@inject('UsersRepository')
		private usersRepository: IUsersRepository,
	) {}

	public async run({
		user_id,
		value,
		password,
	}: IOpenCashierDTO): Promise<Cashier> {
		const user = await this.usersRepository.findById(user_id)

		if (!user) {
			throw new AppError('O usuário não foi encontrado')
		}

		const passwordVerify = await this.hashProvider.compareHash(
			password,
			user.password,
		)

		if (!passwordVerify) {
			throw new AppError('A senha não é válida.')
		}

		const cashier = await this.cashiersRepository.findCashierByUserId(user_id)

		if (!cashier) {
			throw new AppError('Caixa não encontrado')
		}

		const totalMoneyInCashier = cashier.working_dates[
			cashier.working_dates.length - 1
		].registers.reduce((total, current) => {
			if (
				current.action === BLEED_MOVIMENT ||
				current.action === PAYBACK_MOVIMENT
			) {
				return total - current.value
			}
			if (
				current.action === OPEN_CASHIER_MOVIMENT ||
				current.action === PAY_WITH_MONEY_MOVIMENT
			) {
				return total + current.value
			}
			return total
		}, 0)

		if (totalMoneyInCashier < value) {
			throw new AppError(
				'Não será possível registrar uma sangria com valor maior do que a quantidade de dinheiro em caixa',
			)
		}

		cashier.working_dates[cashier.working_dates.length - 1].registers.push({
			action: BLEED_MOVIMENT,
			key: v4(),
			value,
		})

		await this.cashiersRepository.update(cashier)

		return cashier
	}
}
