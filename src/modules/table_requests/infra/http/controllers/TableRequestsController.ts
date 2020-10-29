import InsertProductsIntoTable from '@modules/table_requests/services/InsertProductsIntoTableService'
import { Request, Response } from 'express'
import { container } from 'tsyringe'

export default class TableRequestsController {
	public async create(request: Request, response: Response): Promise<Response> {
		const { table_id, products, user_id, table_number } = request.body

		const insertProductsIntoTable = container.resolve(InsertProductsIntoTable)

		const tableRequest = await insertProductsIntoTable.run({
			table_id,
			products,
			user_id,
			table_number,
		})

		return response.json(tableRequest).status(201)
	}
}
