import AppError from '@shared/errors/AppError'
import { inject, injectable } from 'tsyringe'
import IDataCreateTableRequestDTO from '../dtos/IDataCreateTableRequestDTO'
import Table from '../infra/typeorm/schemas/Table'
import ITablesRepository from '../repositories/ITableRequestsRepository'

@injectable()
export default class CreateTableService {
	constructor(
		@inject('TableRequestsRepository')
		private tableRequestsRepository: ITablesRepository,
	) {}

	public async run({
		table_number,
		user_id,
	}: IDataCreateTableRequestDTO): Promise<Table> {
		const tableAviability = await this.tableRequestsRepository.findByTableNumber(
			{
				number: table_number,
				user_id,
			},
		)

		if (tableAviability) {
			throw new AppError('Não é possível criar uma table já criada')
		}

		return this.tableRequestsRepository.createTable({
			table_number,
			user_id,
		})
	}
}
