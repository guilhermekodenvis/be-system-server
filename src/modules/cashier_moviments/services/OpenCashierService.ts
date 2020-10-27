import { inject, injectable } from 'tsyringe'
import ICashierMovimentDTO from '../dtos/ICashierMovimentDTO'
import CashierMoviment from '../infra/typeorm/entities/CashierMoviment'
import { OPEN_CASHIER_MOVIMENT } from '../infra/typeorm/repositories/CashierMovimentsRepository'
import ICashierMovimentsRepository from '../repositories/ICashierMovimentsRepository'

@injectable()
export default class OpenCashierService {
	constructor(
		@inject('CashierMovimentsRepository')
		private cashierMovimentsRepository: ICashierMovimentsRepository,
	) {}

	public async run({
		value,
		user_id,
	}: ICashierMovimentDTO): Promise<CashierMoviment> {
		return this.cashierMovimentsRepository.create({
			value,
			user_id,
			action: OPEN_CASHIER_MOVIMENT,
		})
	}
}
