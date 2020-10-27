import AppError from '@shared/errors/AppError'
import { inject, injectable } from 'tsyringe'
import IProductRequestDTO from '../dtos/IProductRequestDTO'
import IProductsRepository from '../repositories/IProductsRepository'

@injectable()
export default class DeleteProductService {
	constructor(
		@inject('ProductsRepository')
		private productsRepository: IProductsRepository,
	) {}

	public async run({ product_id, user_id }: IProductRequestDTO): Promise<void> {
		const product = await this.productsRepository.getProductById(product_id)

		if (!product) {
			throw new AppError('Produto não encontrado.')
		}

		if (product.user_id !== user_id) {
			throw new AppError('Você não tem acesso a deletar este produto.')
		}
		this.productsRepository.delete(product)
	}
}
