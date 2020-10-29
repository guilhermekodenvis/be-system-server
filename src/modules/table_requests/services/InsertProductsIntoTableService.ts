import AppError from '@shared/errors/AppError'
import { inject, injectable } from 'tsyringe'
import IRequestCreateRegisterInTableDTO from '../dtos/IRequestCreateRegisterInTableDTO'
import TableRequests from '../infra/typeorm/schemas/TableRequests'
import ITableRequestRepository from '../repositories/ITableRequestsRepository'

@injectable()
export default class InsertProductsIntoTable {
	constructor(
		@inject('TableRequestsRepository')
		private tableRequestsRepository: ITableRequestRepository,
	) {}

	public async run({
		table_id,
		table_number,
		products,
		user_id,
	}: IRequestCreateRegisterInTableDTO): Promise<TableRequests> {
		let tableRequest: TableRequests | undefined

		if (table_id) {
			tableRequest = await this.tableRequestsRepository.getTableRequest({
				table_id,
			})
			if (!tableRequest) {
				throw new AppError('id da mesa inválido.')
			}
		} else if (table_number) {
			tableRequest = await this.tableRequestsRepository.createTableRequest({
				table_number,
				user_id,
			})
		} else if (!tableRequest) {
			throw new AppError('Faltou pelo menos o id do pedido ou o número da mesa')
		}

		tableRequest.products = []

		products.forEach(product => {
			if (tableRequest) tableRequest.products.push(product)
		})

		return this.tableRequestsRepository.update({ tableRequest })
	}
}
