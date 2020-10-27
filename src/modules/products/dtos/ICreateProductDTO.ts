export default interface ICreateProductDTO {
	name: string
	category: string
	price: number
	ingredients?: string
	description?: string
	user_id: string
}
