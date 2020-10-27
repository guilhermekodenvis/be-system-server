import IUsersRepository from '@modules/users/repositories/IUsersRepository'
import AppError from '@shared/errors/AppError'
import { inject, injectable } from 'tsyringe'
import Product from '../infra/typeorm/entities/Product'
import IProductsRepository from '../repositories/IProductsRepository'

interface IRequestDTO {
	user_id: string
}

@injectable()
class ListProductsService {
	constructor(
		@inject('ProductsRepository')
		private productsRepository: IProductsRepository,

		@inject('UsersRepository')
		private usersRepository: IUsersRepository,
	) {}

	public async run({ user_id }: IRequestDTO): Promise<Product[] | undefined> {
		const user = await this.usersRepository.findById(user_id)
		if (!user) {
			throw new AppError('Usuário não encontrado.')
		}
		const products = this.productsRepository.getProductsByUserId(user_id)

		return products
	}
}

export default ListProductsService
