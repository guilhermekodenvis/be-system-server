import User from '@modules/users/infra/typeorm/entities/User'
import {
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	ManyToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm'

@Entity('cashier_moviments')
class CashierMoviment {
	@PrimaryGeneratedColumn('uuid')
	id: string

	@Column('decimal', { precision: 5, scale: 2 })
	value: number

	@Column('int2')
	action: number

	@Column()
	user_id: string

	@ManyToOne(() => User)
	@JoinColumn({ name: 'user_id' })
	user: User

	@CreateDateColumn()
	created_at: Date

	@UpdateDateColumn()
	updated_at: Date
}

export default CashierMoviment
