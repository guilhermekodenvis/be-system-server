import { inject, injectable } from 'tsyringe'
import Product from '../infra/typeorm/entities/Product'
import IProductsRepository from '../repositories/IProductsRepository'

interface IDataGetCategories {
	user_id: string
}

@injectable()
class GetCategoriesService {
	constructor(
		@inject('ProductsRepository')
		private productsRepository: IProductsRepository, // @inject('UsersRepository') // private usersRepository: IUsersRepository,
	) {}

	public async run({ user_id }: IDataGetCategories): Promise<Array<Product>> {
		const categories = await this.productsRepository.getCategoriesByUserId(
			user_id,
		)

		return categories
	}
}

export default GetCategoriesService
