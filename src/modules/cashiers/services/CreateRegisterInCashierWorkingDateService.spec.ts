import User from '@modules/users/infra/typeorm/entities/User'
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository'
import IUsersRepository from '@modules/users/repositories/IUsersRepository'
import AppError from '@shared/errors/AppError'
import { getDate, getMonth, getYear } from 'date-fns'
import {
	BLEED_MOVIMENT,
	OPEN_CASHIER_MOVIMENT,
	PAYBACK_MOVIMENT,
	PAY_WITH_CREDIT_MOVIMENT,
	PAY_WITH_DEBIT_MOVIMENT,
	PAY_WITH_MONEY_MOVIMENT,
} from '../enums/cashierMovimentActions'
import WorkingDate from '../infra/typeorm/schemas/WorkingDate'

import FakeCashiersRepository from '../repositories/fakes/FakeCashiersRepository'
import ICashiersRepository from '../repositories/ICashiersRepository'
import CreateRegisterInCashierWorkingDateService from './CreateRegisterInCashierWorkingDateService'

let createRegisterInCashierWorkingDate: CreateRegisterInCashierWorkingDateService
let fakeCashiersRepository: ICashiersRepository
let fakeUsersRepository: IUsersRepository

let workingDate: WorkingDate
let user: User

describe('CreateRegisterInCashierWorkingDate', () => {
	beforeEach(async () => {
		fakeCashiersRepository = new FakeCashiersRepository()
		fakeUsersRepository = new FakeUsersRepository()
		createRegisterInCashierWorkingDate = new CreateRegisterInCashierWorkingDateService(
			fakeCashiersRepository,
		)

		user = await fakeUsersRepository.create({
			cnpj: '11222333444401',
			email: 'fulano@de.tal',
			password: '123123',
			restaurant_name: 'Restaurante do fulano',
			user_name: 'Fulano de Tal',
		})

		await fakeCashiersRepository.openCashier({
			user_id: user.id,
			value: 10,
		})

		const date = Date.now()

		workingDate = await fakeCashiersRepository.startNewWorkingDate({
			day: getDate(date),
			month: getMonth(date),
			year: getYear(date),
			user_id: user.id,
		})
		await fakeCashiersRepository.createRegisterInCashierWorkingDate({
			action: OPEN_CASHIER_MOVIMENT,
			user_id: user.id,
			value: 20,
			working_date_id: workingDate.id,
		})
	})

	it('should be able to create a new register in current working date', async () => {
		const debitRegister = await createRegisterInCashierWorkingDate.run({
			action: PAY_WITH_DEBIT_MOVIMENT,
			user_id: user.id,
			value: 10,
			working_date_id: workingDate.id,
		})
		const moneyRegister = await createRegisterInCashierWorkingDate.run({
			action: PAY_WITH_MONEY_MOVIMENT,
			user_id: user.id,
			value: 10,
			working_date_id: workingDate.id,
		})
		const creditRegister = await createRegisterInCashierWorkingDate.run({
			action: PAY_WITH_CREDIT_MOVIMENT,
			user_id: user.id,
			value: 10,
			working_date_id: workingDate.id,
		})

		expect(debitRegister.value).toBeGreaterThan(0)
		expect(moneyRegister.value).toBeGreaterThan(0)
		expect(creditRegister.value).toBeGreaterThan(0)
	})

	it('should not be able to create a new register of OPEN_CASHIER_MOVIMENT in current working date ', async () => {
		await expect(
			createRegisterInCashierWorkingDate.run({
				action: OPEN_CASHIER_MOVIMENT,
				user_id: user.id,
				value: 10,
				working_date_id: workingDate.id,
			}),
		).rejects.toBeInstanceOf(AppError)
	})

	it('should be able to register negative value when it is PAYBACK_MOVIMENT or BLEED_MOVIMENT in current working date', async () => {
		await createRegisterInCashierWorkingDate.run({
			action: PAY_WITH_MONEY_MOVIMENT,
			value: 50,
			user_id: user.id,
			working_date_id: workingDate.id,
		})
		const paybackRegister = await createRegisterInCashierWorkingDate.run({
			action: PAYBACK_MOVIMENT,
			value: 5,
			user_id: user.id,
			working_date_id: workingDate.id,
		})
		expect(paybackRegister.value).toBeLessThan(0)

		const bleedRegister = await createRegisterInCashierWorkingDate.run({
			action: BLEED_MOVIMENT,
			value: 5,
			user_id: user.id,
			working_date_id: workingDate.id,
		})
		expect(bleedRegister.value).toBeLessThan(0)
	})

	it('should not be able to register a BLEED_MOVIMENT greater than the money quantity in cashier working date', async () => {
		await expect(
			createRegisterInCashierWorkingDate.run({
				action: BLEED_MOVIMENT,
				value: 100000,
				user_id: user.id,
				working_date_id: workingDate.id,
			}),
		).rejects.toBeInstanceOf(AppError)
	})
})
