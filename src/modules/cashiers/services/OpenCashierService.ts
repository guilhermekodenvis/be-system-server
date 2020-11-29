import IHashProvider from '@modules/users/providers/HashProvider/models/IHashProvider'
import IUsersRepository from '@modules/users/repositories/IUsersRepository'
import AppError from '@shared/errors/AppError'
import { inject, injectable } from 'tsyringe'
import { getDate, getMonth, getYear } from 'date-fns'
import IOpenCashierDTO from '../dtos/IOpenCashierDTO'
import Cashier from '../infra/typeorm/schemas/Cashier'
import ICashiersRepository from '../repositories/ICashiersRepository'
import { OPEN_CASHIER_MOVIMENT } from '../enums/cashierMovimentActions'

@injectable()
export default class OpenCashierService {
	constructor(
		@inject('CashiersRepository')
		private cashiersRepository: ICashiersRepository,

		@inject('HashProvider')
		private hashProvider: IHashProvider,

		@inject('UsersRepository')
		private usersRepository: IUsersRepository,
	) {}

	public async run({
		value,
		password,
		user_id,
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

		const isCashierAlreadyOpen = await this.cashiersRepository.getCashierSituation(
			user_id,
		)

		if (isCashierAlreadyOpen) {
			throw new AppError('Não pode abrir o caixa que já está aberto.')
		}

		const cashier = await this.cashiersRepository.openCashier({
			user_id,
			value,
		})

		const today = Date.now()

		const workingDate = await this.cashiersRepository.startNewWorkingDate({
			day: getDate(today),
			month: getMonth(today),
			year: getYear(today),
			user_id,
		})

		await this.cashiersRepository.createRegisterInCashierWorkingDate({
			action: OPEN_CASHIER_MOVIMENT,
			user_id,
			value,
			working_date_id: workingDate.id,
		})

		return cashier
	}
}
