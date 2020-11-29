import { inject, injectable } from 'tsyringe'
import ITablesRepository from '../repositories/ITableRequestsRepository'

interface IRequestDTO {
	number: number
	user_id: string
}

@injectable()
export default class CheckTableAviabilityService {
	constructor(
		@inject('TableRequestsRepository')
		private tableRequestsRepository: ITablesRepository,
	) {}

	public async run({ number, user_id }: IRequestDTO): Promise<boolean> {
		const tableRequest = await this.tableRequestsRepository.findByTableNumber({
			number,
			user_id,
		})

		return !tableRequest
	}
}
