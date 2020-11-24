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

@Entity('cashier')
class Cashier {
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

export default Cashier

export const OPEN_CASHIER_MOVIMENT = 0
export const PAY_WITH_DEBIT_MOVIMENT = 1
export const PAY_WITH_CREDIT_MOVIMENT = 2
export const PAY_WITH_MONEY_MOVIMENT = 3
export const BLEED_MOVIMENT = 4
export const PAYBACK_MOVIMENT = 5
export const CLOSE_CASHIER_MOVIMENT = 6
