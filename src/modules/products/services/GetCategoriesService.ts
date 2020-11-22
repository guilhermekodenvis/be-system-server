import { inject, injectable } from 'tsyringe'
import IProductsRepository from '../repositories/IProductsRepository'

interface IDataGetCategories {
	user_id: string
}

@injectable()
class GetCategoriesService {
	constructor(
		@inject('ProductsRepository')
		private productsRepository: IProductsRepository,
	) {}

	public async run({ user_id }: IDataGetCategories): Promise<Array<string>> {
		const products = await this.productsRepository.getProductsByUserId(user_id)
		const categories: string[] = []

		products.forEach(product => categories.push(product.category))

		const settedCategories = [...new Set(categories)]

		return settedCategories
	}
}

export default GetCategoriesService
