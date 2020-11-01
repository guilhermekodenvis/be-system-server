import { inject, injectable } from 'tsyringe'
import TableRequest from '../infra/typeorm/schemas/TableRequests'
import ITableRequestsRepository from '../repositories/ITableRequestsRepository'

interface IDataFindTableRequests {
	user_id: string
}

@injectable()
export default class FindTableRequestsService {
	constructor(
		@inject('TableRequestsRepository')
		private tableRequestsRepository: ITableRequestsRepository,
	) {}

	public async run({
		user_id,
	}: IDataFindTableRequests): Promise<TableRequest[]> {
		return this.tableRequestsRepository.findByUserId({
			user_id,
		})
	}
}
