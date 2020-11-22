import IDataCreateTableRequestDTO from '@modules/table_requests/dtos/IDataCreateTableRequestDTO'
import IDataDestroyTableRequestDTO from '@modules/table_requests/dtos/IDataDestroyTableRequestDTO'
import IDataGetTableDTO from '@modules/table_requests/dtos/IDataGetTableDTO'
import IDataInsertProductsInTable from '@modules/table_requests/dtos/IDataInsertProductsInTable'
import IDataRequestTableAviability from '@modules/table_requests/dtos/IDataRequestTableAviability'
import TableRequest from '@modules/table_requests/infra/typeorm/schemas/TableRequests'
import { ObjectID } from 'mongodb'
import ITableRequestsRepository from '../ITableRequestsRepository'

interface IDataFindTableRequests {
	user_id: string
}
// eslint-disable-next-line prettier/prettier
export default class FakeTableRequestsRepository implements ITableRequestsRepository {
	tableRequests: TableRequest[] = []

	public async getTableRequest({
		table_id,
	}: IDataGetTableDTO): Promise<TableRequest | undefined> {
		return this.tableRequests.find(table => table.id === table_id)
	}

	public async update({
		tableRequest: table_request,
	}: IDataInsertProductsInTable): Promise<TableRequest> {
		const tableIndex = this.tableRequests.findIndex(
			tableRequest => tableRequest.id === table_request.id,
		)

		this.tableRequests[tableIndex] = table_request

		return this.tableRequests[tableIndex]
	}

	public async createTableRequest({
		table_number,
		user_id,
	}: IDataCreateTableRequestDTO): Promise<TableRequest> {
		const tableRequest = new TableRequest()
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
	}: IDataFindTableRequests): Promise<TableRequest[]> {
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
	}: IDataRequestTableAviability): Promise<TableRequest | undefined> {
		const tableRequest = this.tableRequests.find(
			tr => tr.number === number && tr.user_id === user_id,
		)
		return tableRequest
	}
}
