import ICreateNewRegisterDTO from '@modules/cashiers/dtos/ICreateNewRegisterDTO'
import IGetMoneyInCashierDTO from '@modules/cashiers/dtos/IGetMoneyInCashierDTO'
import IOpenCashierDTO from '@modules/cashiers/dtos/IOpenCashierDTO'
import IStartWorkingDayDTO from '@modules/cashiers/dtos/IStartWorkingDayDTO'
import {
	BLEED_MOVIMENT,
	OPEN_CASHIER_MOVIMENT,
	PAYBACK_MOVIMENT,
	PAY_WITH_MONEY_MOVIMENT,
} from '@modules/cashiers/enums/cashierMovimentActions'
import Cashier from '@modules/cashiers/infra/typeorm/schemas/Cashier'
import Register from '@modules/cashiers/infra/typeorm/schemas/Register'
import WorkingDate from '@modules/cashiers/infra/typeorm/schemas/WorkingDate'
import ICashiersRepository from '@modules/cashiers/repositories/ICashiersRepository'
import AppError from '@shared/errors/AppError'
import { ObjectID } from 'mongodb'
// import { ObjectID } from 'typeorm'
import { v4 } from 'uuid'

// eslint-disable-next-line prettier/prettier
export default class FakeCashiersRepository implements ICashiersRepository {
	private cashiers: Cashier[] = []

	public async createRegisterInCashierWorkingDate({
		action,
		value,
		user_id,
		working_date_id,
	}: ICreateNewRegisterDTO): Promise<Register> {
		const register = new Register()
		Object.assign(register, {
			key: v4(),
			value,
			action,
		})

		const cashier = this.cashiers.find(c => c.user_id === user_id)
		const workingDate = cashier?.working_dates.find(
			wd => wd.id === working_date_id,
		)

		if (!workingDate) {
			throw new AppError('ops, working date not found')
		}

		workingDate.registers.push(register)

		return register
	}

	public async openCashier({
		user_id,
		value,
	}: Omit<IOpenCashierDTO, 'password'>): Promise<Cashier> {
		const cashier = this.cashiers.find(c => c.user_id === user_id)

		if (cashier) {
			cashier.is_open = true
			return cashier
		}
		const newCashier = new Cashier()
		Object.assign(newCashier, {
			is_open: true,
			value,
			user_id,
			working_dates: [],
		})

		this.cashiers.push(newCashier)

		return newCashier
	}

	public async getCashierSituation(user_id: string): Promise<boolean> {
		const cashier = this.cashiers.find(c => c.user_id === user_id)
		if (!cashier) {
			return false
		}
		return cashier.is_open
	}

	public async startNewWorkingDate({
		day,
		month,
		year,
		user_id,
	}: IStartWorkingDayDTO): Promise<WorkingDate> {
		const workingDate = new WorkingDate()
		Object.assign(workingDate, {
			id: new ObjectID(),
			day,
			month,
			year,
			registers: [],
		})

		const cashierIndex = this.cashiers.findIndex(c => c.user_id === user_id)

		this.cashiers[cashierIndex].working_dates.push(workingDate)
		return workingDate
	}

	public async getMoneyInCashier({
		user_id,
		working_date_id,
	}: IGetMoneyInCashierDTO): Promise<number> {
		const currentWorkingDate = this.cashiers
			.find(c => c.user_id === user_id)
			?.working_dates.find(wd => wd.id === working_date_id)

		if (!currentWorkingDate) {
			throw new AppError('working date not found')
		}
		const valuesInCurrentWorkingDate = currentWorkingDate.registers.map(
			({ value, action }) => {
				if (
					action === OPEN_CASHIER_MOVIMENT ||
					action === PAY_WITH_MONEY_MOVIMENT ||
					action === PAYBACK_MOVIMENT ||
					action === BLEED_MOVIMENT
				) {
					return value
				}
				return 0
			},
		)
		const totalValue = valuesInCurrentWorkingDate.reduce(
			(acc, cur) => acc + cur,
		)

		return totalValue
	}

	public async closeCashier(user_id: string): Promise<Cashier> {
		const cashier = this.cashiers.find(c => c.user_id === user_id)

		if (!cashier) {
			throw new AppError('Caixa não encontrado')
		}

		cashier.is_open = false

		return cashier
	}
}
