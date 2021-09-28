class Order {
	constructor(id, items, amount, date, address) {
		(this.id = id),
			(this.items = items),
			(this.amount = amount),
			(this.date = date);
			this.address = address

	}

	get readableDate() {
		return this.date.toLocaleDateString("en-EN", {
			year: "numeric",
			month: "long",
			day: "numeric",
			hour: '2-digit',
			

		});
	}
}

export default Order;
