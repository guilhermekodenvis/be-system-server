import ICreateProductDTO from '@modules/products/dtos/ICreateProductDTO'
import Product from '@modules/products/infra/typeorm/entities/Product'
import { v4 } from 'uuid'
import IProductsRepository from '../IProductsRepository'

export default class FakeProductsRepository implements IProductsRepository {
	private products: Product[] = []

	public async getProductById(
		product_id: string,
	): Promise<Product | undefined> {
		const findProduct = this.products.find(product => product.id === product_id)

		return findProduct
	}

	public async getProductsByUserId(
		user_id: string,
	): Promise<Product[] | undefined> {
		const findProducts = this.products.filter(
			product => product.user_id === user_id,
		)

		return findProducts
	}

	public async create(data: ICreateProductDTO): Promise<Product> {
		const product = new Product()

		Object.assign(product, { id: v4() }, data)

		this.products.push(product)

		return product
	}

	public async save(product: Product): Promise<Product> {
		const findIndex = this.products.findIndex(
			findProduct => findProduct.id === product.id,
		)

		this.products[findIndex] = product

		return product
	}

	public async delete({ id }: Product): Promise<void> {
		const findIndex = this.products.findIndex(
			findProduct => findProduct.id === id,
		)

		this.products.splice(findIndex, 1)
	}

	public async getCategoriesByUserId(user_id: string): Promise<Array<Product>> {
		const findProducts = this.products.filter(
			product => product.user_id === user_id,
		)

		return findProducts
	}
}
