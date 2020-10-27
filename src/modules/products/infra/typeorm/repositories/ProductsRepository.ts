import ICreateProductDTO from '@modules/products/dtos/ICreateProductDTO'
import IProductsRepository from '@modules/products/repositories/IProductsRepository'
import { getRepository, Repository } from 'typeorm'
import Product from '../entities/Product'

class ProductsRepository implements IProductsRepository {
	private ormRepository: Repository<Product>

	constructor() {
		this.ormRepository = getRepository(Product)
	}

	public async getProductById(
		product_id: string,
	): Promise<Product | undefined> {
		const product = await this.ormRepository.findOne(product_id)

		return product
	}

	public async create(data: ICreateProductDTO): Promise<Product> {
		const product = this.ormRepository.create(data)

		await this.ormRepository.save(product)

		return product
	}

	public async save(product: Product): Promise<Product> {
		return this.ormRepository.save(product)
	}

	public async delete(product: Product): Promise<void> {
		this.ormRepository.delete(product)
	}

	public async getProductsByUserId(
		user_id: string,
	): Promise<Product[] | undefined> {
		const products = await this.ormRepository.find({
			where: { user_id },
		})

		return products
	}
}

export default ProductsRepository
