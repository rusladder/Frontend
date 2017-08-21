import assert from 'assert'

import { roundUp, roundDown, getBalance } from 'app/utils/MarketUtils'

describe('MarketUtils: roundUp/roundDown', () => {

	it('should roundUp', () => {
		assert.equal(roundUp(1.12345, 3), '1.124')
		assert.equal(roundUp(1.12145, 3), '1.122')
		assert.equal(roundUp(1.123456, 6), '1.123456')
		assert.equal(roundUp(1.1234567, 6), '1.123457')
		assert.equal(roundUp(1.1234561, 6), '1.123457')

		assert.equal(roundUp(1.001, 3), '1.001')
		assert.equal(roundUp(1.0001, 3), '1.001')
		assert.equal(roundUp(1.00001, 3), '1.001')
		assert.equal(roundUp(1.000001, 6), '1.000001')
		assert.equal(roundUp(1.0000001, 6), '1.000001')

		assert.equal(roundUp(1.9999, 3), '2')
		assert.equal(roundUp(1.9999999, 6), '2')
	})

	it('should roundDown', () => {
		assert.equal(roundDown(1.12345, 3), '1.123')
		assert.equal(roundDown(1.12145, 3), '1.121')
		assert.equal(roundDown(1.123456, 6), '1.123456')
		assert.equal(roundDown(1.1234567, 6), '1.123456')
		assert.equal(roundDown(1.1234561, 6), '1.123456')

		assert.equal(roundDown(1.001, 3), '1.001')
		assert.equal(roundDown(1.0001, 3), '1')
		assert.equal(roundDown(1.00001, 3), '1')
		assert.equal(roundDown(1.000001, 6), '1.000001')
		assert.equal(roundDown(1.0000001, 6), '1')

		assert.equal(roundDown(1.9999, 3), '1.999')
		assert.equal(roundDown(1.999999, 3), '1.999')
	})
})

describe('MarketUtils: getBalance', () => {

	const account = {
		balance: '1000.000 GOLOS',
		sbd_balance: '1000.000 GBG',
		assets_balance: {
			ABC: '1000.000 ABC',
			CBA: '1000.000 CBA',
			QWE: '1000.000 QWE',
		}
	}

	it('should return GBG', () => {

		const base = 'GOLOS'
		const quote = 'GBG'

		const isAsk = false

		assert.equal(getBalance(account, base, quote, isAsk), '1000.000 GBG')
	})

	it('should return GOLOS', () => {

		const base = 'GOLOS'
		const quote = 'GBG'

		const isAsk = true

		assert.equal(getBalance(account, base, quote, isAsk), '1000.000 GOLOS')
	})

	it('should return asset balance', () => {

		assert.equal(getBalance(account, 'GOLOS', 'ABC', false), '1000.000 ABC')
		assert.equal(getBalance(account, 'GOLOS', 'ABC', true), '1000.000 GOLOS')
		assert.equal(getBalance(account, 'GOLOS', 'QWE', false), '1000.000 QWE')
		assert.equal(getBalance(account, 'GOLOS', 'CBA', false), '1000.000 CBA')
	})
})