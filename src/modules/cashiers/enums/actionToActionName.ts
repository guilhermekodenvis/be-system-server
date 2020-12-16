/* eslint-disable indent */
import {
	BLEED_MOVIMENT,
	CLOSE_CASHIER_MOVIMENT,
	OPEN_CASHIER_MOVIMENT,
	PAYBACK_MOVIMENT,
	PAY_WITH_CREDIT_MOVIMENT,
	PAY_WITH_DEBIT_MOVIMENT,
	PAY_WITH_MONEY_MOVIMENT,
} from './cashierMovimentActions'

export default function actionToActionName(action: number): string {
	switch (action) {
		case OPEN_CASHIER_MOVIMENT:
			return 'Abertura de caixa'
			break
		case PAY_WITH_CREDIT_MOVIMENT:
			return 'Cartão de crédito'
			break
		case PAY_WITH_DEBIT_MOVIMENT:
			return 'Cartão de débito'
			break
		case PAY_WITH_MONEY_MOVIMENT:
			return 'Dinheiro'
			break
		case PAYBACK_MOVIMENT:
			return 'Troco'
			break
		case BLEED_MOVIMENT:
			return 'Sangria'
			break
		case CLOSE_CASHIER_MOVIMENT:
			return 'Fechamento do caixa'
			break
		default:
			return 'error'
			break
	}
}
