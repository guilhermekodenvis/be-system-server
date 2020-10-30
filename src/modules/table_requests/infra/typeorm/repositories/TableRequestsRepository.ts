import IDataCreateTableRequestDTO from '@modules/table_requests/dtos/IDataCreateTableRequestDTO'
import IDataGetTableDTO from '@modules/table_requests/dtos/IDataGetTableDTO'
import IDataInsertProductsInTable from '@modules/table_requests/dtos/IDataInsertProductsInTable'
import ITableRequestsRepository from '@modules/table_requests/repositories/ITableRequestsRepository'
import { getMongoRepository, MongoRepository } from 'typeorm'
import TableRequest from '../schemas/TableRequests'

// eslint-disable-next-line prettier/prettier
export default class TableRequestsRepository implements ITableRequestsRepository {
	private ormRepository: MongoRepository<TableRequest>

	constructor() {
		this.ormRepository = getMongoRepository(TableRequest, 'mongo')
	}

	public async getTableRequest({
		table_id,
	}: IDataGetTableDTO): Promise<TableRequest | undefined> {
		return this.ormRepository.findOne(table_id)
	}

	public async update({
		tableRequest: table_request,
	}: IDataInsertProductsInTable): Promise<TableRequest> {
		return this.ormRepository.save(table_request)
	}

	public async createTableRequest({
		table_number,
		user_id,
	}: IDataCreateTableRequestDTO): Promise<TableRequest> {
		const tableRequest = this.ormRepository.create({
			number: table_number,
			user_id,
		})

		return this.ormRepository.save(tableRequest)
	}
}
