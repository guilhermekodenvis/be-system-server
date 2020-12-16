export default interface IFinishPaymentDTO {
	payments: [
		{
			id: string
			value: number
			action: number
		},
	]
	table: {
		number: number
		products: [
			{
				product_name: string
				quantity: number
				product_price: number
			},
		]
	}
	total: number
}
