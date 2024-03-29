import { ObjectID } from 'mongodb'
import ICreateNewRegisterDTO from '../dtos/ICreateNewRegisterDTO'
import IStartWorkingDayDTO from '../dtos/IStartWorkingDayDTO'
import IOpenCashierDTO from '../dtos/IOpenCashierDTO'
import Cashier from '../infra/typeorm/schemas/Cashier'
import WorkingDate from '../infra/typeorm/schemas/WorkingDate'
import Register from '../infra/typeorm/schemas/Register'
import IGetMoneyInCashierDTO from '../dtos/IGetMoneyInCashierDTO'
import IGetLastWorkingDate from '../dtos/IGetLastWorkingDate'
import IRemoveRegisterDTO from '../dtos/IRemoveRegisterDTO'

export default interface ICashiersRepository {
	createRegisterInCashierWorkingDate(
		data: ICreateNewRegisterDTO,
	): Promise<Register>
	getLastWorkingDate(data: IGetLastWorkingDate): Promise<ObjectID>
	// TODO: VERIFICAR A NECESSIDADE DE VALUE EM OPENCASHIER()
	openCashier(data: Omit<IOpenCashierDTO, 'password'>): Promise<Cashier>
	getCashierSituation(user_id: string): Promise<boolean>
	startNewWorkingDate(data: IStartWorkingDayDTO): Promise<WorkingDate>
	getMoneyInCashier(data: IGetMoneyInCashierDTO): Promise<number>
	closeCashier(user_id: string): Promise<Cashier>
	removeRegisterInCashierWorkingDate(data: IRemoveRegisterDTO): Promise<void>
	findCashierByUserId(user_id: string): Promise<Cashier | undefined>
	create(user_id: string): Promise<Cashier>
	update(cashier: Cashier): Promise<void>
}
