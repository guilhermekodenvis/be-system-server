import ICreateProductDTO from '../dtos/ICreateProductDTO'
import Product from '../infra/typeorm/entities/Product'

export default interface IProductsRepository {
	create(data: ICreateProductDTO): Promise<Product>
	save(product: Product): Promise<Product>
	delete(product: Product): Promise<void>
	getProductById(product_id: string): Promise<Product | undefined>
	getProductsByUserId(user_id: string): Promise<Product[]>
}
