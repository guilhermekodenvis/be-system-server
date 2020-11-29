import AppError from '@shared/errors/AppError'
import { inject, injectable } from 'tsyringe'
import ICreateNewRegisterDTO from '../dtos/ICreateNewRegisterDTO'
import {
	BLEED_MOVIMENT,
	OPEN_CASHIER_MOVIMENT,
	PAYBACK_MOVIMENT,
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
		working_date_id,
	}: ICreateNewRegisterDTO): Promise<Register> {
		if (action === OPEN_CASHIER_MOVIMENT) {
			throw new AppError(
				'não será possível registrar uma nova abertura num dia de trabalho em andamento.',
			)
		}

		let realValue = 0
		if (action === BLEED_MOVIMENT || action === PAYBACK_MOVIMENT) {
			realValue = value * -1
		} else {
			realValue = value
		}

		if (action === BLEED_MOVIMENT) {
			const totalMoneyInCashier = await this.cashiersRepository.getMoneyInCashier(
				{
					user_id,
					working_date_id,
				},
			)

			console.log(totalMoneyInCashier, value)
			if (totalMoneyInCashier < value) {
				throw new AppError(
					'Não será possível registrar uma sangria com valor maior do que a quantidade de dinheiro em caixa',
				)
			}
		}

		const register = await this.cashiersRepository.createRegisterInCashierWorkingDate(
			{
				action,
				working_date_id,
				value: realValue,
				user_id,
			},
		)

		return register
	}
}
// TODO: FAZER FECHAMENTO DO CAIXA E FAZER REGISTRO DE NOVO PAGAMENTO E FAZER SANGRIA
