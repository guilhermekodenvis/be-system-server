import { inject, injectable } from 'tsyringe'
import ICashiersRepository from '../repositories/ICashiersRepository'

@injectable()
export default class GetCashierSituationService {
	constructor(
		@inject('CashiersRepository')
		private cashiersRepository: ICashiersRepository,
	) {}

	public async run({ user_id }: { user_id: string }): Promise<boolean> {
		const cashier = await this.cashiersRepository.findCashierByUserId(user_id)

		if (!cashier) {
			return false
		}

		return cashier.is_open
	}
}
