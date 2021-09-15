class Product {
	constructor(id, ownerId, title, imageUrl, description, price, pushToken) {
		this.id = id,
		this.ownerId = ownerId,
		this.title = title,
		this.imageUrl = imageUrl,
		this.description = description,
		this.price = price;
		this.pushToken = pushToken;
		this.isSelected = this.isSelected;
	}
}

export default Product;
