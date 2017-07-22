import Immutable from "immutable";

const assetArray = [
    {
        "id":"1.3.1072",
        "symbol":"BLOCKPAY",
        "precision":4,
        "issuer":"1.2.96393",
        "options":{
            "max_supply":"1000000000000",
            "market_fee_percent":200,
            "max_market_fee":"10000000000",
            "issuer_permissions":79,
            "flags":1,
            "core_exchange_rate":{
                "base":{
                    "amount":2500000,
                    "asset_id":"1.3.0"
                },
                "quote":{
                    "amount":10000,
                    "asset_id":"1.3.1072"
                }
            },
            "whitelist_authorities":[],
            "blacklist_authorities":[],
            "whitelist_markets":[],
            "blacklist_markets":[],
            "description":"{\"main\":\"BlockPay tokens allows you to share in the rewards from BlockPay transactions as well as value \\nincreases from products built by the Company. \\nMore info @ www.BlockPay.ch\",\"market\":\"\",\"short_name\":\"BlockPay\"}",
            "extensions":[]
        },
        "dynamic_asset_data_id":"2.3.1072",
        "dynamic_data":{
            "id":"2.3.1072",
            "current_supply":"989283163300",
            "confidential_supply":0,
            "accumulated_fees":31744072,
            "fee_pool":194
        },
        "market_asset":false
    },
    {
        "id":"1.3.776","symbol":"OPENPOS","precision":4,"issuer":"1.2.96393","options":{"max_supply":"5000000000","market_fee_percent":200,"max_market_fee":"10000000000000","issuer_permissions":79,"flags":1,"core_exchange_rate":{"base":{"amount":2500000,"asset_id":"1.3.0"},"quote":{"amount":10000,"asset_id":"1.3.776"}},"whitelist_authorities":[],"blacklist_authorities":[],"whitelist_markets":[],"blacklist_markets":[],"description":"This token helps to fund the completion of BitShares Wallet v1.0 for Android/iPhone and the Smartcoins POS systems. Share the benefits! ","extensions":[]},"dynamic_asset_data_id":"2.3.776","dynamic_data":{"id":"2.3.776","current_supply":"5000000000","confidential_supply":0,"accumulated_fees":973382,"fee_pool":847003},"market_asset":false
    },
    {
        "id":"1.3.1072","symbol":"BLOCKPAY","precision":4,"issuer":"1.2.96393","options":{"max_supply":"1000000000000","market_fee_percent":200,"max_market_fee":"10000000000","issuer_permissions":79,"flags":1,"core_exchange_rate":{"base":{"amount":2500000,"asset_id":"1.3.0"},"quote":{"amount":10000,"asset_id":"1.3.1072"}},"whitelist_authorities":[],"blacklist_authorities":[],"whitelist_markets":[],"blacklist_markets":[],"description":"{\"main\":\"BlockPay tokens allows you to share in the rewards from BlockPay transactions as well as value \\nincreases from products built by the Company. \\nMore info @ www.BlockPay.ch\",\"market\":\"\",\"short_name\":\"BlockPay\"}","extensions":[]},"dynamic_asset_data_id":"2.3.1072","dynamic_data":{"id":"2.3.1072","current_supply":"989283163300","confidential_supply":0,"accumulated_fees":56244836,"fee_pool":194},"market_asset":false
    },
    {
        "id":"1.3.1389","symbol":"ZENGOLD","precision":8,"issuer":"1.2.96393","options":{"max_supply":"1000000000000000","market_fee_percent":30,"max_market_fee":"100000000000000","issuer_permissions":79,"flags":1,"core_exchange_rate":{"base":{"amount":100000,"asset_id":"1.3.0"},"quote":{"amount":100000000,"asset_id":"1.3.1389"}},"whitelist_authorities":[],"blacklist_authorities":[],"whitelist_markets":[],"blacklist_markets":[],"description":"{\"main\":\"ZENGOLD is a native asset on OpenLedger backed by Danish OpenLedger ApS in agreement with Viewfin, the founders of the crypto asset ZenGold which is developed on the Metaverse Blockchain. ZenGold creates crypto assets that are backed by physical gold enabling investors to instantly buy and transfer gold, in any quantity, anywhere in the world. \\n\\nAnd estimated amount of 9.3 million tokens is made available on OpenLedger  on May 27 at 12.00 NOON GMT and will be offered on selected markets in the form of the asset ZENGOLD. A new crypto gateway OPEN.ZGC will then be made available on the day of distribution and all ZENGOLD native tokens on OpenLedger will be offered to be converted to the OPEN.ZGC 1:1 which you could then withdraw to your official ZenGold wallet as you would with any other crypto.\\nFor more information about ZenGold please visit: http://www.zengold.org\\nAny questions to OpenLedger pls send to support@openledger.info\",\"market\":\"\",\"short_name\":\"ZENGOLD \"}","extensions":[]},"dynamic_asset_data_id":"2.3.1389","dynamic_data":{"id":"2.3.1389","current_supply":"945000000000000","confidential_supply":0,"accumulated_fees":"206772594399","fee_pool":179969098},"market_asset":false
    }
    ,
    { //Asset bitUSD
        "dynamic_asset_data_id":"2.3.121",
        "bitasset":{
            "current_feed":{
                "settlement_price":{
                    "base":{
                        "amount":681,
                        "asset_id":"1.3.121"
                    },
                    "quote":{
                        "amount":39644,"asset_id":"1.3.0"
                    }
                },
                "maintenance_collateral_ratio":1750,
                "maximum_short_squeeze_ratio":1100,
                "core_exchange_rate":{
                    "base":{
                        "amount":1432,
                        "asset_id":"1.3.121"
                    },
                    "quote":{
                        "amount":80158,
                        "asset_id":"1.3.0"
                    }
                }
            },
            "asset_id":"1.3.121",
            "settlement_price":{
                "base":{
                    "amount":0,
                    "asset_id":"1.3.0"
                },
                "quote":{
                    "amount":0,
                    "asset_id":"1.3.0"
                }
            },
            "force_settled_volume":0,
            "feeds":[
                ["1.2.167",
                    ["2017-06-09T08:48:09",{
                        "settlement_price":{
                            "base":{
                                "amount":833,
                                "asset_id":"1.3.121"
                            },
                            "quote":{
                                "amount":47993,
                                "asset_id":"1.3.0"
                            }
                        },
                        "maintenance_collateral_ratio":1750,
                        "maximum_short_squeeze_ratio":1100,
                        "core_exchange_rate":{
                            "base":{
                                "amount":833,
                                "asset_id":"1.3.121"
                            },
                            "quote":{
                                "amount":45593,
                                "asset_id":"1.3.0"
                            }
                        }
                    }
                    ]
                ],
                ["1.2.277",["2017-06-09T08:24:57",{"settlement_price":{"base":{"amount":168401,"asset_id":"1.3.121"},"quote":{"amount":10000000,"asset_id":"1.3.0"}},"maintenance_collateral_ratio":1750,"maximum_short_squeeze_ratio":1100,"core_exchange_rate":{"base":{"amount":168401,"asset_id":"1.3.121"},"quote":{"amount":9500000,"asset_id":"1.3.0"}}}]],
                ["1.2.333",["2017-06-09T08:50:09",{"settlement_price":{"base":{"amount":1432,"asset_id":"1.3.121"},"quote":{"amount":84377,"asset_id":"1.3.0"}},"maintenance_collateral_ratio":1750,"maximum_short_squeeze_ratio":1100,"core_exchange_rate":{"base":{"amount":1432,"asset_id":"1.3.121"},"quote":{"amount":80158,"asset_id":"1.3.0"}}}]],
                ["1.2.564",["2017-06-09T05:14:48",{"settlement_price":{"base":{"amount":1117,"asset_id":"1.3.121"},"quote":{"amount":61599,"asset_id":"1.3.0"}},"maintenance_collateral_ratio":1750,"maximum_short_squeeze_ratio":1100,"core_exchange_rate":{"base":{"amount":1721,"asset_id":"1.3.121"},"quote":{"amount":93968,"asset_id":"1.3.0"}}}]],
                ["1.2.964",["2017-06-09T05:14:45",{"settlement_price":{"base":{"amount":414,"asset_id":"1.3.121"},"quote":{"amount":22823,"asset_id":"1.3.0"}},"maintenance_collateral_ratio":1750,"maximum_short_squeeze_ratio":1100,"core_exchange_rate":{"base":{"amount":1247,"asset_id":"1.3.121"},"quote":{"amount":68064,"asset_id":"1.3.0"}}}]],
                ["1.2.1191",["2016-08-31T06:21:00",{"settlement_price":{"base":{"amount":67,"asset_id":"1.3.121"},"quote":{"amount":90389,"asset_id":"1.3.0"}},"maintenance_collateral_ratio":1750,"maximum_short_squeeze_ratio":1100,"core_exchange_rate":{"base":{"amount":67,"asset_id":"1.3.121"},"quote":{"amount":85869,"asset_id":"1.3.0"}}}]],
                ["1.2.2850",["2017-06-09T08:53:09",{"settlement_price":{"base":{"amount":1580,"asset_id":"1.3.121"},"quote":{"amount":90371, "asset_id":"1.3.0"}},"maintenance_collateral_ratio":1750, "maximum_short_squeeze_ratio":1100, "core_exchange_rate":{"base":{"amount":1580, "asset_id":"1.3.121"},"quote":{"amount":85852,"asset_id":"1.3.0"}}}]],
                ["1.2.3284",["2017-06-09T05:19:06",{"settlement_price":{"base":{"amount":1491,"asset_id":"1.3.121"},"quote":{"amount":82462,"asset_id":"1.3.0"}},"maintenance_collateral_ratio":1750,"maximum_short_squeeze_ratio":1100,"core_exchange_rate":{"base":{"amount":701,"asset_id":"1.3.121"},"quote":{"amount":38386,"asset_id":"1.3.0"}}}]],
                ["1.2.4952",["2017-06-09T08:54:09",{"settlement_price":{"base":{"amount":1576,"asset_id":"1.3.121"},"quote":{"amount":90377,"asset_id":"1.3.0"}},"maintenance_collateral_ratio":1750,"maximum_short_squeeze_ratio":1100,"core_exchange_rate":{"base":{"amount":1576,"asset_id":"1.3.121"},"quote":{"amount":85858,"asset_id":"1.3.0"}}}]],
                ["1.2.6004",["2016-01-14T04:00:00",{"settlement_price":{"base":{"amount":23,"asset_id":"1.3.121"},"quote":{"amount":68677,"asset_id":"1.3.0"}},"maintenance_collateral_ratio":1750,"maximum_short_squeeze_ratio":1100,"core_exchange_rate":{"base":{"amount":23,"asset_id":"1.3.121"},"quote":{"amount":65243,"asset_id":"1.3.0"}}}]],
                ["1.2.9952",["2017-06-09T08:14:36",{"settlement_price":{"base":{"amount":1613,"asset_id":"1.3.121"},"quote":{"amount":94202,"asset_id":"1.3.0"}},"maintenance_collateral_ratio":1750,"maximum_short_squeeze_ratio":1100,"core_exchange_rate":{"base":{"amount":1728,"asset_id":"1.3.121"},"quote":{"amount":99919,"asset_id":"1.3.0"}}}]],
                ["1.2.10091",["2017-06-09T08:54:12",{"settlement_price":{"base":{"amount":721,"asset_id":"1.3.121"},"quote":{"amount":41242,"asset_id":"1.3.0"}},"maintenance_collateral_ratio":1750,"maximum_short_squeeze_ratio":1100,"core_exchange_rate":{"base":{"amount":1703,"asset_id":"1.3.121"},"quote":{"amount":96449,"asset_id":"1.3.0"}}}]],
                ["1.2.10285",["2017-06-09T08:02:30",{"settlement_price":{"base":{"amount":1724,"asset_id":"1.3.121"},"quote":{"amount":99979,"asset_id":"1.3.0"}},"maintenance_collateral_ratio":1750,"maximum_short_squeeze_ratio":1100,"core_exchange_rate":{"base":{"amount":1346,"asset_id":"1.3.121"},"quote":{"amount":77285,"asset_id":"1.3.0"}}}]],
                ["1.2.13774",["2015-11-16T03:47:03",{"settlement_price":{"base":{"amount":31,"asset_id":"1.3.121"},"quote":{"amount":89750,"asset_id":"1.3.0"}},"maintenance_collateral_ratio":1750,"maximum_short_squeeze_ratio":1100,"core_exchange_rate":{"base":{"amount":31,"asset_id":"1.3.121"},"quote":{"amount":85262,"asset_id":"1.3.0"}}}]],
                ["1.2.14035",["2017-06-09T08:32:57",{"settlement_price":{"base":{"amount":182,"asset_id":"1.3.121"},"quote":{"amount":10617,"asset_id":"1.3.0"}},"maintenance_collateral_ratio":1750,"maximum_short_squeeze_ratio":1100,"core_exchange_rate":{"base":{"amount":1712,"asset_id":"1.3.121"},"quote":{"amount":98881,"asset_id":"1.3.0"}}}]],
                ],
            "is_prediction_market":false,
            "settlement_fund":0,
            "id":"2.4.21",
            "current_feed_publication_time":"2017-06-09T04:16:15",
            "options":{
                "feed_lifetime_sec":86400,
                "minimum_feeds":7,
                "force_settlement_delay_sec":86400,
                "force_settlement_offset_percent":100,
                "maximum_force_settlement_volume":50,
                "short_backing_asset":"1.3.0",
                "extensions":[]
             }
        },
        "bitasset_data_id":"2.4.21",
        "symbol":"USD",
        "issuer":"luke-skywalker",
        "id":"1.3.121",
        "precision":4,
        "options":{
            "flags":128,
            "market_fee_percent":0,
            "whitelist_authorities":[],
            "max_supply":"1000000000000000",
            "extensions":[],
            "blacklist_markets":[],
            "core_exchange_rate":{
                "base":{
                    "amount":1432,
                    "asset_id":"1.3.121"
                },
                "quote":{
                    "amount":80158,
                    "asset_id":"1.3.0"
                }
            },
            "description":"1 United States dollar",
            "max_market_fee":"1000000000000000",
            "issuer_permissions":511,
            "blacklist_authorities":[],
            "whitelist_markets":[]
        },
        "dynamic_data":{
            "asset_id":"1.3.121",
            "id":"2.3.121",
            "current_supply": "26189309379",
            "confidential_supply":3459,
            "accumulated_fees":467407,
            "fee_pool":"13501640286"
        }
    }
]

const testnetAssets = [
    {
        "id":1,
        "fee":"0.001 GOLOS",
        "issuer":"destroyer2k",
        "asset_name":"ZXC",
        "precision":4,
        "common_options":{
            "max_supply":"1000000000",
            "market_fee_percent":0,
            "max_market_fee":"0",
            "issuer_permissions":77,
            "flags":4,
            "core_exchange_rate":{
                "base":"10 GOLOS",
                "quote":"100 ZXC"
            },
            "whitelist_authorities":[],
            "blacklist_authorities":[],
            "whitelist_markets":[],
            "blacklist_markets":[],
            "description":"{\"main\":\"some description\",\"short_name\":\"short description\",\"market\":\"\"}",
            "extensions":[]
        },
        "is_prediction_market":false,
        "extensions":[],
        "dynamic_data" : {
            "id":1,
            "asset_name":"ZXC",
            "current_supply":"43310388291",
            "confidential_supply":0,
            "accumulated_fees":0,
            "fee_pool":0
        }
    },
    ///bitAsset
    {
        "id":2,
        "fee":"0.001 GOLOS",
        "issuer":"destroyer2k",
        "asset_name":"CXZ",
        "precision":5,
        "common_options":{
            "max_supply":"10000000000",
            "market_fee_percent":0,
            "max_market_fee":"0",
            "issuer_permissions":511,
            "flags":478,
            "core_exchange_rate":{
                "base":"10 GOLOS",
                "quote":"20 CXZ"
            },
            "whitelist_authorities":[],
            "blacklist_authorities":[],
            "whitelist_markets":[],
            "blacklist_markets":[],
            "description":"{\"main\":\"some description\",\"short_name\":\"short description\",\"market\":\"\"}",
            "extensions":[]
        },
        "is_prediction_market":false,
        "extensions":[],
        "bitasset_opts":{
            "feed_lifetime_sec":86400,
            "minimum_feeds":1,
            "force_settlement_delay_sec":86400,
            "force_settlement_offset_percent":0,
            "maximum_force_settlement_volume":2000,
            "short_backing_asset":"GOLOS"
        },
        "dynamic_data" : {
            "id":2,
            "asset_name":"CXZ",
            "current_supply":"43310388291",
            "confidential_supply":0,
            "accumulated_fees":0,
            "fee_pool":0
        }

    }
]

const golosAsset = {
    "id":0,
    "asset_name":"GOLOS",
    "precision":3,
    "issuer":"null",
    "market_issued":false,
    "options":{
        "max_supply":"1000000000000000",
        "market_fee_percent":0,
        "max_market_fee":"1000000000000000",
        "issuer_permissions":0,
        "flags":0,
        "core_exchange_rate":{
            "base":"0.001 GOLOS",
            "quote":"0.001 GOLOS"
        },
        "whitelist_authorities":[],
        "blacklist_authorities":[],
        "whitelist_markets":[],
        "blacklist_markets":[],
        "description":"",
        "extensions":[]
    },
    'dynamic_data' : {
        "id":0,
        "asset_name":"GOLOS",
        "current_supply":"43310388291",
        "confidential_supply":0,
        "accumulated_fees":0,
        "fee_pool":0
    }
};


export function getAssets() {
    let assets = Immutable.Map()
    // assetArray.forEach(asset => {
    //     assets = assets.set(asset.id, asset)
    // })
    testnetAssets.forEach(asset => {
        assets = assets.set(asset.id, asset)
    })

    return assets
}

