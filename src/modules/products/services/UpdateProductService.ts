import IUsersRepository from '@modules/users/repositories/IUsersRepository'
import AppError from '@shared/errors/AppError'
import { inject, injectable } from 'tsyringe'
import IUpdateProductDTO from '../dtos/IUpdateProductDTO'
import Product from '../infra/typeorm/entities/Product'
import IProductsRepository from '../repositories/IProductsRepository'

@injectable()
export default class UpdateProductService {
	constructor(
		@inject('ProductsRepository')
		private productsRepository: IProductsRepository,
		@inject('UsersRepository')
		private usersRepository: IUsersRepository,
	) {}

	public async run({
		name,
		product_id,
		category,
		price,
		description,
		ingredients,
		user_id,
	}: IUpdateProductDTO): Promise<Product> {
		const product = await this.productsRepository.getProductById(product_id)
		if (!product) {
			throw new AppError('Produto não encontrado.')
		}

		const user = await this.usersRepository.findById(user_id)
		if (!user) {
			throw new AppError('Usuário não encontrado.')
		}

		if (product.user_id !== user_id) {
			throw new AppError('Você não tem direito a modificar este produto.')
		}

		product.category = category
		product.name = name
		product.price = price
		product.description = description
		product.ingredients = ingredients

		return this.productsRepository.save(product)
	}
}
