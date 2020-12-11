import IDataCreateTableRequestDTO from '@modules/tables/dtos/IDataCreateTableRequestDTO'
import IDataDestroyTableRequestDTO from '@modules/tables/dtos/IDataDestroyTableRequestDTO'
import IDataGetTableDTO from '@modules/tables/dtos/IDataGetTableDTO'
import IDataInsertProductsInTable from '@modules/tables/dtos/IDataInsertProductsInTable'
import IDataRequestTableAviability from '@modules/tables/dtos/IDataRequestTableAviability'
import ITablesRepository from '@modules/tables/repositories/ITableRequestsRepository'
import { DeleteResult, getMongoRepository, MongoRepository } from 'typeorm'
import Table from '../schemas/Table'

interface IDataFindTableRequests {
	user_id: string
}

// eslint-disable-next-line prettier/prettier
export default class TableRequestsRepository implements ITablesRepository {
	private ormRepository: MongoRepository<Table>

	constructor() {
		this.ormRepository = getMongoRepository(Table, 'mongo')
	}

	public async getTableRequest({
		table_id,
	}: IDataGetTableDTO): Promise<Table | undefined> {
		return this.ormRepository.findOne(table_id)
	}

	public async update({
		tableRequest: table_request,
	}: IDataInsertProductsInTable): Promise<Table> {
		return this.ormRepository.save(table_request)
	}

	public async createTable({
		table_number,
		user_id,
	}: IDataCreateTableRequestDTO): Promise<Table> {
		const tableRequest = this.ormRepository.create({
			number: table_number,
			user_id,
		})

		return this.ormRepository.save(tableRequest)
	}

	public async findByUserId({
		user_id,
	}: IDataFindTableRequests): Promise<Table[]> {
		return this.ormRepository.find({
			where: {
				user_id,
			},
			order: { number: 'ASC' },
		})
	}

	public async destroy({
		table,
	}: IDataDestroyTableRequestDTO): Promise<DeleteResult> {
		return this.ormRepository.delete(table)
	}

	public async findByTableNumber({
		number,
		user_id,
	}: IDataRequestTableAviability): Promise<Table | undefined> {
		const table = await this.ormRepository.findOne({
			where: { number, user_id },
		})

		return table
	}

	public async findOneByTableId(table_id: string): Promise<Table | undefined> {
		return this.ormRepository.findOne(table_id)
	}
}
