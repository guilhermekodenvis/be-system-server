import { Column } from 'typeorm'

export default class Register {
	@Column('uuid')
	key: string

	@Column('decimal', { scale: 5, precision: 2 })
	value: number

	@Column()
	action: number
}
