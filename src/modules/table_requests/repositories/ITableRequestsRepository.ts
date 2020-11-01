import IDataCreateTableRequestDTO from '../dtos/IDataCreateTableRequestDTO'
import IDataGetTableDTO from '../dtos/IDataGetTableDTO'
import IDataInsertProductsInTable from '../dtos/IDataInsertProductsInTable'
import TableRequest from '../infra/typeorm/schemas/TableRequests'

interface IDataFindTableRequests {
	user_id: string
}

export default interface ITableRequestsRepository {
	getTableRequest(data: IDataGetTableDTO): Promise<TableRequest | undefined>
	update(data: IDataInsertProductsInTable): Promise<TableRequest>
	createTableRequest(data: IDataCreateTableRequestDTO): Promise<TableRequest>
	findByUserId(data: IDataFindTableRequests): Promise<TableRequest[]>
}
