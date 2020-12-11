import IHashProvider from '@modules/users/providers/HashProvider/models/IHashProvider'
import IUsersRepository from '@modules/users/repositories/IUsersRepository'
import AppError from '@shared/errors/AppError'
import { inject, injectable } from 'tsyringe'
import { getDate, getMonth, getYear } from 'date-fns'
import { v4 } from 'uuid'
import IOpenCashierDTO from '../dtos/IOpenCashierDTO'
import Cashier from '../infra/typeorm/schemas/Cashier'
import ICashiersRepository from '../repositories/ICashiersRepository'
import { OPEN_CASHIER_MOVIMENT } from '../enums/cashierMovimentActions'
import WorkingDate from '../infra/typeorm/schemas/WorkingDate'
import Register from '../infra/typeorm/schemas/Register'

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

		let cashier = await this.cashiersRepository.findCashierByUserId(user_id)

		if (!cashier) {
			cashier = await this.cashiersRepository.create(user_id)
			cashier.working_dates = []
		}

		if (cashier.is_open) {
			throw new AppError('Não pode abrir o caixa que já está aberto.')
		}

		cashier.is_open = true

		const today = Date.now()

		const workingDate = {
			day: getDate(today),
			month: getMonth(today),
			year: getYear(today),
			registers: [],
		} as WorkingDate

		const register = {
			key: v4(),
			action: OPEN_CASHIER_MOVIMENT,
			value,
		} as Register

		workingDate.registers.push(register)

		cashier.working_dates.push(workingDate)

		await this.cashiersRepository.update(cashier)

		return cashier
	}
}
