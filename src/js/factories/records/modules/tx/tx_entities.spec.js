import { withdawRecord, issuanceRecord, transferRecord } from '../../../../../test/unit/mock_data/records'
import { WithdrawalRecord } from './withdraw.record'
import { TransferRecord } from './transfer.record'
import { IssuanceRecord } from './issuance.record'

// TODO: resolve store dependency injection

describe('TxRecord record parsers', () => {
  it ('should properly parse withdraw record', () => {
    const withdraw = new WithdrawalRecord(withdawRecord)
    expect(withdraw.amount).to.equal('45.0000')
    expect(withdraw.fixedFee).to.equal("0.0000")
    expect(withdraw.percentFee).to.equal("0.0000")
    expect(withdraw.counterparty).to.equal("2N8hwP1WmJrFF5QWABn38y63uYLhnJYJYTF")
    expect(withdraw.direction).to.equal('out')
    expect(withdraw.destinationAsset).to.equal('BTC')
    expect(withdraw.destinationAmount).to.equal('0.0022')
    expect(withdraw.state).to.equal('pending')
  })

  it ('should properly parse issuance record', () => {
    const issuance = new IssuanceRecord(issuanceRecord)
    expect(issuance.amount).to.equal('1000.0000')
    expect(issuance.asset).to.equal('SUN')
    expect(issuance.counterparty).to.equal('GAGPHYEXN67CYNQCYGXKLN6HUZLM7YRWSUA7IM7BCHWWN3BO5GLNVCZT')
    expect(issuance.direction).to.equal('in')
    expect(issuance.fixedFee).to.equal('0.0000')
    expect(issuance.percentFee).to.equal('0.0000')
    expect(issuance.state).to.equal('success')
    expect(issuance.subject).to.equal('qweqweqweqwew')
  })

  it ('should properly parse transfer entity', () => {
    const transfer = new TransferRecord(transferRecord)
    expect(transfer.amount).to.equal('44.0000')
    expect(transfer.asset).to.equal('SUN')
    // expect(transfer.counterparty).to.equal('GABEAZ4VBERMJY5PAEMOP7AS2VFCRAKXB3J3A3IHZ25DIZFSWG2S4AE6')
    expect(transfer.direction).to.equal('in')
    expect(transfer.fee).to.deep.equal('0.000000')
    expect(transfer.participants).to.deep.equal(['GABEAZ4VBERMJY5PAEMOP7AS2VFCRAKXB3J3A3IHZ25DIZFSWG2S4AE6', 'GAGPHYEXN67CYNQCYGXKLN6HUZLM7YRWSUA7IM7BCHWWN3BO5GLNVCZT'])
    expect(transfer.receiver).to.equal('GABEAZ4VBERMJY5PAEMOP7AS2VFCRAKXB3J3A3IHZ25DIZFSWG2S4AE6')
    expect(transfer.sender).to.equal('GAGPHYEXN67CYNQCYGXKLN6HUZLM7YRWSUA7IM7BCHWWN3BO5GLNVCZT')
    expect(transfer.subject).to.equal('weqweqeqwe')
    expect(transfer.state).to.equal('success')
  })
})
