import assert from 'assert'

import { Order } from 'app/utils/MarketClasses'

describe('MarketClasses: Order', () => {

	const o1 = {
			price: "0.50000000000000000",
			quote:"4.00000000000000000",
			base:"2.00000000000000000"
		}

		const o2 = {
			price: "0.023809764531033",
			quote:"98.90900000000000603",
			base:"2.35499999999999998"
		}

	it('should return price for bid', () => {
		const order1 = new Order(o1, 'bids')
		const order2 = new Order(o2, 'bids')

		assert.equal(order1.getPrice(), '0.5')
		assert.equal(order2.getPrice(), '0.023809')
	})

	it('should return price for ask', () => {
		const order1 = new Order(o1, 'asks')
		const order2 = new Order(o2, 'asks')

		assert.equal(order1.getPrice(), '0.5')
		assert.equal(order2.getPrice(), '0.02381')
	})

	it('should return string price for bid', () => {
		const order1 = new Order(o1, 'bids')
		const order2 = new Order(o2, 'bids')

		assert.equal(order1.getStringPrice(), '0.500000')
		assert.equal(order2.getStringPrice(), '0.023809')
	})

	it('should return string price for ask', () => {
		const order1 = new Order(o1, 'asks')
		const order2 = new Order(o2, 'asks')

		assert.equal(order1.getStringPrice(), '0.500000')
		assert.equal(order2.getStringPrice(), '0.023810')
	})

	it('should return base price ', () => {
		const order1 = new Order(o1, '')
		const order2 = new Order(o2, '')

		assert.equal(order1.getBaseAmount(), '2')
		assert.equal(order2.getBaseAmount(), '2.355')
	})

	it('should return quote price ', () => {
		const order1 = new Order(o1, '')
		const order2 = new Order(o2, '')

		assert.equal(order1.getQuoteAmount(), '4')
		assert.equal(order2.getQuoteAmount(), '98.909')
	})

	it('should return string base price ', () => {
		const order1 = new Order(o1, '')
		const order2 = new Order(o2, '')

		assert.equal(order1.getStringBase(), '2.000')
		assert.equal(order2.getStringBase(), '2.355')
	})

	it('should return string quote price ', () => {
		const order1 = new Order(o1, '')
		const order2 = new Order(o2, '')

		assert.equal(order1.getStringQuote(), '4.000')
		assert.equal(order2.getStringQuote(), '98.909')
	})

	it("can be summed with another order", function() {
		const order1 = new Order(o1, '')
		const order2 = new Order(o1, '')

		const order3 = order1.add(order2)

		assert.equal(order3.getBaseAmount(), '4')
		assert.equal(order3.getQuoteAmount(), '8')
	})

	it("can be summed with another order #2", function() {
		const order1 = new Order(o1, '')
		const order2 = new Order(o2, '')
" "
		const order3 = order1.add(order2)

		assert.equal(order3.getBaseAmount(), '4.355')
		assert.equal(order3.getQuoteAmount(), '102.909')
	})

	it("can be compared to another order with equals / ne", function() {
		const order1 = new Order(o1, '')
		const order2 = new Order(o1, '')
		const order3 = new Order(o2, '')

		assert.equal(order1.equals(order3), false);
		assert.equal(order1.equals(order2), true, "Orders are the same");
	});

	it('should add two orders ', () => {
		const order1 = new Order(o1, '')
		const order2 = new Order(o1, '')

		const order3 = order1.add(order2)

		assert.equal(order3.getPrice(), '0.50000000000000000')
		assert.equal(order3.getBaseAmount(), '4.00000000000000000')
		assert.equal(order3.getQuoteAmount(), '8.00000000000000000')
	})

})