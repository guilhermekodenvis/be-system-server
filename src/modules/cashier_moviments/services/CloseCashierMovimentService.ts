import { inject, injectable } from 'tsyringe'
import ICloseCashierDTO from '../dtos/ICloseCashierDTO'
import ICashierMovimentsRepository from '../repositories/ICashierMovimentsRepository'

@injectable()
export default class CloseCashierMovimentService {
	constructor(
		@inject('CashierMovimentsRepository')
		private cashierMovimentsRepository: ICashierMovimentsRepository,
	) {}

	public async run({
		action,
		// observation,
		user_id,
	}: ICloseCashierDTO): Promise<void> {
		this.cashierMovimentsRepository.create({
			action,
			user_id,
			value: 0,
		})
	}
}
