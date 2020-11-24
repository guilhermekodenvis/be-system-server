import IGetCashierSituation from '../dtos/IGetCashierSituation'
import IRegisterCashierMovimentDTO from '../dtos/IRegisterCashierMovimentDTO'
import Cashier from '../infra/typeorm/entities/Cashier'

interface IFindAllSinceLastApperture {
	lastAppertureDate: Date
}

export default interface ICashiersRepository {
	create(data: Omit<IRegisterCashierMovimentDTO, 'password'>): Promise<Cashier>
	findLastApperture(data: IGetCashierSituation): Promise<Cashier | undefined>
	findLastClose(data: IGetCashierSituation): Promise<Cashier | undefined>
	findAllSinceLastApperture(
		data: IFindAllSinceLastApperture,
	): Promise<Cashier[]>
}
