import assert from 'assert'

import { accountBalances } from 'app/utils/StateFunctions'

describe('StateFunctions', () => {
  it('should return balance and sbd_balance', () => {

    const test_cases = [
      '1000.000 ABC',
      '1000.000 GBG',
      '1000.000 CBA',
      '1000.000 GOLOS'
    ]

    const balances = accountBalances(test_cases)

    assert.equal(balances.balance, '1000.000 GOLOS')
    assert.equal(balances.sbd_balance, '1000.000 GBG')
    assert.equal(balances.assets_balance.size, 2)
  })

  it('should return only balance and sbd_balance', () => {

    const test_cases = [
      '1000.000 GBG',
      '1000.000 GOLOS'
    ]

    const balances = accountBalances(test_cases)

    assert.equal(balances.balance, '1000.000 GOLOS')
    assert.equal(balances.sbd_balance, '1000.000 GBG')
    assert.equal(balances.assets_balance.size, 0)
    assert.notEqual(balances.assets_balance.size, 1)
  })

  it('should return assets_balance', () => {

    const test_cases = [
      '1000.000 ABC',
      '1000.000 CBA',
      '1000.000 GBG',
      '1000.000 QWE',
      '1000.000 GOLOS'
    ]

    const balances = accountBalances(test_cases)

    assert.equal(balances.assets_balance.size, 3)
    assert.equal(balances.assets_balance.get('ABC'), '1000.000 ABC')
    assert.equal(balances.assets_balance.get('CBA'), '1000.000 CBA')
  })
})
