import Product from '../infra/typeorm/schemas/Product'

export default interface IRequestCreateRegisterInTableDTO {
	table_id: string
	products: Product[]
	user_id: string
}
