import { inject, injectable } from 'tsyringe'
import Table from '../infra/typeorm/schemas/Table'
import ITablesRepository from '../repositories/ITableRequestsRepository'

interface IDataFindTableRequests {
	user_id: string
}

@injectable()
export default class FindAllTablesFromUserService {
	constructor(
		@inject('TableRequestsRepository')
		private tableRequestsRepository: ITablesRepository,
	) {}

	public async run({ user_id }: IDataFindTableRequests): Promise<Table[]> {
		return this.tableRequestsRepository.findByUserId({
			user_id,
		})
	}
}
