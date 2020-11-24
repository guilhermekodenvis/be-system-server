interface IPayment {
	value: number
	type: number
}

export default interface ICreateManyMovimentsDTO {
	payments: Array<IPayment>
	user_id: string
	table_id: string
}
