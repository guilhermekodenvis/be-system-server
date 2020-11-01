import { ObjectID } from 'typeorm'
import ProductsInTable from '../infra/typeorm/schemas/ProductsInTable'

export default interface IRequestCreateRegisterInTableDTO {
	table_id: ObjectID
	products: ProductsInTable[]
	user_id: string
}
