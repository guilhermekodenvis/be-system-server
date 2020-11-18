import AppError from '@shared/errors/AppError'
import { inject, injectable } from 'tsyringe'
import ITableRequestsRepository from '../repositories/ITableRequestsRepository'

interface IRequestDTO {
	number: number
	user_id: string
}

@injectable()
export default class CheckTableAviabilityService {
	constructor(
		@inject('TableRequestsRepository')
		private tableRequestsRepository: ITableRequestsRepository,
	) {}

	public async run({ number, user_id }: IRequestDTO): Promise<boolean> {
		if (isNaN(number)) {
			throw new AppError('oops! Precisa ser um número.')
		}

		const tableRequest = await this.tableRequestsRepository.findByTableNumber({
			number,
			user_id,
		})

		return tableRequest
	}
}
