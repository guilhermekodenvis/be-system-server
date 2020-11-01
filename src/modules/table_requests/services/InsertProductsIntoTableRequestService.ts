import AppError from '@shared/errors/AppError'
import { inject, injectable } from 'tsyringe'
import IRequestCreateRegisterInTableDTO from '../dtos/IRequestCreateRegisterInTableDTO'
import TableRequest from '../infra/typeorm/schemas/TableRequests'
import ITableRequestsRepository from '../repositories/ITableRequestsRepository'

@injectable()
export default class InsertProductsIntoTableRequestService {
	constructor(
		@inject('TableRequestsRepository')
		private tableRequestsRepository: ITableRequestsRepository,
	) {}

	public async run({
		table_id,
		products,
		user_id,
	}: IRequestCreateRegisterInTableDTO): Promise<TableRequest> {
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

		// let tableRequest: TableRequest | undefined
		// 	tableRequest = await this.tableRequestsRepository.getTableRequest({
		// 		table_id,
		// 	})
		// 	if (!tableRequest) {
		// 		throw new AppError('id da mesa inválido.')
		// 	}
		// } else if (table_number) {
		// 	tableRequest = await this.tableRequestsRepository.createTableRequest({
		// 		table_number,
		// 		user_id,
		// 	})
		// } else if (!tableRequest) {
		// 	throw new AppError('Faltou pelo menos o id do pedido ou o número da mesa')
		// }
		// tableRequest.products = []
		// products.forEach(product => {
		// 	if (tableRequest) tableRequest.products.push(product)
		// })
		// return this.tableRequestsRepository.update({ tableRequest })
	}
}
