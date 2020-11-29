import CreateTableService from '@modules/tables/services/CreateTableService'
import { Request, Response } from 'express'
import FindAllTablesFromUserService from '@modules/tables/services/FindAllTablesFromUserService'
import CheckTableAviabilityService from '@modules/tables/services/CheckTableAviabilityService'
import { container } from 'tsyringe'

export default class TableRequestsController {
	public async create(request: Request, response: Response): Promise<Response> {
		const { table_number } = request.body
		const { id } = request.user

		const createTableRequest = container.resolve(CreateTableService)
		const table = await createTableRequest.run({
			table_number,
			user_id: id,
		})

		return response.status(201).json(table)
	}

	public async index(request: Request, response: Response): Promise<Response> {
		const { id } = request.user
		const findTableRequests = container.resolve(FindAllTablesFromUserService)
		const tableRequests = await findTableRequests.run({ user_id: id })
		return response.json(tableRequests)
	}

	public async checkAviability(
		request: Request,
		response: Response,
	): Promise<Response> {
		const { number } = request.params
		const { id } = request.user
		const checkTableAviability = container.resolve(CheckTableAviabilityService)
		const isAvailable = await checkTableAviability.run({
			number: Number(number),
			user_id: id,
		})
		return response.json({ is_available: isAvailable })
	}
}
