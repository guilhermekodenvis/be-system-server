import ICreateNewRegisterDTO from '../dtos/ICreateNewRegisterDTO'
import IStartWorkingDayDTO from '../dtos/IStartWorkingDayDTO'
import IOpenCashierDTO from '../dtos/IOpenCashierDTO'
import Cashier from '../infra/typeorm/schemas/Cashier'
import WorkingDate from '../infra/typeorm/schemas/WorkingDate'

export default interface ICashiersRepository {
	createRegisterInCashierWorkingDate(
		data: ICreateNewRegisterDTO,
	): Promise<Cashier>
	openCashier(data: Omit<IOpenCashierDTO, 'password'>): Promise<Cashier>
	getCashierSituation(user_id: string): Promise<boolean>
	startNewWorkingDay(data: IStartWorkingDayDTO): Promise<WorkingDate>
}
