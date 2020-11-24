import { Column, ObjectID, ObjectIdColumn } from 'typeorm'
import Register from './Register'

class WorkingDate {
	@ObjectIdColumn()
	id: ObjectID

	@Column()
	day: number

	@Column()
	month: number

	@Column()
	year: number

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	@Column(type => Register)
	registers: Register[]
}

export default WorkingDate
