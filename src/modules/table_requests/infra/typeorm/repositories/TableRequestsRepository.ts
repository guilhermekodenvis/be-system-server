import IDataCreateTableRequestDTO from '@modules/table_requests/dtos/IDataCreateTableRequestDTO'
import IDataDestroyTableRequestDTO from '@modules/table_requests/dtos/IDataDestroyTableRequestDTO'
import IDataGetTableDTO from '@modules/table_requests/dtos/IDataGetTableDTO'
import IDataInsertProductsInTable from '@modules/table_requests/dtos/IDataInsertProductsInTable'
import IDataRequestTableAviability from '@modules/table_requests/dtos/IDataRequestTableAviability'
import ITableRequestsRepository from '@modules/table_requests/repositories/ITableRequestsRepository'
import { DeleteResult, getMongoRepository, MongoRepository } from 'typeorm'
import TableRequest from '../schemas/TableRequests'

interface IDataFindTableRequests {
	user_id: string
}

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

	public async findByUserId({
		user_id,
	}: IDataFindTableRequests): Promise<TableRequest[]> {
		return this.ormRepository.find({
			where: {
				user_id,
			},
			order: { number: 'ASC' },
		})
	}

	public async destroy({
		tableRequest,
	}: IDataDestroyTableRequestDTO): Promise<DeleteResult> {
		return this.ormRepository.delete(tableRequest)
	}

	public async findByTableNumber({
		number,
		user_id,
	}: IDataRequestTableAviability): Promise<TableRequest | undefined> {
		const table = await this.ormRepository.findOne({
			where: { number, user_id },
		})

		return table
	}
}
