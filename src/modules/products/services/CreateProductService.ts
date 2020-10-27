import IUsersRepository from '@modules/users/repositories/IUsersRepository'
import AppError from '@shared/errors/AppError'
import { inject, injectable } from 'tsyringe'
import ICreateProductDTO from '../dtos/ICreateProductDTO'
import Product from '../infra/typeorm/entities/Product'
import IProductsRepository from '../repositories/IProductsRepository'

@injectable()
export default class CreateProductService {
	constructor(
		@inject('ProductsRepository')
		private productsRepository: IProductsRepository,

		@inject('UsersRepository')
		private usersRepository: IUsersRepository,
	) {}

	public async run({
		name,
		category,
		price,
		user_id,
		description,
		ingredients,
	}: ICreateProductDTO): Promise<Product> {
		const user = await this.usersRepository.findById(user_id)

		if (!user) {
			throw new AppError('Usuário não encontrado.')
		}

		const product = await this.productsRepository.create({
			name,
			category,
			price,
			user_id,
			description,
			ingredients,
		})

		return product
	}
}
