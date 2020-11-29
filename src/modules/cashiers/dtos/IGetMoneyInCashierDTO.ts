import { ObjectID } from 'typeorm'

export default interface IGetMoneyInCashierDTO {
	user_id: string
	working_date_id: ObjectID
}
