import { inject, injectable } from 'tsyringe'
import TableRequest from '../infra/typeorm/schemas/TableRequests'
import ITableRequestsRepository from '../repositories/ITableRequestsRepository'

interface IFindTableRequest {
	table_id: string
}

@injectable()
export default class FindTableRequestService {
	constructor(
		@inject('TableRequestsRepository')
		private tableRequestsRepository: ITableRequestsRepository,
	) {}

	public async run({
		table_id,
	}: IFindTableRequest): Promise<TableRequest | undefined> {
		return this.tableRequestsRepository.getTableRequest({
			table_id,
		})
	}
}
