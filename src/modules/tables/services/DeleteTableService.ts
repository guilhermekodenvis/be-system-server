import AppError from '@shared/errors/AppError'
import { inject, injectable } from 'tsyringe'
import ITablesRepository from '../repositories/ITableRequestsRepository'

@injectable()
export default class DeleteTableService {
	constructor(
		@inject('TableRequestsRepository')
		private tableRequestsRepository: ITablesRepository,
	) {}

	public async run({ table_id }: { table_id: string }): Promise<void> {
		const tableRequest = await this.tableRequestsRepository.findOneByTableId(
			table_id,
		)
		if (!tableRequest) {
			throw new AppError('mesa não enconrada')
		}
		console.log('pelo amor de deus caralho puta que pariu')
		await this.tableRequestsRepository.destroy({ table: tableRequest })
	}
}
