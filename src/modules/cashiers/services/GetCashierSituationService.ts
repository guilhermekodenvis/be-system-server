import { inject, injectable } from 'tsyringe'
import ICashiersRepository from '../repositories/ICashiersRepository'

@injectable()
export default class GetCashierSituationService {
	constructor(
		@inject('CashiersRepository')
		private cashiersRepository: ICashiersRepository,
	) {}

	public async run({ user_id }: { user_id: string }): Promise<boolean> {
		const isCashierAlreadyOpen = await this.cashiersRepository.getCashierSituation(
			user_id,
		)

		return isCashierAlreadyOpen
	}
}
