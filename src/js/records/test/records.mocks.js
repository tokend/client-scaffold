export const recordResponses = {
  assetPair: {
    "base": "SWM4",
    "quote": "ETH",
    "current_price": "1.000000",
    "physical_price": "1.000000",
    "physical_price_correction": "0.000000",
    "max_price_step": "0.000000",
    "policy": 0,
    "policies": null
  },
  issuance: {
    "_links": {
      "self": {
        "href": "https://staging.app.sun.swarm.fund/operations/1634943725735937"
      },
      "transaction": {
        "href": "https://staging.app.sun.swarm.fund/transactions/"
      },
      "succeeds": {
        "href": "https://staging.app.sun.swarm.fund/effects?order=desc\u0026cursor=1634943725735937"
      },
      "precedes": {
        "href": "https://staging.app.sun.swarm.fund/effects?order=asc\u0026cursor=1634943725735937"
      }
    },
    "id": "1634943725735937",
    "paging_token": "1634943725735937",
    "transaction_id": "1634943725735936",
    "source_account": "GD7AHJHCDSQI6LVMEJEE2FTNCA2LJQZ4R64GUI3PWANSVEO4GEOWB636",
    "type": "create_issuance_request",
    "type_i": 3,
    "state_i": 1,
    "state": "pending",
    "identifier": "121",
    "ledger_close_time": "2018-03-05T15:18:21Z",
    "participants": [
      {
        "account_id": "GD7AHJHCDSQI6LVMEJEE2FTNCA2LJQZ4R64GUI3PWANSVEO4GEOWB636"
      },
      {
        "account_id": "GDHQUMVTZM2DEWWNUCN7LM7HQWDQE4DD3VC43BQE7SYDY3IMBONUHZ6X",
        "balance_id": "BA2T5HDBZDWNQLGRCCNAHZQPCU3T3AWYE36OSRTFHYTD5HUA6UJPXGGN"
      }
    ],
    "reference": "qwewqeqweqew",
    "amount": "5000.000000",
    "asset": "SWM",
    "fee_fixed": "0.000000",
    "fee_percent": "0.000000",
    "external_details": {}
  },
  withdraw: {
    "_links": {
      "self": {
        "href": "https://staging.app.sun.swarm.fund/operations/1692655201292289"
      },
      "transaction": {
        "href": "https://staging.app.sun.swarm.fund/transactions/"
      },
      "succeeds": {
        "href": "https://staging.app.sun.swarm.fund/effects?order=desc\u0026cursor=1692655201292289"
      },
      "precedes": {
        "href": "https://staging.app.sun.swarm.fund/effects?order=asc\u0026cursor=1692655201292289"
      }
    },
    "id": "1692655201292289",
    "paging_token": "1692655201292289",
    "transaction_id": "1692655201292288",
    "source_account": "GDHQUMVTZM2DEWWNUCN7LM7HQWDQE4DD3VC43BQE7SYDY3IMBONUHZ6X",
    "type": "create_withdrawal_request",
    "type_i": 7,
    "state_i": 1,
    "state": "pending",
    "identifier": "122",
    "ledger_close_time": "2018-03-06T09:58:19Z",
    "participants": [
      {
        "account_id": "GDHQUMVTZM2DEWWNUCN7LM7HQWDQE4DD3VC43BQE7SYDY3IMBONUHZ6X",
        "balance_id": "BDQ7JHVFXQAPN4VSB7LOM7IR5L54SLNSUTJ65KT4XE4KNHS6XBGLAC6Z"
      }
    ],
    "amount": "12.000000",
    "balance": "BDQ7JHVFXQAPN4VSB7LOM7IR5L54SLNSUTJ65KT4XE4KNHS6XBGLAC6Z",
    "fee_fixed": "0.000100",
    "fee_percent": "0.120000",
    "external_details": {
      "address": "2N8hwP1WmJrFF5QWABn38y63uYLhnJYJYTF"
    },
    "dest_asset": "ETH",
    "dest_amount": "12.000000"
  },
  offer: {
    "paging_token": "144",
    "owner_id": "GDHQUMVTZM2DEWWNUCN7LM7HQWDQE4DD3VC43BQE7SYDY3IMBONUHZ6X",
    "offer_id": 144,
    "order_book_id": '0',
    "base_balance_id": "BD5KAVP3FCWQVCFA6TOOQMGKCGWMMG646Z3VDR2ZZTAG5QD3NUCV5S5A",
    "quote_balance_id": "BDQ7JHVFXQAPN4VSB7LOM7IR5L54SLNSUTJ65KT4XE4KNHS6XBGLAC6Z",
    "fee": "0.167372",
    "base_asset_code": "heyhey",
    "quote_asset_code": "ETH",
    "is_buy": true,
    "base_amount": "3.266785",
    "quote_amount": "3.266785",
    "price": "1.000000",
    "created_at": "2018-03-06T09:59:04Z"
  },
  saleOffer: {
    "paging_token": "144",
    "owner_id": "GDHQUMVTZM2DEWWNUCN7LM7HQWDQE4DD3VC43BQE7SYDY3IMBONUHZ6X",
    "offer_id": 144,
    "order_book_id": 10,
    "base_balance_id": "BD5KAVP3FCWQVCFA6TOOQMGKCGWMMG646Z3VDR2ZZTAG5QD3NUCV5S5A",
    "quote_balance_id": "BDQ7JHVFXQAPN4VSB7LOM7IR5L54SLNSUTJ65KT4XE4KNHS6XBGLAC6Z",
    "fee": "0.167372",
    "base_asset_code": "heyhey",
    "quote_asset_code": "ETH",
    "is_buy": true,
    "base_amount": "3.266785",
    "quote_amount": "3.266785",
    "price": "1.000000",
    "created_at": "2018-03-06T09:59:04Z"
  },
  match: {
    "_links": {
      "self": {
        "href": "https://staging.app.sun.swarm.fund/operations/978775802126337"
      },
      "transaction": {
        "href": "https://staging.app.sun.swarm.fund/transactions/"
      },
      "succeeds": {
        "href": "https://staging.app.sun.swarm.fund/effects?order=desc\u0026cursor=978775802126337"
      },
      "precedes": {
        "href": "https://staging.app.sun.swarm.fund/effects?order=asc\u0026cursor=978775802126337"
      }
    },
    "id": "978775802126337",
    "paging_token": "978775802126337",
    "transaction_id": "978775802126336",
    "source_account": "GD7AHJHCDSQI6LVMEJEE2FTNCA2LJQZ4R64GUI3PWANSVEO4GEOWB636",
    "type": "check_sale_state",
    "type_i": 20,
    "state_i": 2,
    "state": "success",
    "identifier": "0",
    "ledger_close_time": "2018-02-24T19:02:04Z",
    "participants": [
      {
        "account_id": "GBUY24GOTSRWOIW5IZAWXCR3BFFQIGO34C4SVQ6CEPZNC67DUKFWVVOJ",
        "balance_id": "BD572YPMGIIUHQG4SMUSXOHEHQIYTCBO3E6TEIP5FAD57QXYT7MBEF2B",
        "effects": [
          {
            "base_asset": "Test",
            "is_buy": false,
            "matches": [
              {
                "base_amount": "1.379852",
                "fee_paid": "101.146076",
                "price": "236.458444",
                "quote_amount": "326.277658"
              }
            ],
            "quote_asset": "SWM"
          }
        ]
      },
      {
        "account_id": "GCJ22MP7JR6HDQ2KANPVKQDN7JVEFCEERLSXVXATRKG6OZU7LB2GHCVN",
        "balance_id": "BA7FHF5GMQXIQINWMBVC3RD6INQ26SGUH4B2ZSKIDRDBRJ7RAJ5PJYLE",
        "effects": [
          {
            "base_asset": "Test",
            "is_buy": true,
            "matches": [
              {
                "base_amount": "0.839776",
                "fee_paid": "0.000131",
                "price": "0.013968",
                "quote_amount": "0.011730"
              }
            ],
            "quote_asset": "BTC"
          },
          {
            "base_asset": "Test",
            "is_buy": true,
            "matches": [
              {
                "base_amount": "147.780303",
                "fee_paid": "1.230510",
                "price": "0.162520",
                "quote_amount": "24.017255"
              }
            ],
            "quote_asset": "ETH"
          },
          {
            "base_asset": "Test",
            "is_buy": true,
            "matches": [
              {
                "base_amount": "0.002630",
                "fee_paid": "0.192785",
                "price": "236.458444",
                "quote_amount": "0.621886"
              }
            ],
            "quote_asset": "SWM"
          }
        ]
      },
      {
        "account_id": "GCJ22MP7JR6HDQ2KANPVKQDN7JVEFCEERLSXVXATRKG6OZU7LB2GHCVN",
        "balance_id": "BDH6RGU2WHRDXAIDK5ALIW7NOTBOI6PU63Q7ZXYD6R5A6RPA5ELDSIHT",
        "effects": [
          {
            "base_asset": "Test",
            "is_buy": true,
            "matches": [
              {
                "base_amount": "147.780303",
                "fee_paid": "1.230510",
                "price": "0.162520",
                "quote_amount": "24.017255"
              }
            ],
            "quote_asset": "ETH"
          }
        ]
      },
      {
        "account_id": "GBUY24GOTSRWOIW5IZAWXCR3BFFQIGO34C4SVQ6CEPZNC67DUKFWVVOJ",
        "balance_id": "BBU5CSWOEKKMCPXMSV6X3PMJ2FHVHPQF56T4CLTMQP7O36DBFNOUC2CW",
        "effects": [
          {
            "base_asset": "Test",
            "is_buy": false,
            "matches": [
              {
                "base_amount": "0.839776",
                "fee_paid": "0.000131",
                "price": "0.013968",
                "quote_amount": "0.011730"
              }
            ],
            "quote_asset": "BTC"
          }
        ]
      },
      {
        "account_id": "GC3KLKPJ7K5RFKORGDARBO2R4ROUGVTD65D76X45GDRGY77NP5FRTEZH",
        "balance_id": "BDPQVVOI7OKKYS5KTOLLJ7FCQ7HUBCFZPKC6QZW6F2QAFPFGR4VJZ2QL",
        "effects": [
          {
            "base_asset": "Test",
            "is_buy": true,
            "matches": [
              {
                "base_amount": "0.860589",
                "fee_paid": "63.082997",
                "price": "236.458444",
                "quote_amount": "203.493536"
              }
            ],
            "quote_asset": "SWM"
          }
        ]
      },
      {
        "account_id": "GC3KLKPJ7K5RFKORGDARBO2R4ROUGVTD65D76X45GDRGY77NP5FRTEZH",
        "balance_id": "BBQ7JRRTN4LIB3ZKFY7DJ2EZYTPXMPPQUCO653YRPA7EEA6TSE5DPOM7",
        "effects": [
          {
            "base_asset": "Test",
            "is_buy": true,
            "matches": [
              {
                "base_amount": "0.860589",
                "fee_paid": "63.082997",
                "price": "236.458444",
                "quote_amount": "203.493536"
              }
            ],
            "quote_asset": "SWM"
          }
        ]
      },
      {
        "account_id": "GCPR6OZTQOWJRJDI2UYJK4TM3CMUS6XOKXUUC5Z3HZ5LZB6R7WBPWNVP",
        "balance_id": "BBIDSAAVDZUQ4S5EEIW5ITM4NLJWYURVX5FZMWOGT6IO6R5IYECJCR7B",
        "effects": [
          {
            "base_asset": "Test",
            "is_buy": true,
            "matches": [
              {
                "base_amount": "0.516633",
                "fee_paid": "37.870294",
                "price": "236.458444",
                "quote_amount": "122.162236"
              }
            ],
            "quote_asset": "SWM"
          }
        ]
      },
      {
        "account_id": "GBUY24GOTSRWOIW5IZAWXCR3BFFQIGO34C4SVQ6CEPZNC67DUKFWVVOJ",
        "balance_id": "BBJ5WHSYJH6QVVLKZKKC5IH2DQ5NQB2PJ3AINJDMXGRKNZGWUNLK7JTY",
        "effects": [
          {
            "base_asset": "Test",
            "is_buy": false,
            "matches": [
              {
                "base_amount": "147.780303",
                "fee_paid": "1.230510",
                "price": "0.162520",
                "quote_amount": "24.017255"
              }
            ],
            "quote_asset": "ETH"
          }
        ]
      },
      {
        "account_id": "GBUY24GOTSRWOIW5IZAWXCR3BFFQIGO34C4SVQ6CEPZNC67DUKFWVVOJ",
        "balance_id": "BCW35FPBVOKVWN3PCOLRAO5MVB32XS7HILX2NH6XW7HSRLAVRXCBOCCB",
        "effects": [
          {
            "base_asset": "Test",
            "is_buy": false,
            "matches": [
              {
                "base_amount": "0.839776",
                "fee_paid": "0.000131",
                "price": "0.013968",
                "quote_amount": "0.011730"
              }
            ],
            "quote_asset": "BTC"
          },
          {
            "base_asset": "Test",
            "is_buy": false,
            "matches": [
              {
                "base_amount": "147.780303",
                "fee_paid": "1.230510",
                "price": "0.162520",
                "quote_amount": "24.017255"
              }
            ],
            "quote_asset": "ETH"
          },
          {
            "base_asset": "Test",
            "is_buy": false,
            "matches": [
              {
                "base_amount": "1.379852",
                "fee_paid": "101.146076",
                "price": "236.458444",
                "quote_amount": "326.277658"
              }
            ],
            "quote_asset": "SWM"
          }
        ]
      },
      {
        "account_id": "GCJ22MP7JR6HDQ2KANPVKQDN7JVEFCEERLSXVXATRKG6OZU7LB2GHCVN",
        "balance_id": "BDSCHZZB6ZBG2YIXBSD2PNFRIB7SQTB5X5X3N5ZY5RAJQBLCJ7FPG2UV",
        "effects": [
          {
            "base_asset": "Test",
            "is_buy": true,
            "matches": [
              {
                "base_amount": "0.839776",
                "fee_paid": "0.000131",
                "price": "0.013968",
                "quote_amount": "0.011730"
              }
            ],
            "quote_asset": "BTC"
          }
        ]
      },
      {
        "account_id": "GCJ22MP7JR6HDQ2KANPVKQDN7JVEFCEERLSXVXATRKG6OZU7LB2GHCVN",
        "balance_id": "BACSFUM3UI5QETD47II7HRZ3WIIYCDQEJT3L5SQ4ETWIXKLAIY27PWC7",
        "effects": [
          {
            "base_asset": "Test",
            "is_buy": true,
            "matches": [
              {
                "base_amount": "0.002630",
                "fee_paid": "0.192785",
                "price": "236.458444",
                "quote_amount": "0.621886"
              }
            ],
            "quote_asset": "SWM"
          }
        ]
      },
      {
        "account_id": "GCPR6OZTQOWJRJDI2UYJK4TM3CMUS6XOKXUUC5Z3HZ5LZB6R7WBPWNVP",
        "balance_id": "BCVIMVAE3UBP2ISFEJ475KKPWXCJTLWF5BLR7PPQAIICEMZV2HW6K6YU",
        "effects": [
          {
            "base_asset": "Test",
            "is_buy": true,
            "matches": [
              {
                "base_amount": "0.516633",
                "fee_paid": "37.870294",
                "price": "236.458444",
                "quote_amount": "122.162236"
              }
            ],
            "quote_asset": "SWM"
          }
        ]
      }
    ]
  },
  sale: {
    "paging_token": "10",
    "id": "10",
    "owner_id": "GBUY24GOTSRWOIW5IZAWXCR3BFFQIGO34C4SVQ6CEPZNC67DUKFWVVOJ",
    "base_asset": "heyhey",
    "default_quote_asset": "SUN",
    "start_time": "2018-02-20T10:00:00Z",
    "end_time": "2018-03-20T10:00:00Z",
    "soft_cap": "1000000000.000000",
    "hard_cap": "2000000000.000000",
    "details": {
      "description": "QO467VLENFWLSCAQT74PYTR2G4NIFNFKEV2BWJNVJECNCNEQ26YA",
      "logo": {
        "key": "dpurah4infpebjhcost7fvniwuyaam7ki4ou3e5u2ly7o2yqelwegy63",
        "type": "image/png",
        "url": "https://staging.storage.sun.swarm.fund/api/dpurah4infpebjhcost7fvniwuyaam7ki4ou3e5u2ly7o2yqelwegy63"
      },
      "name": "1qwqe",
      "short_description": "eqeq",
      "youtube_video_id": "sW17ETznjl8"
    },
    "state": {
      "name": "open",
      "value": 1
    },
    "statistics": {
      "investors": 0
    },
    "quote_assets": {
      "quote_assets": [
        {
          "asset": "BTC",
          "price": "1.000000",
          "quote_balance_id": "BBU5CSWOEKKMCPXMSV6X3PMJ2FHVHPQF56T4CLTMQP7O36DBFNOUC2CW",
          "current_cap": "3.033394"
        },
        {
          "asset": "ETH",
          "price": "1.000000",
          "quote_balance_id": "BBJ5WHSYJH6QVVLKZKKC5IH2DQ5NQB2PJ3AINJDMXGRKNZGWUNLK7JTY",
          "current_cap": "8.453505"
        },
        {
          "asset": "SWM",
          "price": "1.000000",
          "quote_balance_id": "BD572YPMGIIUHQG4SMUSXOHEHQIYTCBO3E6TEIP5FAD57QXYT7MBEF2B",
          "current_cap": "14.300869"
        }
      ]
    },
    "base_hard_cap": "1000000000.000000",
    "base_current_cap": "0.000000",
    "current_cap": "39703.057031",
    "sale_type": {
      "name": "crowd_funding",
      "value": 2
    }
  },
  token: {
    "code": "QQQ",
    "owner": "GD7AHJHCDSQI6LVMEJEE2FTNCA2LJQZ4R64GUI3PWANSVEO4GEOWB636",
    "available_for_issuance": "9994346.663003",
    "preissued_asset_signer": "GD7AHJHCDSQI6LVMEJEE2FTNCA2LJQZ4R64GUI3PWANSVEO4GEOWB636",
    "max_issuance_amount": "100000000.000000",
    "issued": "5631.116997",
    "pending_issuance": "0.000000",
    "policy": 24,
    "policies": [
      {
        "name": "AssetPolicyWithdrawable",
        "value": 8
      },
      {
        "name": "AssetPolicyTwoStepWithdrawal",
        "value": 16
      }
    ],
    "details": {
      "logo": {
        "key": "",
        "type": "logo_type",
        "url": "logo_url"
      },
      "name": "ETH name",
      "terms": {
        "key": "",
        "name": "",
        "type": ""
      }
    }
  },
  tokenRequiresKYC: {
    "code": "ETH",
    "owner": "GD7AHJHCDSQI6LVMEJEE2FTNCA2LJQZ4R64GUI3PWANSVEO4GEOWB636",
    "available_for_issuance": "9994346.663003",
    "preissued_asset_signer": "GD7AHJHCDSQI6LVMEJEE2FTNCA2LJQZ4R64GUI3PWANSVEO4GEOWB636",
    "max_issuance_amount": "100000000.000000",
    "issued": "5631.116997",
    "pending_issuance": "0.000000",
    "policy": 48,
    "policies": [
      {
        "name": "AssetPolicyBaseAsset",
        "value": 2
      },
      {
        "name": "AssetPolicyWithdrawable",
        "value": 8
      },
      {
        "name": "AssetPolicyTwoStepWithdrawal",
        "value": 16
      },
      {
        "name": "AssetPolicyRequiresKyc",
        "value": 32
      }
    ],
    "details": {
      "logo": {
        "key": "",
        "type": "logo_type",
        "url": "logo_url"
      },
      "name": "ETH name",
      "terms": {
        "key": "",
        "name": "",
        "type": ""
      }
    }
  },
  tokenBase: {
    "code": "ETH",
    "owner": "GD7AHJHCDSQI6LVMEJEE2FTNCA2LJQZ4R64GUI3PWANSVEO4GEOWB636",
    "available_for_issuance": "9994346.663003",
    "preissued_asset_signer": "GD7AHJHCDSQI6LVMEJEE2FTNCA2LJQZ4R64GUI3PWANSVEO4GEOWB636",
    "max_issuance_amount": "100000000.000000",
    "issued": "5631.116997",
    "pending_issuance": "0.000000",
    "policy": 26,
    "policies": [
      {
        "name": "AssetPolicyBaseAsset",
        "value": 2
      },
      {
        "name": "AssetPolicyWithdrawable",
        "value": 8
      },
      {
        "name": "AssetPolicyTwoStepWithdrawal",
        "value": 16
      }
    ],
    "details": {
      "logo": {
        "key": "",
        "type": "logo_type",
        "url": "logo_url"
      },
      "name": "ETH name",
      "terms": {
        "key": "",
        "name": "",
        "type": ""
      }
    }
  },
  tokenWithLogo: {
    "code": "ETH",
    "owner": "GD7AHJHCDSQI6LVMEJEE2FTNCA2LJQZ4R64GUI3PWANSVEO4GEOWB636",
    "available_for_issuance": "9994346.663003",
    "preissued_asset_signer": "GD7AHJHCDSQI6LVMEJEE2FTNCA2LJQZ4R64GUI3PWANSVEO4GEOWB636",
    "max_issuance_amount": "100000000.000000",
    "issued": "5631.116997",
    "pending_issuance": "0.000000",
    "policy": 26,
    "policies": [
      {
        "name": "AssetPolicyBaseAsset",
        "value": 2
      },
      {
        "name": "AssetPolicyWithdrawable",
        "value": 8
      },
      {
        "name": "AssetPolicyTwoStepWithdrawal",
        "value": 16
      }
    ],
    "details": {
      "logo": {
        "key": "rqw2114rterw22131123w",
        "type": "logo_type",
        "url": "logo_url"
      },
      "name": "ETH name",
      "terms": {
        "key": "",
        "name": "",
        "type": ""
      }
    }
  },
  trade: {
    base_asset: 'ETH',
    quote_asset: 'BTC',
    base_amount: '0.11',
    price: '21.000000',
    created_at: '2018-03-06T09:59:04Z'
  }
}
