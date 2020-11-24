import IHashProvider from '@modules/users/providers/HashProvider/models/IHashProvider'
import IUsersRepository from '@modules/users/repositories/IUsersRepository'
import AppError from '@shared/errors/AppError'
import { inject, injectable } from 'tsyringe'
import Cashier, {
	CLOSE_CASHIER_MOVIMENT,
	OPEN_CASHIER_MOVIMENT,
} from '../infra/typeorm/entities/Cashier'
import ICashiersRepository from '../repositories/ICashiersRepository'

interface ICreateMovimentInCashierDTO {
	value: number
	user_id: string
	action: number
	password?: string
}

@injectable()
export default class CreateMovimentInCashierService {
	constructor(
		@inject('CashierMovimentsRepository')
		private cashierMovimentsRepository: ICashiersRepository,

		@inject('HashProvider')
		private hashProvider: IHashProvider,

		@inject('UsersRepository')
		private usersRepository: IUsersRepository,
	) {}

	public async run({
		action,
		user_id,
		value,
		password,
	}: ICreateMovimentInCashierDTO): Promise<Cashier> {
		const user = await this.usersRepository.findById(user_id)

		if (!user) {
			throw new AppError('Usuário não encontrado')
		}

		if (action === OPEN_CASHIER_MOVIMENT || action === CLOSE_CASHIER_MOVIMENT) {
			if (!password) {
				throw new AppError('A senha precisa ser uma senha válida')
			}

			if (await this.hashProvider.compareHash(user.password, password)) {
				const cashierMoviment = await this.cashierMovimentsRepository.create({
					user_id,
					action,
					value,
				})
				return cashierMoviment
			}
			throw new AppError('A senha precisa ser uma senha válida')
		} else {
			const cashierMoviment = await this.cashierMovimentsRepository.create({
				user_id,
				action,
				value,
			})
			return cashierMoviment
		}
	}
}
