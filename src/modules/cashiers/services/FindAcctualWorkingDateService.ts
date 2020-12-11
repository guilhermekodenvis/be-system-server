import AppError from '@shared/errors/AppError'
import { inject, injectable } from 'tsyringe'
import WorkingDate from '../infra/typeorm/schemas/WorkingDate'
import ICashiersRepository from '../repositories/ICashiersRepository'

@injectable()
export default class FindAcctualWorkingDateService {
	constructor(
		@inject('CashiersRepository')
		private cashiersRepository: ICashiersRepository,
	) {}

	public async run(user_id: string): Promise<WorkingDate> {
		const cashier = await this.cashiersRepository.findCashierByUserId(user_id)
		if (!cashier) {
			throw new AppError('cashier not found')
		}
		return cashier.working_dates[cashier.working_dates.length - 1]
	}
}
