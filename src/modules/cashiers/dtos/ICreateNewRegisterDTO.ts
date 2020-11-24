import { ObjectID } from 'typeorm'

export default interface ICreateNewRegisterDTO {
	value: number
	action: number
	user_id: string
	working_date_id: ObjectID
}
