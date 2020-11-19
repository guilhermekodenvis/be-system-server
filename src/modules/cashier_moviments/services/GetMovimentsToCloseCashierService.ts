import { inject, injectable } from 'tsyringe'
import { getMonth, getYear, getDate } from 'date-fns'
import IGetMovimentsDTO from '../dtos/IGetMovimentsDTO'
import CashierMoviment, {
	BLEED_MOVIMENT,
	OPEN_CASHIER_MOVIMENT,
	PAYBACK_MOVIMENT,
	PAY_WITH_CREDIT_MOVIMENT,
	PAY_WITH_DEBIT_MOVIMENT,
	PAY_WITH_MONEY_MOVIMENT,
} from '../infra/typeorm/entities/CashierMoviment'
import ICashierMovimentsRepository from '../repositories/ICashierMovimentsRepository'

interface ICloseCashierDTO {
	cashier_moviments: CashierMoviment[]
	money_in_cashier: number
	brute_total_money: number
}

@injectable()
export default class GetMovimentsToCloseCashierService {
	constructor(
		@inject('CashierMovimentsRepository')
		private cashierMovimentsRepository: ICashierMovimentsRepository,
	) {}

	public async run({
		user_id,
	}: Omit<IGetMovimentsDTO, 'date'>): Promise<ICloseCashierDTO> {
		const currentDate = new Date()
		const date = {
			day: getDate(currentDate),
			month: getMonth(currentDate),
			year: getYear(currentDate),
		}
		const cashierMoviments = await this.cashierMovimentsRepository.getAllMovimentsOfTheDay(
			{ user_id, date },
		)

		let moneyInCashier = 0
		cashierMoviments.forEach(cashierMoviment => {
			if (
				cashierMoviment.action === OPEN_CASHIER_MOVIMENT ||
				cashierMoviment.action === PAY_WITH_MONEY_MOVIMENT
			) {
				moneyInCashier += Number(cashierMoviment.value)
			}
			if (
				cashierMoviment.action === BLEED_MOVIMENT ||
				cashierMoviment.action === PAYBACK_MOVIMENT
			) {
				moneyInCashier -= Number(cashierMoviment.value)
			}
		})

		let bruteTotalMoney = 0
		cashierMoviments.forEach(cashierMoviment => {
			if (
				cashierMoviment.action === PAY_WITH_MONEY_MOVIMENT ||
				cashierMoviment.action === PAY_WITH_CREDIT_MOVIMENT ||
				cashierMoviment.action === PAY_WITH_DEBIT_MOVIMENT
			) {
				bruteTotalMoney += Number(cashierMoviment.value)
			}
			if (cashierMoviment.action === PAYBACK_MOVIMENT) {
				bruteTotalMoney -= Number(cashierMoviment.value)
			}
		})

		const closeCashierObject = {
			cashier_moviments: [...cashierMoviments],
			money_in_cashier: moneyInCashier,
			brute_total_money: bruteTotalMoney,
		}

		return closeCashierObject
	}
}
