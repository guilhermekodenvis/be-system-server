import ICreateNewRegisterDTO from '@modules/cashiers/dtos/ICreateNewRegisterDTO'
import IGetLastWorkingDate from '@modules/cashiers/dtos/IGetLastWorkingDate'
import IGetMoneyInCashierDTO from '@modules/cashiers/dtos/IGetMoneyInCashierDTO'
import IOpenCashierDTO from '@modules/cashiers/dtos/IOpenCashierDTO'
import IStartWorkingDayDTO from '@modules/cashiers/dtos/IStartWorkingDayDTO'
import {
	BLEED_MOVIMENT,
	OPEN_CASHIER_MOVIMENT,
	PAYBACK_MOVIMENT,
	PAY_WITH_MONEY_MOVIMENT,
} from '@modules/cashiers/enums/cashierMovimentActions'
import ICashiersRepository from '@modules/cashiers/repositories/ICashiersRepository'
import AppError from '@shared/errors/AppError'
import { ObjectID } from 'mongodb'
import { getMongoRepository, MongoRepository } from 'typeorm'
import { v4 } from 'uuid'
import Cashier from '../schemas/Cashier'
import Register from '../schemas/Register'
import WorkingDate from '../schemas/WorkingDate'

export default class CashiersRepository implements ICashiersRepository {
	private ormRepository: MongoRepository<Cashier>

	constructor() {
		this.ormRepository = getMongoRepository(Cashier, 'mongo')
	}

	public async createRegisterInCashierWorkingDate({
		action,
		user_id,
		value,
		working_date_id,
	}: ICreateNewRegisterDTO): Promise<Register> {
		const register = new Register()
		Object.assign(register, {
			key: v4(),
			value,
			action,
		})

		const cashier = await this.ormRepository.findOne({ where: { user_id } })

		if (!cashier) {
			throw new AppError('caixa não encontrado')
		}

		if (cashier.working_dates.length === 0) {
			cashier.working_dates[0].registers.push(register)
		} else {
			cashier.working_dates.forEach(wd => {
				if (wd.id === working_date_id) {
					wd.registers.push(register)
				}
			})
		}

		return register
	}

	public async getLastWorkingDate({
		user_id,
	}: IGetLastWorkingDate): Promise<ObjectID> {
		const cashier = await this.ormRepository.findOne({ where: { user_id } })
		if (!cashier) {
			throw new AppError('Caixa não encontrado')
		}

		const wdLength = cashier.working_dates.length

		return cashier.working_dates[wdLength - 1].id
	}

	public async openCashier({
		user_id,
	}: Pick<IOpenCashierDTO, 'value' | 'user_id'>): Promise<Cashier> {
		const cashier = await this.ormRepository.findOne({ where: { user_id } })

		if (cashier) {
			cashier.is_open = true
			await this.ormRepository.save(cashier)
			return cashier
		}

		const newCashier = this.ormRepository.create({
			is_open: true,
			user_id,
			working_dates: [],
		})

		await this.ormRepository.save(newCashier)

		return newCashier
	}

	public async getCashierSituation(user_id: string): Promise<boolean> {
		const cashier = await this.ormRepository.findOne({ where: { user_id } })
		if (!cashier) return false
		return cashier.is_open
	}

	public async startNewWorkingDate({
		day,
		month,
		user_id,
		year,
	}: IStartWorkingDayDTO): Promise<WorkingDate> {
		const newWD = new WorkingDate()
		Object.assign(newWD, {
			id: new ObjectID(),
			day,
			month,
			year,
			registers: [],
		})
		const cashier = await this.ormRepository.findOne({ where: { user_id } })

		if (!cashier) {
			throw new AppError('caixa não encontrado')
		}

		if (!cashier.working_dates || cashier.working_dates.length === 0) {
			Object.assign(cashier, {
				working_dates: [newWD],
			})
		} else {
			cashier.working_dates.push(newWD)
		}

		await this.ormRepository.update(cashier, cashier)

		return newWD
	}

	public async getMoneyInCashier({
		user_id,
		working_date_id,
	}: IGetMoneyInCashierDTO): Promise<number> {
		const cashier = await this.ormRepository.findOne({ where: { user_id } })

		if (!cashier) {
			throw new AppError('caixa não encontrado')
		}

		const currentWorkingDate = cashier.working_dates.find(
			wd => wd.id === working_date_id,
		)

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
		const cashier = await this.ormRepository.findOne({ where: { user_id } })

		if (!cashier) {
			throw new AppError('caixa não encontrado')
		}

		cashier.is_open = false

		await this.ormRepository.update(cashier, cashier)

		return cashier
	}
}
