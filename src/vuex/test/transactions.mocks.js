import { CommonResponseBuilder } from '../../js/builders/response_builder/modules/common_response_builder'
import { mockAccountId, mockEmail } from './default.mocks'
const records = [
  {
    "_links": {
      "self": {
        "href": "https://testnet.tokend.org/operations/978775802126337"
      },
      "transaction": {
        "href": "https://testnet.tokend.org/transactions/"
      },
      "succeeds": {
        "href": "https://testnet.tokend.org/effects?order=desc\u0026cursor=978775802126337"
      },
      "precedes": {
        "href": "https://testnet.tokend.org/effects?order=asc\u0026cursor=978775802126337"
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
  {
    "_links": {
      "self": {
        "href": "https://testnet.tokend.org/operations/978007002976257"
      },
      "transaction": {
        "href": "https://testnet.tokend.org/transactions/"
      },
      "succeeds": {
        "href": "https://testnet.tokend.org/effects?order=desc\u0026cursor=978007002976257"
      },
      "precedes": {
        "href": "https://testnet.tokend.org/effects?order=asc\u0026cursor=978007002976257"
      }
    },
    "id": "978007002976257",
    "paging_token": "978007002976257",
    "transaction_id": "978007002976256",
    "source_account": "GD7AHJHCDSQI6LVMEJEE2FTNCA2LJQZ4R64GUI3PWANSVEO4GEOWB636",
    "type": "check_sale_state",
    "type_i": 20,
    "state_i": 2,
    "state": "success",
    "identifier": "0",
    "ledger_close_time": "2018-02-24T18:47:09Z",
    "participants": [
      {
        "account_id": "GCJ22MP7JR6HDQ2KANPVKQDN7JVEFCEERLSXVXATRKG6OZU7LB2GHCVN",
        "balance_id": "BBSW2CF2YPP2P5B3477Q7UEBTFTB6MUEJM2RIS57MPZZUH6ZTF3G55FI",
        "effects": [
          {
            "base_asset": "SWM4",
            "is_buy": true,
            "matches": [
              {
                "base_amount": "1.241503",
                "fee_paid": "0.013781",
                "price": "1.000000",
                "quote_amount": "1.241503"
              }
            ],
            "quote_asset": "BTC"
          }
        ]
      },
      {
        "account_id": "GBUY24GOTSRWOIW5IZAWXCR3BFFQIGO34C4SVQ6CEPZNC67DUKFWVVOJ",
        "balance_id": "BBU5CSWOEKKMCPXMSV6X3PMJ2FHVHPQF56T4CLTMQP7O36DBFNOUC2CW",
        "effects": [
          {
            "base_asset": "SWM4",
            "is_buy": false,
            "matches": [
              {
                "base_amount": "1.248983",
                "fee_paid": "0.013865",
                "price": "1.000000",
                "quote_amount": "1.248983"
              }
            ],
            "quote_asset": "BTC"
          }
        ]
      },
      {
        "account_id": "GBUY24GOTSRWOIW5IZAWXCR3BFFQIGO34C4SVQ6CEPZNC67DUKFWVVOJ",
        "balance_id": "BAHBAS5MR7HWUDO742FXZ6KKI2NNMKNQYGRMMOK65WSZFOPSIAWA7YUY",
        "effects": [
          {
            "base_asset": "SWM4",
            "is_buy": false,
            "matches": [
              {
                "base_amount": "1.248983",
                "fee_paid": "0.013865",
                "price": "1.000000",
                "quote_amount": "1.248983"
              }
            ],
            "quote_asset": "BTC"
          }
        ]
      },
      {
        "account_id": "GCPR6OZTQOWJRJDI2UYJK4TM3CMUS6XOKXUUC5Z3HZ5LZB6R7WBPWNVP",
        "balance_id": "BB5UAHKDVSOHI756OWMMY5EVZD2UWTTMTC5AGAVDPG42BOVJXKPQXIZY",
        "effects": [
          {
            "base_asset": "SWM4",
            "is_buy": true,
            "matches": [
              {
                "base_amount": "0.007480",
                "fee_paid": "0.000084",
                "price": "1.000000",
                "quote_amount": "0.007480"
              }
            ],
            "quote_asset": "BTC"
          }
        ]
      },
      {
        "account_id": "GCPR6OZTQOWJRJDI2UYJK4TM3CMUS6XOKXUUC5Z3HZ5LZB6R7WBPWNVP",
        "balance_id": "BAG2BPHCPRMENRLDDSLKMPPCJ37TZMSMKTPOXYQP5WRU6K2QJ4I2JZO3",
        "effects": [
          {
            "base_asset": "SWM4",
            "is_buy": true,
            "matches": [
              {
                "base_amount": "0.007480",
                "fee_paid": "0.000084",
                "price": "1.000000",
                "quote_amount": "0.007480"
              }
            ],
            "quote_asset": "BTC"
          }
        ]
      },
      {
        "account_id": "GCJ22MP7JR6HDQ2KANPVKQDN7JVEFCEERLSXVXATRKG6OZU7LB2GHCVN",
        "balance_id": "BDSCHZZB6ZBG2YIXBSD2PNFRIB7SQTB5X5X3N5ZY5RAJQBLCJ7FPG2UV",
        "effects": [
          {
            "base_asset": "SWM4",
            "is_buy": true,
            "matches": [
              {
                "base_amount": "1.241503",
                "fee_paid": "0.013781",
                "price": "1.000000",
                "quote_amount": "1.241503"
              }
            ],
            "quote_asset": "BTC"
          }
        ]
      }
    ]
  },
  {
    "_links": {
      "self": {
        "href": "https://testnet.tokend.org/operations/973557416861697"
      },
      "transaction": {
        "href": "https://testnet.tokend.org/transactions/"
      },
      "succeeds": {
        "href": "https://testnet.tokend.org/effects?order=desc\u0026cursor=973557416861697"
      },
      "precedes": {
        "href": "https://testnet.tokend.org/effects?order=asc\u0026cursor=973557416861697"
      }
    },
    "id": "973557416861697",
    "paging_token": "973557416861697",
    "transaction_id": "973557416861696",
    "source_account": "GD7AHJHCDSQI6LVMEJEE2FTNCA2LJQZ4R64GUI3PWANSVEO4GEOWB636",
    "type": "check_sale_state",
    "type_i": 20,
    "state_i": 2,
    "state": "success",
    "identifier": "0",
    "ledger_close_time": "2018-02-24T17:20:47Z",
    "participants": [
      {
        "account_id": "GCJ22MP7JR6HDQ2KANPVKQDN7JVEFCEERLSXVXATRKG6OZU7LB2GHCVN",
        "balance_id": "BACSFUM3UI5QETD47II7HRZ3WIIYCDQEJT3L5SQ4ETWIXKLAIY27PWC7",
        "effects": [
          {
            "base_asset": "SWM3",
            "is_buy": true,
            "matches": [
              {
                "base_amount": "65.549272",
                "fee_paid": "21.389690",
                "price": "1.052628",
                "quote_amount": "68.999000"
              }
            ],
            "quote_asset": "SWM"
          }
        ]
      },
      {
        "account_id": "GBUY24GOTSRWOIW5IZAWXCR3BFFQIGO34C4SVQ6CEPZNC67DUKFWVVOJ",
        "balance_id": "BBOBWVBHDYVJKOGXBYFPYTSUX3CLWNINH67HTFYPCQCDSEAIIWPITCFF",
        "effects": [
          {
            "base_asset": "SWM3",
            "is_buy": true,
            "matches": [
              {
                "base_amount": "14169.725806",
                "fee_paid": "0.009752",
                "price": "0.000062",
                "quote_amount": "0.878523"
              }
            ],
            "quote_asset": "BTC"
          },
          {
            "base_asset": "SWM3",
            "is_buy": true,
            "matches": [
              {
                "base_amount": "12750.344827",
                "fee_paid": "0.473611",
                "price": "0.000725",
                "quote_amount": "9.244000"
              }
            ],
            "quote_asset": "ETH"
          }
        ]
      },
      {
        "account_id": "GCJ22MP7JR6HDQ2KANPVKQDN7JVEFCEERLSXVXATRKG6OZU7LB2GHCVN",
        "balance_id": "BBCLRXJ4NCZSZGSVGKVEJT6FZDXYBYTSW5PRKVAVLORIV6TJB3MSQ7EX",
        "effects": [
          {
            "base_asset": "SWM3",
            "is_buy": true,
            "matches": [
              {
                "base_amount": "36844.129032",
                "fee_paid": "0.025357",
                "price": "0.000062",
                "quote_amount": "2.284336"
              }
            ],
            "quote_asset": "BTC"
          },
          {
            "base_asset": "SWM3",
            "is_buy": true,
            "matches": [
              {
                "base_amount": "81.504827",
                "fee_paid": "0.003028",
                "price": "0.000725",
                "quote_amount": "0.059091"
              }
            ],
            "quote_asset": "ETH"
          },
          {
            "base_asset": "SWM3",
            "is_buy": true,
            "matches": [
              {
                "base_amount": "65.549272",
                "fee_paid": "21.389690",
                "price": "1.052628",
                "quote_amount": "68.999000"
              }
            ],
            "quote_asset": "SWM"
          }
        ]
      },
      {
        "account_id": "GC3KLKPJ7K5RFKORGDARBO2R4ROUGVTD65D76X45GDRGY77NP5FRTEZH",
        "balance_id": "BCAFWQLFFFHKQ25OPEIOX4LSZN5B2QIG4YHZOBTOZ3YMYSPDFNKOXYEV",
        "effects": [
          {
            "base_asset": "SWM3",
            "is_buy": false,
            "matches": [
              {
                "base_amount": "69269.419354",
                "fee_paid": "0.047673",
                "price": "0.000062",
                "quote_amount": "4.294704"
              }
            ],
            "quote_asset": "BTC"
          },
          {
            "base_asset": "SWM3",
            "is_buy": false,
            "matches": [
              {
                "base_amount": "29607.135171",
                "fee_paid": "1.099756",
                "price": "0.000725",
                "quote_amount": "21.465173"
              }
            ],
            "quote_asset": "ETH"
          },
          {
            "base_asset": "SWM3",
            "is_buy": false,
            "matches": [
              {
                "base_amount": "793.811298",
                "fee_paid": "259.032280",
                "price": "1.052628",
                "quote_amount": "835.588000"
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
            "base_asset": "SWM3",
            "is_buy": true,
            "matches": [
              {
                "base_amount": "81.504827",
                "fee_paid": "0.003028",
                "price": "0.000725",
                "quote_amount": "0.059091"
              }
            ],
            "quote_asset": "ETH"
          }
        ]
      },
      {
        "account_id": "GC3KLKPJ7K5RFKORGDARBO2R4ROUGVTD65D76X45GDRGY77NP5FRTEZH",
        "balance_id": "BD3R62AHVCHRIBQKQRO4NNBMKRTNCXAB66SHASFI6M7PEVB5SZCAA345",
        "effects": [
          {
            "base_asset": "SWM3",
            "is_buy": false,
            "matches": [
              {
                "base_amount": "29607.135171",
                "fee_paid": "1.099756",
                "price": "0.000725",
                "quote_amount": "21.465173"
              }
            ],
            "quote_asset": "ETH"
          }
        ]
      },
      {
        "account_id": "GCJ22MP7JR6HDQ2KANPVKQDN7JVEFCEERLSXVXATRKG6OZU7LB2GHCVN",
        "balance_id": "BDSCHZZB6ZBG2YIXBSD2PNFRIB7SQTB5X5X3N5ZY5RAJQBLCJ7FPG2UV",
        "effects": [
          {
            "base_asset": "SWM3",
            "is_buy": true,
            "matches": [
              {
                "base_amount": "36844.129032",
                "fee_paid": "0.025357",
                "price": "0.000062",
                "quote_amount": "2.284336"
              }
            ],
            "quote_asset": "BTC"
          }
        ]
      },
      {
        "account_id": "GBUY24GOTSRWOIW5IZAWXCR3BFFQIGO34C4SVQ6CEPZNC67DUKFWVVOJ",
        "balance_id": "BBJ5WHSYJH6QVVLKZKKC5IH2DQ5NQB2PJ3AINJDMXGRKNZGWUNLK7JTY",
        "effects": [
          {
            "base_asset": "SWM3",
            "is_buy": true,
            "matches": [
              {
                "base_amount": "12750.344827",
                "fee_paid": "0.473611",
                "price": "0.000725",
                "quote_amount": "9.244000"
              }
            ],
            "quote_asset": "ETH"
          }
        ]
      },
      {
        "account_id": "GCPR6OZTQOWJRJDI2UYJK4TM3CMUS6XOKXUUC5Z3HZ5LZB6R7WBPWNVP",
        "balance_id": "BB4GIXF7ZF5SPLFMOHRVZHYYWAVSDHWCQ7PVFTRQDEGKA7FLMHZKHNOY",
        "effects": [
          {
            "base_asset": "SWM3",
            "is_buy": true,
            "matches": [
              {
                "base_amount": "16775.285517",
                "fee_paid": "0.623117",
                "price": "0.000725",
                "quote_amount": "12.162082"
              }
            ],
            "quote_asset": "ETH"
          }
        ]
      },
      {
        "account_id": "GCPR6OZTQOWJRJDI2UYJK4TM3CMUS6XOKXUUC5Z3HZ5LZB6R7WBPWNVP",
        "balance_id": "BA2NFMHPWUKDWWXNMJAZNPP3JJT7YJKSNPRLGJHRXZPMVL6NC4RCHJVP",
        "effects": [
          {
            "base_asset": "SWM3",
            "is_buy": true,
            "matches": [
              {
                "base_amount": "18255.564516",
                "fee_paid": "0.012564",
                "price": "0.000062",
                "quote_amount": "1.131845"
              }
            ],
            "quote_asset": "BTC"
          },
          {
            "base_asset": "SWM3",
            "is_buy": true,
            "matches": [
              {
                "base_amount": "16775.285517",
                "fee_paid": "0.623117",
                "price": "0.000725",
                "quote_amount": "12.162082"
              }
            ],
            "quote_asset": "ETH"
          },
          {
            "base_asset": "SWM3",
            "is_buy": true,
            "matches": [
              {
                "base_amount": "728.262026",
                "fee_paid": "237.642590",
                "price": "1.052628",
                "quote_amount": "766.589000"
              }
            ],
            "quote_asset": "SWM"
          }
        ]
      },
      {
        "account_id": "GBUY24GOTSRWOIW5IZAWXCR3BFFQIGO34C4SVQ6CEPZNC67DUKFWVVOJ",
        "balance_id": "BBU5CSWOEKKMCPXMSV6X3PMJ2FHVHPQF56T4CLTMQP7O36DBFNOUC2CW",
        "effects": [
          {
            "base_asset": "SWM3",
            "is_buy": true,
            "matches": [
              {
                "base_amount": "14169.725806",
                "fee_paid": "0.009752",
                "price": "0.000062",
                "quote_amount": "0.878523"
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
            "base_asset": "SWM3",
            "is_buy": false,
            "matches": [
              {
                "base_amount": "793.811298",
                "fee_paid": "259.032280",
                "price": "1.052628",
                "quote_amount": "835.588000"
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
            "base_asset": "SWM3",
            "is_buy": true,
            "matches": [
              {
                "base_amount": "728.262026",
                "fee_paid": "237.642590",
                "price": "1.052628",
                "quote_amount": "766.589000"
              }
            ],
            "quote_asset": "SWM"
          }
        ]
      },
      {
        "account_id": "GCPR6OZTQOWJRJDI2UYJK4TM3CMUS6XOKXUUC5Z3HZ5LZB6R7WBPWNVP",
        "balance_id": "BB5UAHKDVSOHI756OWMMY5EVZD2UWTTMTC5AGAVDPG42BOVJXKPQXIZY",
        "effects": [
          {
            "base_asset": "SWM3",
            "is_buy": true,
            "matches": [
              {
                "base_amount": "18255.564516",
                "fee_paid": "0.012564",
                "price": "0.000062",
                "quote_amount": "1.131845"
              }
            ],
            "quote_asset": "BTC"
          }
        ]
      },
      {
        "account_id": "GC3KLKPJ7K5RFKORGDARBO2R4ROUGVTD65D76X45GDRGY77NP5FRTEZH",
        "balance_id": "BBCJ7PKHO3QDR7LN3J6W3BQ6DY6O7TUIOTKEPYQLOXIQEAP3Z6OF4QN7",
        "effects": [
          {
            "base_asset": "SWM3",
            "is_buy": false,
            "matches": [
              {
                "base_amount": "69269.419354",
                "fee_paid": "0.047673",
                "price": "0.000062",
                "quote_amount": "4.294704"
              }
            ],
            "quote_asset": "BTC"
          }
        ]
      }
    ]
  },
  {
    "_links": {
      "self": {
        "href": "https://testnet.tokend.org/operations/972183027322881"
      },
      "transaction": {
        "href": "https://testnet.tokend.org/transactions/"
      },
      "succeeds": {
        "href": "https://testnet.tokend.org/effects?order=desc\u0026cursor=972183027322881"
      },
      "precedes": {
        "href": "https://testnet.tokend.org/effects?order=asc\u0026cursor=972183027322881"
      }
    },
    "id": "972183027322881",
    "paging_token": "972183027322881",
    "transaction_id": "972183027322880",
    "source_account": "GD7AHJHCDSQI6LVMEJEE2FTNCA2LJQZ4R64GUI3PWANSVEO4GEOWB636",
    "type": "check_sale_state",
    "type_i": 20,
    "state_i": 2,
    "state": "success",
    "identifier": "0",
    "ledger_close_time": "2018-02-24T16:54:07Z",
    "participants": [
      {
        "account_id": "GBH26MZ6GZ4TDTOR4CU2VAF3ZMDELKCUHFARL7CXUTGG62ZTKXVOQ32Z",
        "balance_id": "BCYO4GXFXMIT2MRD3EXDHSKTET3HL3YWHY3246C2BHQXHR5737JI3YM2",
        "effects": [
          {
            "base_asset": "SWM2",
            "is_buy": true,
            "matches": [
              {
                "base_amount": "0.021390",
                "fee_paid": "0.000214",
                "price": "1.000000",
                "quote_amount": "0.021390"
              }
            ],
            "quote_asset": "BTC"
          },
          {
            "base_asset": "SWM2",
            "is_buy": true,
            "matches": [
              {
                "base_amount": "202.960040",
                "fee_paid": "0.000000",
                "price": "1.000000",
                "quote_amount": "202.960040"
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
            "base_asset": "SWM2",
            "is_buy": true,
            "matches": [
              {
                "base_amount": "0.163281",
                "fee_paid": "0.001813",
                "price": "1.000000",
                "quote_amount": "0.163281"
              }
            ],
            "quote_asset": "BTC"
          }
        ]
      },
      {
        "account_id": "GBH26MZ6GZ4TDTOR4CU2VAF3ZMDELKCUHFARL7CXUTGG62ZTKXVOQ32Z",
        "balance_id": "BA3SSCHD5YZRPC73ZAFLMKUK6TNEL2QILQFFAHOXKUDUCCXN6FWGBMMF",
        "effects": [
          {
            "base_asset": "SWM2",
            "is_buy": true,
            "matches": [
              {
                "base_amount": "202.960040",
                "fee_paid": "0.000000",
                "price": "1.000000",
                "quote_amount": "202.960040"
              }
            ],
            "quote_asset": "SWM"
          }
        ]
      },
      {
        "account_id": "GBH26MZ6GZ4TDTOR4CU2VAF3ZMDELKCUHFARL7CXUTGG62ZTKXVOQ32Z",
        "balance_id": "BB6JXJNEJHVM55PAMKEJGHTVGSS7K6KZMFO2WMHTCUXHMHDOQFT5UNUY",
        "effects": [
          {
            "base_asset": "SWM2",
            "is_buy": true,
            "matches": [
              {
                "base_amount": "0.021390",
                "fee_paid": "0.000214",
                "price": "1.000000",
                "quote_amount": "0.021390"
              }
            ],
            "quote_asset": "BTC"
          }
        ]
      },
      {
        "account_id": "GB5BPLD4FUURS3UBX46FO6PFMYWLGU2WZL2UQVYEVDM3VFVAIEBGM5K2",
        "balance_id": "BBDZCUCLLYUHVY23TG4RCI3BXPNIU4DMZQOMFNAZRNW3PNH3TOVRVOLW",
        "effects": [
          {
            "base_asset": "SWM2",
            "is_buy": false,
            "matches": [
              {
                "base_amount": "0.193858",
                "fee_paid": "0.002153",
                "price": "1.000000",
                "quote_amount": "0.193858"
              }
            ],
            "quote_asset": "BTC"
          }
        ]
      },
      {
        "account_id": "GB5BPLD4FUURS3UBX46FO6PFMYWLGU2WZL2UQVYEVDM3VFVAIEBGM5K2",
        "balance_id": "BDXZQIB67WQG3D76C3IMTIJDUFJEFMTFUR2DLPDXWR35YS5FTSXHRK36",
        "effects": [
          {
            "base_asset": "SWM2",
            "is_buy": false,
            "matches": [
              {
                "base_amount": "0.193858",
                "fee_paid": "0.002153",
                "price": "1.000000",
                "quote_amount": "0.193858"
              }
            ],
            "quote_asset": "BTC"
          },
          {
            "base_asset": "SWM2",
            "is_buy": false,
            "matches": [
              {
                "base_amount": "560.831869",
                "fee_paid": "173.857880",
                "price": "1.000000",
                "quote_amount": "560.831869"
              }
            ],
            "quote_asset": "SWM"
          }
        ]
      },
      {
        "account_id": "GB5BPLD4FUURS3UBX46FO6PFMYWLGU2WZL2UQVYEVDM3VFVAIEBGM5K2",
        "balance_id": "BB5OHOJ3C3E32GDMEYTFY72NBWCZIAJ5ZVUUCMQ54VSJLDP4HEHO7R3H",
        "effects": [
          {
            "base_asset": "SWM2",
            "is_buy": false,
            "matches": [
              {
                "base_amount": "560.831869",
                "fee_paid": "173.857880",
                "price": "1.000000",
                "quote_amount": "560.831869"
              }
            ],
            "quote_asset": "SWM"
          }
        ]
      },
      {
        "account_id": "GC3KLKPJ7K5RFKORGDARBO2R4ROUGVTD65D76X45GDRGY77NP5FRTEZH",
        "balance_id": "BDPQVVOI7OKKYS5KTOLLJ7FCQ7HUBCFZPKC6QZW6F2QAFPFGR4VJZ2QL",
        "effects": [
          {
            "base_asset": "SWM2",
            "is_buy": true,
            "matches": [
              {
                "base_amount": "357.871829",
                "fee_paid": "0.000000",
                "price": "1.000000",
                "quote_amount": "357.871829"
              }
            ],
            "quote_asset": "SWM"
          }
        ]
      },
      {
        "account_id": "GCJ22MP7JR6HDQ2KANPVKQDN7JVEFCEERLSXVXATRKG6OZU7LB2GHCVN",
        "balance_id": "BCJEWTZGGKV4JSIM65ZU5TIXYVYY5JVZL3EI33FCLYZLJNSAE6FLWLG2",
        "effects": [
          {
            "base_asset": "SWM2",
            "is_buy": true,
            "matches": [
              {
                "base_amount": "0.163281",
                "fee_paid": "0.001813",
                "price": "1.000000",
                "quote_amount": "0.163281"
              }
            ],
            "quote_asset": "BTC"
          }
        ]
      },
      {
        "account_id": "GC3KLKPJ7K5RFKORGDARBO2R4ROUGVTD65D76X45GDRGY77NP5FRTEZH",
        "balance_id": "BBCJ7PKHO3QDR7LN3J6W3BQ6DY6O7TUIOTKEPYQLOXIQEAP3Z6OF4QN7",
        "effects": [
          {
            "base_asset": "SWM2",
            "is_buy": true,
            "matches": [
              {
                "base_amount": "0.009187",
                "fee_paid": "0.000092",
                "price": "1.000000",
                "quote_amount": "0.009187"
              }
            ],
            "quote_asset": "BTC"
          }
        ]
      },
      {
        "account_id": "GC3KLKPJ7K5RFKORGDARBO2R4ROUGVTD65D76X45GDRGY77NP5FRTEZH",
        "balance_id": "BDLWL5DU262EZ6BKWZSJBUIIWSR4727K3OAT64KY5JBPGTRDKQVMSXZL",
        "effects": [
          {
            "base_asset": "SWM2",
            "is_buy": true,
            "matches": [
              {
                "base_amount": "0.009187",
                "fee_paid": "0.000092",
                "price": "1.000000",
                "quote_amount": "0.009187"
              }
            ],
            "quote_asset": "BTC"
          },
          {
            "base_asset": "SWM2",
            "is_buy": true,
            "matches": [
              {
                "base_amount": "357.871829",
                "fee_paid": "0.000000",
                "price": "1.000000",
                "quote_amount": "357.871829"
              }
            ],
            "quote_asset": "SWM"
          }
        ]
      }
    ]
  },
  {
    "_links": {
      "self": {
        "href": "https://testnet.tokend.org/operations/234831631880193"
      },
      "transaction": {
        "href": "https://testnet.tokend.org/transactions/"
      },
      "succeeds": {
        "href": "https://testnet.tokend.org/effects?order=desc\u0026cursor=234831631880193"
      },
      "precedes": {
        "href": "https://testnet.tokend.org/effects?order=asc\u0026cursor=234831631880193"
      }
    },
    "id": "234831631880193",
    "paging_token": "234831631880193",
    "transaction_id": "234831631880192",
    "source_account": "GD7AHJHCDSQI6LVMEJEE2FTNCA2LJQZ4R64GUI3PWANSVEO4GEOWB636",
    "type": "create_issuance_request",
    "type_i": 3,
    "state_i": 2,
    "state": "success",
    "identifier": "31",
    "ledger_close_time": "2018-02-14T18:23:14Z",
    "participants": [
      {
        "account_id": "GD7AHJHCDSQI6LVMEJEE2FTNCA2LJQZ4R64GUI3PWANSVEO4GEOWB636"
      },
      {
        "account_id": "GCJ22MP7JR6HDQ2KANPVKQDN7JVEFCEERLSXVXATRKG6OZU7LB2GHCVN",
        "balance_id": "BDSCHZZB6ZBG2YIXBSD2PNFRIB7SQTB5X5X3N5ZY5RAJQBLCJ7FPG2UV"
      }
    ],
    "reference": "weqqweqw",
    "amount": "100.000000",
    "asset": "BTC",
    "fee_fixed": "0.000000",
    "fee_percent": "0.000000",
    "external_details": {}
  },
]

const next = () => {
  return Promise.resolve({
    next,
    records
  })
}

export const transactionsResponse = {
  next,
  records
}

export const detailsResponse = new CommonResponseBuilder({
  users: {
    mockAccountId: {
      email: mockEmail
    }
  }
})
