import { ObjectID } from 'mongodb'

export default interface IGetMoneyInCashierDTO {
	user_id: string
	working_date_id: ObjectID
}
