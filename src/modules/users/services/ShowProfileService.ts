import AppError from '@shared/errors/AppError'
import { inject, injectable } from 'tsyringe'
import User from '../infra/typeorm/entities/User'
import IUsersRepository from '../repositories/IUsersRepository'

interface IRequestDTO {
	user_id: string
}

@injectable()
class ShowProfileService {
	constructor(
		@inject('UsersRepository')
		private usersRepository: IUsersRepository,
	) {}

	public async run({ user_id }: IRequestDTO): Promise<User> {
		const user = await this.usersRepository.findById(user_id)

		if (!user) {
			throw new AppError('Usuário não encontrado.')
		}

		return user
	}
}

export default ShowProfileService
