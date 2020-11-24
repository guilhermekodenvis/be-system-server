import ICreateNewRegisterDTO from '@modules/cashiers/dtos/ICreateNewRegisterDTO'
import IOpenCashierDTO from '@modules/cashiers/dtos/IOpenCashierDTO'
import IStartWorkingDayDTO from '@modules/cashiers/dtos/IStartWorkingDayDTO'
import Cashier from '@modules/cashiers/infra/typeorm/schemas/Cashier'
import Register from '@modules/cashiers/infra/typeorm/schemas/Register'
import WorkingDate from '@modules/cashiers/infra/typeorm/schemas/WorkingDate'
import ICashiersRepository from '@modules/cashiers/repositories/ICashiersRepository'
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
	}: ICreateNewRegisterDTO): Promise<Cashier> {
		const register = new Register()
		Object.assign(register, {
			key: v4(),
			value,
			action,
		})
		const findIndex = this.cashiers.findIndex(c => c.user_id === user_id)

		this.cashiers[findIndex].working_dates.forEach(wd => {
			if (wd.id === working_date_id) {
				wd.registers.push(register)
			}
		})

		return this.cashiers[findIndex]
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

	public async startNewWorkingDay({
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
}
