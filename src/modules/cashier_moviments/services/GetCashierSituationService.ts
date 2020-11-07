import { inject, injectable } from 'tsyringe'
import { isAfter } from 'date-fns'
import IGetCashierSituation from '../dtos/IGetCashierSituation'
import ICashierMovimentsRepository from '../repositories/ICashierMovimentsRepository'

@injectable()
export default class GetCashierSituationService {
	constructor(
		@inject('CashierMovimentsRepository')
		private cashierMovimentsRepository: ICashierMovimentsRepository,
	) {}

	public async run({
		user_id,
	}: IGetCashierSituation): Promise<{ isOpen: boolean }> {
		const lastAperture = await this.cashierMovimentsRepository.getLastApperture(
			{
				user_id,
			},
		)
		const lastClose = await this.cashierMovimentsRepository.getLastClose({
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
