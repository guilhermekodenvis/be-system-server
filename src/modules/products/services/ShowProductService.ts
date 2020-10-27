import IUsersRepository from '@modules/users/repositories/IUsersRepository'
import AppError from '@shared/errors/AppError'
import { inject, injectable } from 'tsyringe'
import IProductRequestDTO from '../dtos/IProductRequestDTO'
import Product from '../infra/typeorm/entities/Product'
import IProductsRepository from '../repositories/IProductsRepository'

@injectable()
export default class ShowProductService {
	constructor(
		@inject('ProductsRepository')
		private productsRepository: IProductsRepository,

		@inject('UsersRepository')
		private usersRepository: IUsersRepository,
	) {}

	public async run({
		product_id,
		user_id,
	}: IProductRequestDTO): Promise<Product> {
		const user = await this.usersRepository.findById(user_id)
		if (!user) {
			throw new AppError('Usuário não encontrado')
		}

		const product = await this.productsRepository.getProductById(product_id)
		if (!product) {
			throw new AppError('Produto não encontrado')
		}

		if (user.id !== product.user_id) {
			throw new AppError('Você não tem acesso a esse produto.')
		}

		return product
	}
}
