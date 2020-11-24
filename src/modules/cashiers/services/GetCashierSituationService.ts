import { inject, injectable } from 'tsyringe'
import { isAfter } from 'date-fns'
import IGetCashierSituation from '../dtos/IGetCashierSituation'
import ICashiersRepository from '../repositories/ICashiersRepository'

@injectable()
export default class GetCashierSituationService {
	constructor(
		@inject('CashierMovimentsRepository')
		private cashierMovimentsRepository: ICashiersRepository,
	) {}

	public async run({
		user_id,
	}: IGetCashierSituation): Promise<{ isOpen: boolean }> {
		const lastAperture = await this.cashierMovimentsRepository.findLastApperture(
			{
				user_id,
			},
		)
		const lastClose = await this.cashierMovimentsRepository.findLastClose({
			user_id,
		})

		if (!lastAperture && !lastClose) {
			return { isOpen: false }
		}

		if (lastAperture && !lastClose) {
			return { isOpen: true }
		}

		if (!lastAperture || !lastClose) {
			return { isOpen: false }
		}

		return { isOpen: !isAfter(lastClose.created_at, lastAperture.created_at) }
	}
}
