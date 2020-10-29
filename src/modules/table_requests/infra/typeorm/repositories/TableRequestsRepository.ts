import IDataCreateTableRequestDTO from '@modules/table_requests/dtos/IDataCreateTableRequestDTO'
import IDataGetTableDTO from '@modules/table_requests/dtos/IDataGetTableDTO'
import IDataInsertProductsInTable from '@modules/table_requests/dtos/IDataInsertProductsInTable'
import ITableRequestRepository from '@modules/table_requests/repositories/ITableRequestsRepository'
import { getMongoRepository, MongoRepository } from 'typeorm'
import TableRequests from '../schemas/TableRequests'

// eslint-disable-next-line prettier/prettier
export default class TableRequestsRepository implements ITableRequestRepository {
	private ormRepository: MongoRepository<TableRequests>

	constructor() {
		this.ormRepository = getMongoRepository(TableRequests, 'mongo')
	}

	public async getTableRequest({
		table_id,
	}: IDataGetTableDTO): Promise<TableRequests | undefined> {
		return this.ormRepository.findOne(table_id)
	}

	public async update({
		tableRequest: table_request,
	}: IDataInsertProductsInTable): Promise<TableRequests> {
		return this.ormRepository.save(table_request)
	}

	public async createTableRequest({
		table_number,
		user_id,
	}: IDataCreateTableRequestDTO): Promise<TableRequests> {
		const tableRequest = this.ormRepository.create({
			number: table_number,
			user_id,
		})

		return tableRequest
	}
}
