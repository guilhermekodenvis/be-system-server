import IGetCashierSituation from '../dtos/IGetCashierSituation'
import IGetMovimentsDTO from '../dtos/IGetMovimentsDTO'
import IRegisterCashierMovimentDTO from '../dtos/IRegisterCashierMovimentDTO'
import CashierMoviment from '../infra/typeorm/entities/CashierMoviment'

export default interface ICashierMovimentsRepository {
	create(
		data: Omit<IRegisterCashierMovimentDTO, 'password'>,
	): Promise<CashierMoviment>
	getAllMovimentsOfTheDay(data: IGetMovimentsDTO): Promise<CashierMoviment[]>
	getLastApperture(
		data: IGetCashierSituation,
	): Promise<CashierMoviment | undefined>
	getLastClose(data: IGetCashierSituation): Promise<CashierMoviment | undefined>
}
