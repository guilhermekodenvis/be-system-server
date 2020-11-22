import ProductsInTable from '../infra/typeorm/schemas/ProductsInTable'

export default interface IRequestCreateRegisterInTableDTO {
	table_id: string
	products: ProductsInTable[]
	user_id: string
}
