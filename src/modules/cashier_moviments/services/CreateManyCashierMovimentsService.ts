import ITableRequestsRepository from '@modules/table_requests/repositories/ITableRequestsRepository'
import AppError from '@shared/errors/AppError'
import { inject, injectable } from 'tsyringe'
import ICreateManyMovimentsDTO from '../dtos/ICreateManyMovimentsDTO'
import ICashierMovimentsRepository from '../repositories/ICashierMovimentsRepository'

@injectable()
export default class CreateManyCashierMovimentsService {
	constructor(
		@inject('CashierMovimentsRepository')
		private cashierMovimentsRepository: ICashierMovimentsRepository,

		@inject('TableRequestsRepository')
		private tableRequestsRepository: ITableRequestsRepository,
	) {}

	public async run({
		payments,
		user_id,
		table_id,
	}: ICreateManyMovimentsDTO): Promise<void> {
		payments.forEach(async payment => {
			await this.cashierMovimentsRepository.create({
				value: payment.value,
				action: payment.type,
				user_id,
			})
		})

		const tableRequest = await this.tableRequestsRepository.getTableRequest({
			table_id,
		})

		if (!tableRequest) {
			throw new AppError('Vish, tá com problema aí parcero?')
		}

		await this.tableRequestsRepository.destroy({ tableRequest })
	}
}
