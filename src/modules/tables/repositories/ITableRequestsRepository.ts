import { DeleteResult } from 'typeorm'
import IDataCreateTableRequestDTO from '../dtos/IDataCreateTableRequestDTO'
import IDataDestroyTableRequestDTO from '../dtos/IDataDestroyTableRequestDTO'
import IDataGetTableDTO from '../dtos/IDataGetTableDTO'
import IDataInsertProductsInTable from '../dtos/IDataInsertProductsInTable'
import IDataRequestTableAviability from '../dtos/IDataRequestTableAviability'
import Table from '../infra/typeorm/schemas/Table'

interface IDataFindTableRequests {
	user_id: string
}

export default interface ITablesRepository {
	getTableRequest(data: IDataGetTableDTO): Promise<Table | undefined>
	update(data: IDataInsertProductsInTable): Promise<Table>
	createTable(data: IDataCreateTableRequestDTO): Promise<Table>
	findByUserId(data: IDataFindTableRequests): Promise<Table[]>
	destroy(data: IDataDestroyTableRequestDTO): Promise<DeleteResult>
	findByTableNumber(
		data: IDataRequestTableAviability,
	): Promise<Table | undefined>
	findOneByTableId(table_id: string): Promise<Table | undefined>
}
