import { ObjectID } from 'mongodb'
import { inject, injectable } from 'tsyringe'
import ITablesRepository from '../repositories/ITableRequestsRepository'

interface IDataFindTableRequests {
	user_id: string
}

interface ITableRequestFormatted {
	id: ObjectID
	number: number
	total: number
}

@injectable()
export default class FindAllTablesFromUserService {
	constructor(
		@inject('TableRequestsRepository')
		private tableRequestsRepository: ITablesRepository,
	) {}

	public async run({
		user_id,
	}: IDataFindTableRequests): Promise<Array<ITableRequestFormatted>> {
		const allTablesRequests = await this.tableRequestsRepository.findByUserId({
			user_id,
		})

		const formattedTableRequest = allTablesRequests.map(tr => {
			const tableRequestFormatted = {
				id: tr.id,
				number: tr.number,
				total: (() => {
					const t = tr.products.reduce(
						(a, b) => a + b.product_price * b.quantity,
						0,
					)
					return t
				})(),
			}
			return tableRequestFormatted
		})

		return formattedTableRequest
	}
}
