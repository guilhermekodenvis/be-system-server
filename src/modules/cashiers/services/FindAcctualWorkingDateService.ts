import AppError from '@shared/errors/AppError'
import { inject, injectable } from 'tsyringe'
import {
	BLEED_MOVIMENT,
	OPEN_CASHIER_MOVIMENT,
	PAYBACK_MOVIMENT,
	PAY_WITH_CREDIT_MOVIMENT,
	PAY_WITH_DEBIT_MOVIMENT,
	PAY_WITH_MONEY_MOVIMENT,
} from '../enums/cashierMovimentActions'
import Register from '../infra/typeorm/schemas/Register'
import ICashiersRepository from '../repositories/ICashiersRepository'

interface ICashierDateDTO {
	registers: Register[]
	money_in_cashier: number
	final_ammount: number
}
@injectable()
export default class FindAcctualWorkingDateService {
	constructor(
		@inject('CashiersRepository')
		private cashiersRepository: ICashiersRepository,
	) {}

	public async run(user_id: string): Promise<ICashierDateDTO> {
		const cashier = await this.cashiersRepository.findCashierByUserId(user_id)
		if (!cashier) {
			throw new AppError('cashier not found')
		}
		const { registers } = cashier.working_dates[
			cashier.working_dates.length - 1
		]
		const totalMoneyInCashier = registers.reduce((total, current) => {
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

		const totalInActualDate = registers.reduce((total, current) => {
			if (current.action === PAYBACK_MOVIMENT) {
				return total - current.value
			}
			if (
				current.action === PAY_WITH_MONEY_MOVIMENT ||
				current.action === PAY_WITH_CREDIT_MOVIMENT ||
				current.action === PAY_WITH_DEBIT_MOVIMENT
			) {
				return total + current.value
			}
			return total
		}, 0)

		const finalRegister = {
			registers: [...registers],
			money_in_cashier: totalMoneyInCashier,
			final_ammount: totalInActualDate,
		}

		return finalRegister
	}
}
