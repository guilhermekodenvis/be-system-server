import AppError from '@shared/errors/AppError'
import { inject, injectable } from 'tsyringe'
import IRequestCreateRegisterInTableDTO from '../dtos/IRequestCreateRegisterInTableDTO'
import Table from '../infra/typeorm/schemas/Table'
import ITablesRepository from '../repositories/ITableRequestsRepository'

@injectable()
export default class InsertProductsIntoTableService {
	constructor(
		@inject('TableRequestsRepository')
		private tableRequestsRepository: ITablesRepository,
	) {}

	public async run({
		table_id,
		products,
		user_id,
	}: IRequestCreateRegisterInTableDTO): Promise<Table> {
		const tableRequest = await this.tableRequestsRepository.getTableRequest({
			table_id,
		})

		if (!tableRequest) {
			throw new AppError('invalid table id')
		}

		products.forEach(product => {
			if (tableRequest.products) {
				tableRequest.products.push(product)
			} else {
				tableRequest.products = [product]
			}
		})

		return this.tableRequestsRepository.update({ tableRequest })
	}
}
