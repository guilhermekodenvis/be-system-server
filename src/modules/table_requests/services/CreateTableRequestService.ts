import { inject, injectable } from 'tsyringe'
import IDataCreateTableRequestDTO from '../dtos/IDataCreateTableRequestDTO'
import TableRequest from '../infra/typeorm/schemas/TableRequests'
import ITableRequestsRepository from '../repositories/ITableRequestsRepository'

@injectable()
export default class CreateTableRequestService {
	constructor(
		@inject('TableRequestsRepository')
		private tableRequestsRepository: ITableRequestsRepository,
	) {}

	public async run({
		table_number,
		user_id,
	}: IDataCreateTableRequestDTO): Promise<TableRequest> {
		// rn : fazer as verificações necessárias para criar a mesa, caso já tenha uma com o mesmo número, etc...
		return this.tableRequestsRepository.createTableRequest({
			table_number,
			user_id,
		})
	}
}
