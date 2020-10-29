import IDataCreateTableRequestDTO from '../dtos/IDataCreateTableRequestDTO'
import IDataGetTableDTO from '../dtos/IDataGetTableDTO'
import IDataInsertProductsInTable from '../dtos/IDataInsertProductsInTable'
import TableRequests from '../infra/typeorm/schemas/TableRequests'

export default interface ITableRequestRepository {
	getTableRequest(data: IDataGetTableDTO): Promise<TableRequests | undefined>
	update(data: IDataInsertProductsInTable): Promise<TableRequests>
	createTableRequest(data: IDataCreateTableRequestDTO): Promise<TableRequests>
}
