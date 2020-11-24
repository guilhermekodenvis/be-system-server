import ICreateNewRegisterDTO from '@modules/cashiers/dtos/ICreateNewRegisterDTO'
import ICashiersRepository from '@modules/cashiers/repositories/ICashiersRepository'
import Cashier from '../schemas/Cashier'

export default class CashiersRepository implements ICashiersRepository {
	public async createRegisterInCashierWorkingDate({
		action,
		user_id,
		value,
	}: ICreateNewRegisterDTO): Promise<Cashier> {}
}
