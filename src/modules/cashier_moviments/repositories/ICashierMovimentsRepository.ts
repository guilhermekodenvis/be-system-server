import ICashierMovimentDTO from '../dtos/ICashierMovimentDTO'
import CashierMoviment from '../infra/typeorm/entities/CashierMoviment'

export default interface ICashierMovimentsRepository {
	create(data: ICashierMovimentDTO): Promise<CashierMoviment>
}
