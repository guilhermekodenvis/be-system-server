import IDataCreateTableRequestDTO from '@modules/table_requests/dtos/IDataCreateTableRequestDTO'
import IDataGetTableDTO from '@modules/table_requests/dtos/IDataGetTableDTO'
import IDataInsertProductsInTable from '@modules/table_requests/dtos/IDataInsertProductsInTable'
import TableRequest from '@modules/table_requests/infra/typeorm/schemas/TableRequests'
import { ObjectID } from 'mongodb'
import ITableRequestsRepository from '../ITableRequestsRepository'

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
}
