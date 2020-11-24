import { Column, Entity, ObjectID, ObjectIdColumn } from 'typeorm'
import WorkingDate from './WorkingDate'

@Entity('cashiers')
class Cashier {
	@ObjectIdColumn()
	id: ObjectID

	@Column()
	user_id: string

	@Column()
	is_open: boolean

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	@Column(type => WorkingDate)
	working_dates: WorkingDate[]
}

export default Cashier
