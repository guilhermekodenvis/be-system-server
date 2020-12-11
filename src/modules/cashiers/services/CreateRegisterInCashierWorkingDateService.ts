import AppError from '@shared/errors/AppError'
import { inject, injectable } from 'tsyringe'
import { v4 } from 'uuid'
import ICreateNewRegisterDTO from '../dtos/ICreateNewRegisterDTO'
import {
	BLEED_MOVIMENT,
	CLOSE_CASHIER_MOVIMENT,
	OPEN_CASHIER_MOVIMENT,
} from '../enums/cashierMovimentActions'
import Register from '../infra/typeorm/schemas/Register'
import ICashiersRepository from '../repositories/ICashiersRepository'

@injectable()
export default class CreateRegisterInCashierWorkingDateService {
	constructor(
		@inject('CashiersRepository')
		private cashiersRepository: ICashiersRepository,
	) {}

	public async run({
		action,
		value,
		user_id,
	}: Omit<ICreateNewRegisterDTO, 'working_date_id'>): Promise<Register> {
		if (
			[BLEED_MOVIMENT, OPEN_CASHIER_MOVIMENT, CLOSE_CASHIER_MOVIMENT].includes(
				action,
			)
		) {
			throw new AppError('movimento não permitido.')
		}

		const cashier = await this.cashiersRepository.findCashierByUserId(user_id)

		if (!cashier) {
			throw new AppError('cannot insert in cashier that dont exists.')
		}

		const register = new Register()
		register.action = action
		register.key = v4()
		register.value = value

		cashier.working_dates[cashier.working_dates.length - 1].registers.push(
			register,
		)

		await this.cashiersRepository.update(cashier)

		return register
	}
}
