import Cashier from '../infra/typeorm/schemas/Cashier'

export default interface IStartWorkingDayDTO {
	day: number
	month: number
	year: number
	user_id: string
}
