import AppError from '@shared/errors/AppError'
import { inject, injectable } from 'tsyringe'
import Table from '../infra/typeorm/schemas/Table'
import ITablesRepository from '../repositories/ITableRequestsRepository'

interface IFindTableRequest {
	table_id: string
}

@injectable()
export default class FindTableRequestService {
	constructor(
		@inject('TableRequestsRepository')
		private tableRequestsRepository: ITablesRepository,
	) {}

	public async run({
		table_id,
	}: IFindTableRequest): Promise<{ table: Table; total: number }> {
		const table = await this.tableRequestsRepository.getTableRequest({
			table_id,
		})

		if (!table) {
			throw new AppError('A mesa não foi encontrada')
		}

		const total = table.products.reduce((totalR, current) => {
			return totalR + current.product_price * current.quantity
		}, 0)

		return { table: { ...table }, total }
	}
}
