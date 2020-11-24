import { inject, injectable } from 'tsyringe'
import { getMonth, getYear, getDate } from 'date-fns'
import AppError from '@shared/errors/AppError'
import IGetMovimentsDTO from '../dtos/IGetMovimentsDTO'
// import Cashier, {
// 	BLEED_MOVIMENT,
// 	OPEN_CASHIER_MOVIMENT,
// 	PAYBACK_MOVIMENT,
// 	PAY_WITH_CREDIT_MOVIMENT,
// 	PAY_WITH_DEBIT_MOVIMENT,
// 	PAY_WITH_MONEY_MOVIMENT,
// } from '../infra/typeorm/entities/Cashier'
import ICashiersRepository from '../repositories/ICashiersRepository'
import Cashier from '../infra/typeorm/entities/Cashier'

// interface ICloseCashierDTO {
// 	cashiers: Cashier[]
// 	money_in_cashier: number
// 	brute_total_money: number
// }

@injectable()
export default class GetAllRegistersSinceLastAppertureService {
	constructor(
		@inject('CashiersRepository')
		private cashiersRepository: ICashiersRepository,
	) {}

	public async run({
		user_id,
	}: Omit<IGetMovimentsDTO, 'date'>): Promise<Cashier[]> {
		const lastApperture = await this.cashiersRepository.findLastApperture({
			user_id,
		})

		console.log(lastApperture)

		if (!lastApperture) {
			throw new AppError(
				'Ops, algo inesperado aconteceu. A última abertura de caixa não foi localizada.',
			)
		}

		const allRegistersSinceLastApperture = await this.cashiersRepository.findAllSinceLastApperture(
			{ lastAppertureDate: lastApperture.created_at },
		)

		// let moneyInCashier = 0
		// cashierMoviments.forEach(cashierMoviment => {
		// 	if (
		// 		cashierMoviment.action === OPEN_CASHIER_MOVIMENT ||
		// 		cashierMoviment.action === PAY_WITH_MONEY_MOVIMENT
		// 	) {
		// 		moneyInCashier += Number(cashierMoviment.value)
		// 	}
		// 	if (
		// 		cashierMoviment.action === BLEED_MOVIMENT ||
		// 		cashierMoviment.action === PAYBACK_MOVIMENT
		// 	) {
		// 		moneyInCashier -= Number(cashierMoviment.value)
		// 	}
		// })

		// let bruteTotalMoney = 0
		// cashierMoviments.forEach(cashierMoviment => {
		// 	if (
		// 		cashierMoviment.action === PAY_WITH_MONEY_MOVIMENT ||
		// 		cashierMoviment.action === PAY_WITH_CREDIT_MOVIMENT ||
		// 		cashierMoviment.action === PAY_WITH_DEBIT_MOVIMENT
		// 	) {
		// 		bruteTotalMoney += Number(cashierMoviment.value)
		// 	}
		// 	if (cashierMoviment.action === PAYBACK_MOVIMENT) {
		// 		bruteTotalMoney -= Number(cashierMoviment.value)
		// 	}
		// })

		// const closeCashierObject = {
		// 	cashier_moviments: [...cashierMoviments],
		// 	money_in_cashier: moneyInCashier,
		// 	brute_total_money: bruteTotalMoney,
		// }

		// return closeCashierObject
		return allRegistersSinceLastApperture
	}
}
