import { inject, injectable } from 'tsyringe'
import IGetMovimentsDTO from '../dtos/IGetMovimentsDTO'
import CashierMoviment from '../infra/typeorm/entities/CashierMoviment'
import ICashierMovimentsRepository from '../repositories/ICashierMovimentsRepository'

@injectable()
export default class GetMovimentsToCloseCashierService {
	constructor(
		@inject('CashierMovimentsRepository')
		private cashierMovimentsRepository: ICashierMovimentsRepository,
	) {}

	public async run({
		user_id,
	}: Omit<IGetMovimentsDTO, 'date'>): Promise<CashierMoviment[]> {
		// const date = new Date()
		const date = {
			day: 3,
			month: 10,
			year: 2020,
		}
		const cashierMoviments = await this.cashierMovimentsRepository.getAllMovimentsOfTheDay(
			{ user_id, date },
		)

		return cashierMoviments
	}
}
