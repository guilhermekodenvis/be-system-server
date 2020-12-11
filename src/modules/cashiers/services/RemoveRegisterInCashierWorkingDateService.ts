import AppError from '@shared/errors/AppError'
import { inject, injectable } from 'tsyringe'
import IRemoveRegisterDTO from '../dtos/IRemoveRegisterDTO'
import ICashiersRepository from '../repositories/ICashiersRepository'

@injectable()
export default class RemoveRegisterInCashierWorkingDateService {
	constructor(
		@inject('CashiersRepository')
		private cashiersRepository: ICashiersRepository,
	) {}

	public async run({ id, user_id }: IRemoveRegisterDTO): Promise<void> {
		const cashier = await this.cashiersRepository.findCashierByUserId(user_id)
		if (!cashier) {
			throw new AppError('Caixa não encontrado')
		}

		const registerIndex = cashier.working_dates[
			cashier.working_dates.length - 1
		].registers.findIndex(r => r.key === id)

		cashier.working_dates[cashier.working_dates.length - 1].registers.splice(
			registerIndex,
			1,
		)

		await this.cashiersRepository.update(cashier)
	}
}
