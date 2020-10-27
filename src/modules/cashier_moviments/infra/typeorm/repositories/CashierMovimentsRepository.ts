import ICashierMovimentDTO from '@modules/cashier_moviments/dtos/ICashierMovimentDTO'
import ICashierMovimentsRepository from '@modules/cashier_moviments/repositories/ICashierMovimentsRepository'
import { Repository } from 'typeorm'
import CashierMoviment from '../entities/CashierMoviment'

export const OPEN_CASHIER_MOVIMENT = 0
export const PAY_WITH_DEBIT_MOVIMENT = 1
export const PAY_WITH_CREDIT_MOVIMENT = 2
export const PAY_WITH_MONEY_MOVIMENT = 3
export const BLEED_MOVIMENT = 4
export const PAYBACK_MOVIMENT = 5
export const CLOSE_CASHIER_MOVIMENT = 6

// eslint-disable-next-line prettier/prettier
export default class CashierMovimentsRepository implements ICashierMovimentsRepository {
	private ormRepository: Repository<CashierMoviment>

	public async openCashier(
		data: ICashierMovimentDTO,
	): Promise<CashierMoviment> {
		const cashierMoviment = this.ormRepository.create({
			value: data.value,
			user_id: data.user_id,
			action: OPEN_CASHIER_MOVIMENT,
		})

		await this.ormRepository.save(cashierMoviment)

		return cashierMoviment
	}

	public async payWithDebit(
		data: ICashierMovimentDTO,
	): Promise<CashierMoviment> {
		const cashierMoviment = this.ormRepository.create({
			value: data.value,
			user_id: data.user_id,
			action: PAY_WITH_DEBIT_MOVIMENT,
		})

		await this.ormRepository.save(cashierMoviment)

		return cashierMoviment
	}

	public async payWithCredit(
		data: ICashierMovimentDTO,
	): Promise<CashierMoviment> {
		const cashierMoviment = this.ormRepository.create({
			value: data.value,
			user_id: data.user_id,
			action: PAY_WITH_CREDIT_MOVIMENT,
		})

		await this.ormRepository.save(cashierMoviment)

		return cashierMoviment
	}

	public async payWithMoney(
		data: ICashierMovimentDTO,
	): Promise<CashierMoviment> {
		const cashierMoviment = this.ormRepository.create({
			value: data.value,
			user_id: data.user_id,
			action: PAY_WITH_MONEY_MOVIMENT,
		})

		await this.ormRepository.save(cashierMoviment)

		return cashierMoviment
	}

	public async payback(data: ICashierMovimentDTO): Promise<CashierMoviment> {
		const cashierMoviment = this.ormRepository.create({
			value: data.value,
			user_id: data.user_id,
			action: PAYBACK_MOVIMENT,
		})

		await this.ormRepository.save(cashierMoviment)

		return cashierMoviment
	}

	public async bleed(data: ICashierMovimentDTO): Promise<CashierMoviment> {
		const cashierMoviment = this.ormRepository.create({
			value: data.value,
			user_id: data.user_id,
			action: BLEED_MOVIMENT,
		})

		await this.ormRepository.save(cashierMoviment)

		return cashierMoviment
	}

	public async closeCashier(user_id: string): Promise<CashierMoviment> {
		const cashierMoviment = this.ormRepository.create({
			value: 0,
			user_id,
			action: CLOSE_CASHIER_MOVIMENT,
		})

		await this.ormRepository.save(cashierMoviment)

		return cashierMoviment
	}
}
