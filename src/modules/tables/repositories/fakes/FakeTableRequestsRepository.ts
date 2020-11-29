import IDataCreateTableRequestDTO from '@modules/tables/dtos/IDataCreateTableRequestDTO'
import IDataDestroyTableRequestDTO from '@modules/tables/dtos/IDataDestroyTableRequestDTO'
import IDataGetTableDTO from '@modules/tables/dtos/IDataGetTableDTO'
import IDataInsertProductsInTable from '@modules/tables/dtos/IDataInsertProductsInTable'
import IDataRequestTableAviability from '@modules/tables/dtos/IDataRequestTableAviability'
import Table from '@modules/tables/infra/typeorm/schemas/Table'
import { ObjectID } from 'mongodb'
import ITablesRepository from '../ITableRequestsRepository'

interface IDataFindTableRequests {
	user_id: string
}
// eslint-disable-next-line prettier/prettier
export default class FakeTablesRepository implements ITablesRepository {
	tableRequests: Table[] = []

	public async getTableRequest({
		table_id,
	}: IDataGetTableDTO): Promise<Table | undefined> {
		return this.tableRequests.find(table => String(table.id) === table_id)
	}

	public async update({
		tableRequest: table_request,
	}: IDataInsertProductsInTable): Promise<Table> {
		const tableIndex = this.tableRequests.findIndex(
			tableRequest => tableRequest.id === table_request.id,
		)

		this.tableRequests[tableIndex] = table_request

		return this.tableRequests[tableIndex]
	}

	public async createTable({
		table_number,
		user_id,
	}: IDataCreateTableRequestDTO): Promise<Table> {
		const tableRequest = new Table()
		Object.assign(tableRequest, {
			id: new ObjectID(),
			number: table_number,
			user_id,
		})
		this.tableRequests.push(tableRequest)

		return tableRequest
	}

	public async findByUserId({
		user_id,
	}: IDataFindTableRequests): Promise<Table[]> {
		const findTableRequests = this.tableRequests.filter(
			tableRequest => tableRequest.user_id === user_id,
		)

		return findTableRequests
	}

	public async destroy({
		tableRequest,
	}: IDataDestroyTableRequestDTO): Promise<void> {
		const findIndex = this.tableRequests.findIndex(
			currentTR => currentTR.id === tableRequest.id,
		)
		this.tableRequests.splice(findIndex, 1)
	}

	public async findByTableNumber({
		number,
		user_id,
	}: IDataRequestTableAviability): Promise<Table | undefined> {
		const tableRequest = this.tableRequests.find(
			tr => tr.number === number && tr.user_id === user_id,
		)
		return tableRequest
	}
}
