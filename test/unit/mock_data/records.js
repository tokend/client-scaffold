export const withdawRecord = {
  "id": "655966060154881",
  "paging_token": "655966060154881",
  "transaction_id": "655966060154880",
  "source_account": "GAGPHYEXN67CYNQCYGXKLN6HUZLM7YRWSUA7IM7BCHWWN3BO5GLNVCZT",
  "type": "create_withdrawal_request",
  "type_i": 7,
  "state_i": 1,
  "state": "pending",
  "identifier": "107",
  "ledger_close_time": "2018-01-11T11:43:37Z",
  "participants": [
    {
      "account_id": "GAGPHYEXN67CYNQCYGXKLN6HUZLM7YRWSUA7IM7BCHWWN3BO5GLNVCZT",
      "balance_id": "BARTKK7F4V7P6FKLKG46B2ALF7HY5LEGEHBX2A2BVNZ76YJOX64QLRGV"
    }
  ],
  "amount": "45.0000",
  "balance": "BARTKK7F4V7P6FKLKG46B2ALF7HY5LEGEHBX2A2BVNZ76YJOX64QLRGV",
  "fee_fixed": "0.0000",
  "fee_percent": "0.0000",
  "external_details": {
    "address": "2N8hwP1WmJrFF5QWABn38y63uYLhnJYJYTF"
  },
  "dest_asset": "BTC",
  "dest_amount": "0.0022"
}

export const transferRecord = {
  "id": "653260230758401",
  "paging_token": "653260230758401",
  "transaction_id": "653260230758400",
  "source_account": "GAGPHYEXN67CYNQCYGXKLN6HUZLM7YRWSUA7IM7BCHWWN3BO5GLNVCZT",
  "type": "payment",
  "type_i": 1,
  "state_i": 2,
  "state": "success",
  "identifier": "2",
  "ledger_close_time": "2018-01-11T10:51:05Z",
  "participants": [
    {
      "account_id": "GABEAZ4VBERMJY5PAEMOP7AS2VFCRAKXB3J3A3IHZ25DIZFSWG2S4AE6",
      "balance_id": "BAWPJMT2JHFMT5CZZERQ2I4WXICJKH3M2TC6MKCOH37GFTVGVTUAVEB6"
    },
    {
      "account_id": "GAGPHYEXN67CYNQCYGXKLN6HUZLM7YRWSUA7IM7BCHWWN3BO5GLNVCZT",
      "balance_id": "BARTKK7F4V7P6FKLKG46B2ALF7HY5LEGEHBX2A2BVNZ76YJOX64QLRGV"
    }
  ],
  "from": "GAGPHYEXN67CYNQCYGXKLN6HUZLM7YRWSUA7IM7BCHWWN3BO5GLNVCZT",
  "to": "GABEAZ4VBERMJY5PAEMOP7AS2VFCRAKXB3J3A3IHZ25DIZFSWG2S4AE6",
  "from_balance": "BARTKK7F4V7P6FKLKG46B2ALF7HY5LEGEHBX2A2BVNZ76YJOX64QLRGV",
  "to_balance": "BAWPJMT2JHFMT5CZZERQ2I4WXICJKH3M2TC6MKCOH37GFTVGVTUAVEB6",
  "amount": "44.0000",
  "asset": "SUN",
  "source_payment_fee": "0.0000",
  "destination_payment_fee": "0.0000",
  "source_fixed_fee": "0.0000",
  "destination_fixed_fee": "0.0000",
  "source_pays_for_dest": false,
  "subject": "weqweqeqwe",
  "qasset": ""
}

export const issuanceRecord = {
  "id": "13413182869505",
  "paging_token": "13413182869505",
  "transaction_id": "13413182869504",
  "source_account": "GDHK26UFBGC63UBQCVQLHJD6RAQXLAS7RKJAR5FZQAWMCUBFHRNKFSKC",
  "type": "create_issuance_request",
  "type_i": 3,
  "state_i": 2,
  "state": "success",
  "identifier": "20",
  "ledger_close_time": "2018-01-02T17:50:38Z",
  "participants": [
    {
      "account_id": "GAGPHYEXN67CYNQCYGXKLN6HUZLM7YRWSUA7IM7BCHWWN3BO5GLNVCZT",
      "balance_id": "BARTKK7F4V7P6FKLKG46B2ALF7HY5LEGEHBX2A2BVNZ76YJOX64QLRGV"
    },
    {
      "account_id": "GDHK26UFBGC63UBQCVQLHJD6RAQXLAS7RKJAR5FZQAWMCUBFHRNKFSKC"
    }
  ],
  "reference": "qweqweqweqwew",
  "amount": "1000.0000",
  "asset": "SUN",
  "fee_fixed": "0.0000",
  "fee_percent": "0.0000",
  "external_details": {}
}

export const matchRecord = {
  "id": "139397458563073",
  "paging_token": "139397458563073",
  "transaction_id": "139397458563072",
  "source_account": "GDHK26UFBGC63UBQCVQLHJD6RAQXLAS7RKJAR5FZQAWMCUBFHRNKFSKC",
  "type": "check_sale_state",
  "type_i": 20,
  "state_i": 2,
  "state": "success",
  "identifier": "0",
  "ledger_close_time": "2018-01-04T10:37:09Z",
  "participants": [
    {
      "account_id": "GBJLOTVV32INOLQGYU2KKNZ2GYINP3IGMJDZCF4YHY3IPEVWEWDNTPX2",
      "balance_id": "BBSN4XUET7LYBZFA7VEBGJMVGV5VJYSPO65M5JSUVWGM65STGEZ4K6OO",
      "effects": {
        "base_asset": "YE",
        "is_buy": true,
        "matches": [
          {
            "base_amount": "202.0000",
            "fee_paid": "0.0000",
            "price": "1.0000",
            "quote_amount": "202.0000"
          }
        ],
        "quote_asset": "SUN"
      }
    },
    {
      "account_id": "GAFBO27KUZ3YWBLWWN3TVCA7AEWKQVM6GLUTUA7PWNODBV63K54YV3AH",
      "balance_id": "BDGNCBC3NTG7HEIMDRVXXNTH4SI5XKPVCY6NBJFSHH57ZAWPV3X7RHMW",
      "effects": {
        "base_asset": "YE",
        "is_buy": true,
        "matches": [
          {
            "base_amount": "1000.0000",
            "fee_paid": "0.0000",
            "price": "1.0000",
            "quote_amount": "1000.0000"
          }
        ],
        "quote_asset": "SUN"
      }
    },
    {
      "account_id": "GAFBO27KUZ3YWBLWWN3TVCA7AEWKQVM6GLUTUA7PWNODBV63K54YV3AH",
      "balance_id": "BDM5G77G3MZXWYQNM5VGRKBOMEQSATNAEMSIJL46O3H6B6ES75TAZN5R",
      "effects": {
        "base_asset": "YE",
        "is_buy": true,
        "matches": [
          {
            "base_amount": "1000.0000",
            "fee_paid": "0.0000",
            "price": "1.0000",
            "quote_amount": "1000.0000"
          }
        ],
        "quote_asset": "SUN"
      }
    },
    {
      "account_id": "GAGPHYEXN67CYNQCYGXKLN6HUZLM7YRWSUA7IM7BCHWWN3BO5GLNVCZT",
      "balance_id": "BBURIJLZAASNXXES5ST5XKSV6CISQMVCHWATCBUENASABK4SKF6EB3V3",
      "effects": {
        "base_asset": "YE",
        "is_buy": false,
        "matches": [
          {
            "base_amount": "1202.0000",
            "fee_paid": "0.0000",
            "price": "1.0000",
            "quote_amount": "1202.0000"
          }
        ],
        "quote_asset": "SUN"
      }
    },
    {
      "account_id": "GAGPHYEXN67CYNQCYGXKLN6HUZLM7YRWSUA7IM7BCHWWN3BO5GLNVCZT",
      "balance_id": "BARTKK7F4V7P6FKLKG46B2ALF7HY5LEGEHBX2A2BVNZ76YJOX64QLRGV",
      "effects": {
        "base_asset": "YE",
        "is_buy": false,
        "matches": [
          {
            "base_amount": "1202.0000",
            "fee_paid": "0.0000",
            "price": "1.0000",
            "quote_amount": "1202.0000"
          }
        ],
        "quote_asset": "SUN"
      }
    },
    {
      "account_id": "GBJLOTVV32INOLQGYU2KKNZ2GYINP3IGMJDZCF4YHY3IPEVWEWDNTPX2",
      "balance_id": "BDYCXYJLDXR7G3VJNRQAQ7MGFOINTNS7MFB7VRK3NYAEE2ADILF6G25T",
      "effects": {
        "base_asset": "YE",
        "is_buy": true,
        "matches": [
          {
            "base_amount": "202.0000",
            "fee_paid": "0.0000",
            "price": "1.0000",
            "quote_amount": "202.0000"
          }
        ],
        "quote_asset": "SUN"
      }
    }
  ]
}

export const offerRecord = {
  "paging_token": "39",
  "owner_id": "GAI42UDPGBHOYNOFGRZC2RHRTZ4BERQZGV226RIDOQYQINTQSRLHEZ77",
  "offer_id": 39,
  "base_balance_id": "BA2BCINU4Q2DVMSZO2KTD6MIGIR7TJB7I4LNN23F5ZUZO2ZOSRWCYAS5",
  "quote_balance_id": "BDQYYVO3EHOP7A4T2ZBY6J5OTCSZ3DLLCHM57JXFBOVLYDMW3OBHXEPB",
  "fee": "22.8000",
  "base_asset_code": "EARTH",
  "quote_asset_code": "SUN",
  "is_buy": true,
  "base_amount": "190.0000",
  "quote_amount": "285.0000",
  "price": "1.5000",
  "created_at": "2018-01-15T11:08:38Z"
}

export const saleRecord = {
  "paging_token": "1",
  "id": "1",
  "owner_id": "GDCHNBMBQGGN6U3RECHWOBAE3COCJE5U2ATYUB3ROM7AO5SOKO6MFA6K",
  "base_asset": "EARTH",
  "quote_asset": "SUN",
  "start_time": "2018-01-13T17:00:00Z",
  "end_time": "2018-01-20T10:00:00Z",
  "price": "1.5000",
  "soft_cap": "10000.0000",
  "hard_cap": "20000.0000",
  "current_cap": "10029.0000",
  "details": {
    "description": "LJPAB4XQL3R2JRVTL4TESG3UWBMKYE5VO6PLSQ35WHN62GFW5EHA",
    "logo": {
      "key": "dpurah4infoebjhcost7fvm56hv4nlpkd6ptm2nghu3c5qtvubtbk6tl",
      "type": "image/jpeg",
      "url": "http://18.196.70.215:9000/api/dpurah4infoebjhcost7fvm56hv4nlpkd6ptm2nghu3c5qtvubtbk6tl"
    },
    "name": "Save the earth",
    "short_description": "The human onslaught to destroy life on Earth is unprecedented in Earth’s history. Planet Earth is now experiencing its sixth mass extinction event and Homo sapiens is the cause."
  },
  "state": {
    "name": "open",
    "value": 1
  },
  "statistics": {
    "investors": 2,
    "average_amount": "5014.5000"
  }
}


export const tokenRecord = {
  "code": "EARTH",
  "owner": "GDCHNBMBQGGN6U3RECHWOBAE3COCJE5U2ATYUB3ROM7AO5SOKO6MFA6K",
  "available_for_issuance": "0.6666",
  "preissued_asset_signer": "GDCHNBMBQGGN6U3RECHWOBAE3COCJE5U2ATYUB3ROM7AO5SOKO6MFA6K",
  "max_issuance_amount": "13334.0000",
  "issued": "0.0000",
  "pending_issuance": "13333.3334",
  "policy": 1,
  "policies": [
    {
      "name": "AssetPolicyTransferable",
      "value": 1
    }
  ],
  "details": {
    "documents": "",
    "logo": {
      "key": "dpurgh4infoebjhcost7fvlbjdob35rlj2ocongrff2d2zvcw6cd2crv",
      "type": "image/png",
      "url": "http://18.196.70.215:9000/api/dpurgh4infoebjhcost7fvlbjdob35rlj2ocongrff2d2zvcw6cd2crv"
    },
    "name": "SaveTheEarth"
  }
}

export const balances = {
  USD: {
    'balance_id': 'BD6H4MJQMWSIV7LMBNCWBP5HFXNP6J7JXSQ663BWOR3UIF3NIPHG5E6F',
    'account_id': 'GAI42UDPGBHOYNOFGRZC2RHRTZ4BERQZGV226RIDOQYQINTQSRLHEZ77',
    'asset': 'USD',
    'balance': '0.0000',
    'locked': '0.0000',
    'require_review': false,
    'incentive_per_coin': '0.0000'
  },
  EARTH: {
    'balance_id': 'BA2BCINU4Q2DVMSZO2KTD6MIGIR7TJB7I4LNN23F5ZUZO2ZOSRWCYAS5',
    'account_id': 'GAI42UDPGBHOYNOFGRZC2RHRTZ4BERQZGV226RIDOQYQINTQSRLHEZ77',
    'asset': 'EARTH',
    'balance': '0.0000',
    'locked': '0.0000',
    'require_review': false,
    'incentive_per_coin': '0.0000'
  },
  SUN: {
    'balance_id': 'BDQYYVO3EHOP7A4T2ZBY6J5OTCSZ3DLLCHM57JXFBOVLYDMW3OBHXEPB',
    'account_id': 'GAI42UDPGBHOYNOFGRZC2RHRTZ4BERQZGV226RIDOQYQINTQSRLHEZ77',
    'asset': 'SUN',
    'balance': '157.2000',
    'locked': '307.8000',
    'require_review': false,
    'incentive_per_coin': '0.0000'
  }
}
