---
title: Golos API Reference

language_tabs:
  - Javascript

toc_footers:

includes:

search: true
---

# Introduction

Welcome to the [Golos](https://golos.io) API and developer wiki portal! Golos is the social media platform where everyone gets paid for creating and curating content.

The following API documents provide details on how to interact with the Golos blockchain database API which can get information on accounts, content, blocks and much more!

The developer portal will also serve as a toolbox for Golos clients, libraries, and language wrappers.

The developer portal is currently in early release. Our developer portal docs are open source and
Golos developers are encouraged to contribute as this becomes the ultimate developer resource for Golos.io.

Please visit [https://github.com/GolosChain/docs-api](https://github.com/GolosChain/docs-api)

# Accounts

### Account Endpoints


```javascript
Example responses

get_account_count()
{
  "id": 2,
  "result": 38005
}

get_account_history("golos","50","2")
{
  "id": 35,
  "result": [
    [48, {
      "trx_id": "67764ebe9d772898275c47240746aa931608320f",
      "block": 683,
      "trx_in_block": 2,
      "op_in_trx": 0,
      "virtual_op": 0,
      "timestamp": "2016-10-18T11:38:42",
      "op": ["account_create", {
        "fee": "0.001 GOLOS",
        "creator": "golos",
        "new_account_name": "radulova",
        "owner": {
          "weight_threshold": 1,
          "account_auths": [],
          "key_auths": [
            ["GLS7fT199Amj6ntkFFrLbVvti7rCkaB5nvpEf4LkB5XVJZiovUHqU", 1]
          ]
        },
        "active": {
          "weight_threshold": 1,
          "account_auths": [],
          "key_auths": [
            ["GLS87GGuJQPwMy9PFyJsxvCmuMXMT3f3JGPqLQSWSTTqwyM8mjczs", 1]
          ]
        },
        "posting": {
          "weight_threshold": 1,
          "account_auths": [],
          "key_auths": [
            ["GLS7wukExHQS25dfCqGpFUFzoVESyt7snZpEqVBrXHBz9cdpAYXcc", 1]
          ]
        },
        "memo_key": "GLS6TdMVdLwPnCvpHNCXzXUsYVQPZipmW5y4VcGxMKqymb1o33ksq",
        "json_metadata": ""
      }]
    }],
    [49, {
      "trx_id": "8f289e6e18ea9475876c2721a8c4783e828d2b6c",
      "block": 684,
      "trx_in_block": 0,
      "op_in_trx": 0,
      "virtual_op": 0,
      "timestamp": "2016-10-18T11:38:45",
      "op": ["account_create", {
        "fee": "0.001 GOLOS",
        "creator": "golos",
        "new_account_name": "verola",
        "owner": {
          "weight_threshold": 1,
          "account_auths": [],
          "key_auths": [
            ["GLS6iKKMjsBdkrdhsemie9BEYhPoQS3R8mTgEeiweRGLewDPypYAN", 1]
          ]
        },
        "active": {
          "weight_threshold": 1,
          "account_auths": [],
          "key_auths": [
            ["GLS5aGAiLj9ANEBQZWz6koXFxzBA8ADiwb6489X4moVtqtm9aeJaZ", 1]
          ]
        },
        "posting": {
          "weight_threshold": 1,
          "account_auths": [],
          "key_auths": [
            ["GLS8hp3nysYQa2ToqrdJuy8e6FCBq1xxZJQbcupVuWu35UrJoaVWA", 1]
          ]
        },
        "memo_key": "GLS6x3WJVp2SY2pCSBHsCQ39wna6x1oqYviEcPF7ZaEK9P7aqqxrc",
        "json_metadata": ""
      }]
    }],
    [50, {
      "trx_id": "147e45dbfdac31a92e1b7fdda48be8e17863693c",
      "block": 685,
      "trx_in_block": 0,
      "op_in_trx": 0,
      "virtual_op": 0,
      "timestamp": "2016-10-18T11:38:48",
      "op": ["account_create", {
        "fee": "0.001 GOLOS",
        "creator": "golos",
        "new_account_name": "shakkar",
        "owner": {
          "weight_threshold": 1,
          "account_auths": [],
          "key_auths": [
            ["GLS6LxjGPkCrLEWo4rSktNfmiBycfERGCDifePtmEUwu2s9p1vZQM", 1]
          ]
        },
        "active": {
          "weight_threshold": 1,
          "account_auths": [],
          "key_auths": [
            ["GLS86jWnxHBdR8EJCg4oBwVpqdkUysx2uromsDYbg3LFte8XoY6yM", 1]
          ]
        },
        "posting": {
          "weight_threshold": 1,
          "account_auths": [],
          "key_auths": [
            ["GLS66NUt3P3NeGqZqG9GDtUB3FXsqqXjww85fyt7d8rdo8ci5KPRh", 1]
          ]
        },
        "memo_key": "GLS5cpgnRyUMmVzo4S2Hszw2EXQB6wLxbBj4SBBbyc7qmt8osyCGN",
        "json_metadata": ""
      }]
    }]
  ]
}

get_account_votes("golos")
{
  "id": 36,
  "result": [{
    "authorperm": "golosnews/na-banknotakh-v-200-i-2-tysyachi-rublei-budut-izobrazheny-sevastopol-i-dalnii-vostok",
    "weight": 0,
    "rshares": 0,
    "percent": 0,
    "time": "2017-02-02T13:19:48"
  }, {
    "authorperm": "econmag/ekonomicheskii-zhurnal-59-yuantekh-milliard-na-galstukakh-bogl-rossiya-ne-v-krizise-imitaciya-uspekha-i-drugoe",
    "weight": 0,
    "rshares": 0,
    "percent": 0,
    "time": "2017-02-02T16:04:21"
  }, {
    "authorperm": "escrows/garanty-na-golose-gui-dlya-otpravki-golos-gbg-s-garantom",
    "weight": 0,
    "rshares": 0,
    "percent": 0,
    "time": "2017-02-17T13:44:00"
  }, {
    "authorperm": "xanoxt/re-smotritelmayaka-re-cleptoman-re-smotritelmayaka-vopros-k-razrabotchikam-i-osnovatelyam-golosa-20170228t082418007z",
    "weight": 0,
    "rshares": 0,
    "percent": 0,
    "time": "2017-02-28T11:06:42"
  }, {
    "authorperm": "golos/obnovlenie-16-4rc1-neznachitelnye-fiksy",
    "weight": 0,
    "rshares": "171675450453213",
    "percent": 10000,
    "time": "2017-03-05T16:35:54"
  }, {
    "authorperm": "golos/otchyot-o-prodelannoi-rabote-komandy-golosa-za-20-02-2017-05-03-2017",
    "weight": 0,
    "rshares": "171675450453213",
    "percent": 10000,
    "time": "2017-03-06T13:48:45"
  }, {
    "authorperm": "golos/cmo-or-weekly-analytical-report-or-2017-03-06",
    "weight": 0,
    "rshares": "171675450453213",
    "percent": 10000,
    "time": "2017-03-07T07:21:57"
  }, {
    "authorperm": "golos/otchet-o-bage",
    "weight": 0,
    "rshares": "171675454415779",
    "percent": 10000,
    "time": "2017-03-10T15:10:06"
  }, {
    "authorperm": "golos/vmesto-ezhenedelnogo-otcheta",
    "weight": 0,
    "rshares": "171675526166068",
    "percent": 10000,
    "time": "2017-03-20T14:16:18"
  }, {
    "authorperm": "golos/blokchein-proekta-golos-vozmozhnosti-dlya-developerov",
    "weight": 0,
    "rshares": "171675968271884",
    "percent": 10000,
    "time": "2017-03-22T12:29:24"
  }, {
    "authorperm": "golos/diversifikaciya-portfelya-ico",
    "weight": 0,
    "rshares": "171675968271884",
    "percent": 10000,
    "time": "2017-03-22T18:38:42"
  }]
}

get_accounts(["golos"])
{
  "id": 37,
  "result": [{
    "id": 8469,
    "name": "golos",
    "owner": {
      "weight_threshold": 1,
      "account_auths": [],
      "key_auths": [
        ["GLS6Rk8stEjcRhweUxg4s6LYguT1Ms6tzKAiAfEonnJPwcPtHojPz", 1]
      ]
    },
    "active": {
      "weight_threshold": 1,
      "account_auths": [],
      "key_auths": [
        ["GLS8fdxXwFspKQrUyoEqPoAhWMb44wkJFoqp3TEZZAsLNWbgeYodk", 1]
      ]
    },
    "posting": {
      "weight_threshold": 1,
      "account_auths": [],
      "key_auths": [
        ["GLS6avidaRNGzSpqq8pX76Nqursz47doi68VPzEgDZo9b1ijm3EQV", 1]
      ]
    },
    "memo_key": "GLS738gqm2cEvRKMzi2i2qcvf4MyMXvCs8mL7vmDnVujqfFT5QJr8",
    "json_metadata": "",
    "proxy": "",
    "last_owner_update": "1970-01-01T00:00:00",
    "last_account_update": "1970-01-01T00:00:00",
    "created": "2016-10-18T11:16:00",
    "mined": false,
    "owner_challenged": false,
    "active_challenged": false,
    "last_owner_proved": "1970-01-01T00:00:00",
    "last_active_proved": "1970-01-01T00:00:00",
    "recovery_account": "cyberfounder",
    "last_account_recovery": "1970-01-01T00:00:00",
    "reset_account": "null",
    "comment_count": 0,
    "lifetime_vote_count": 0,
    "post_count": 45,
    "can_vote": true,
    "voting_power": 9950,
    "last_vote_time": "2017-03-22T18:38:42",
    "balance": "47500.036 GOLOS",
    "savings_balance": "0.000 GOLOS",
    "sbd_balance": "7351.037 GBG",
    "sbd_seconds": "0",
    "sbd_seconds_last_update": "2017-03-23T22:48:57",
    "sbd_last_interest_payment": "2017-03-23T22:48:57",
    "savings_sbd_balance": "0.000 GBG",
    "savings_sbd_seconds": "0",
    "savings_sbd_seconds_last_update": "1970-01-01T00:00:00",
    "savings_sbd_last_interest_payment": "1970-01-01T00:00:00",
    "savings_withdraw_requests": 0,
    "vesting_shares": "34339378002.167418 GESTS",
    "vesting_withdraw_rate": "0.000000 GESTS",
    "next_vesting_withdrawal": "1969-12-31T23:59:59",
    "withdrawn": 0,
    "to_withdraw": 0,
    "withdraw_routes": 0,
    "curation_rewards": 0,
    "posting_rewards": 96453953,
    "proxied_vsf_votes": [0, 0, 0, 0, 0, 0, 0, 0],
    "witnesses_voted_for": 0,
    "average_bandwidth": "6959424495",
    "lifetime_bandwidth": "3997897000000",
    "last_bandwidth_update": "2017-03-22T18:39:27",
    "average_market_bandwidth": 558000000,
    "last_market_bandwidth_update": "2017-02-21T18:44:09",
    "last_post": "2017-03-22T18:39:27",
    "last_root_post": "2017-03-22T18:38:42",
    "post_bandwidth": 17435,
    "new_average_bandwidth": "16401343948",
    "new_average_market_bandwidth": "5580000000",
    "vesting_balance": "0.000 GOLOS",
    "reputation": "114622683700029",
    "transfer_history": [],
    "market_history": [],
    "post_history": [],
    "vote_history": [],
    "other_history": [],
    "witness_votes": [],
    "tags_usage": [],
    "guest_bloggers": [],
    "blog_category": {}
  }]
}

```

`get_account_count`

`get_account_history`

*params: account(string), from(uint32_t), limit(uint32_t)*

`get_account_references`

*params: account(string)*

`get_account_votes`

*params: account(string)*

`get_accounts`

*params: accounts(strings) in nested array*


# Blocks

### Block Endpoints

```javascript
Example responses

get_block("3999999")
{
  "id": 10,
  "result": {
    "previous": "003d08fe2651a8351a66b14342d6deece8a2d23a",
    "timestamp": "2017-03-06T13:42:33",
    "witness": "user2",
    "transaction_merkle_root": "52e359879a730cfc441d166853871da39958a1e6",
    "extensions": [],
    "witness_signature": "203a0ec551e13d32be1613cd9419d0f596067d0e62fbadd46f3e471dc1677d72ec0eb4dda637431caf142df98b8674fc941f02d9ac2c042186e490e4ba480f30ec",
    "transactions": [{
      "ref_block_num": 2301,
      "ref_block_prefix": 2989006457,
      "expiration": "2017-03-06T13:42:58",
      "operations": [
        ["vote", {
          "voter": "golos-id",
          "author": "user-1",
          "permlink": "tashkent-den-2",
          "weight": 10000
        }]
      ],
      "extensions": [],
      "signatures": ["1f5242407b5f6dcf7b9823bc79bd6c536c261fa9662f9b85fd5e756fc663ed2dc7206036ce4fabfd6bb4a9b835145c1c6adba114054a98c23bdf19959ef45ad6ba"]
    }]
  }
}

get_block_header("3999999")
{
  "id": 17,
  "result": {
    "previous": "003d08fe2651a8351a66b14342d6deece8a2d23a",
    "timestamp": "2017-03-06T13:42:33",
    "witness": "user-1",
    "transaction_merkle_root": "52e359879a730cfc441d166853871da39958a1e6",
    "extensions": []
  }
}

```

`get_block`

*params: block number(uint32_t)*

`get_block_header`

*params: block number(uint32_t)*

# Content

### Content Endpoints

```javascript
Example responses

get_content("golos","blokchein-proekta-golos-vozmozhnosti-dlya-developerov")
{
  "id": 40,
  "result": {
    "id": 306805,
    "author": "golos",
    "permlink": "blokchein-proekta-golos-vozmozhnosti-dlya-developerov",
    "category": "ru--otkrytyijkod",
    "parent_author": "",
    "parent_permlink": "ru--otkrytyijkod",
    "title": "Блокчейн проекта Голос: возможности для девелоперов",
    "body": "...**“Блокчейн проекта Голос: возможности для девелоперов”**\n\nМитап пройдет по адресу: Центр Digital October, Берсеневская набережная, 6, стр. 3, город Москва. ...",
    "json_metadata": "{\"tags\":[\"ru--otkrytyijkod\",\"ru--golos\",\"golos\"],\"app\":\"steemit/0.1\",\"format\":\"markdown\"}",
    "last_update": "2017-03-22T12:29:24",
    "created": "2017-03-22T12:29:24",
    "active": "2017-03-23T09:19:36",
    "last_payout": "2017-03-23T14:02:51",
    "depth": 0,
    "children": 26,
    "children_rshares2": "174793488469522015735788081",
    "net_rshares": 0,
    "abs_rshares": 0,
    "vote_rshares": 0,
    "children_abs_rshares": "11371368234759",
    "cashout_time": "2017-04-22T14:02:51",
    "max_cashout_time": "2017-04-06T15:07:00",
    "total_vote_weight": 0,
    "reward_weight": 10000,
    "total_payout_value": "0.000 GBG",
    "curator_payout_value": "0.000 GBG",
    "author_rewards": 0,
    "net_votes": 64,
    "root_comment": 306805,
    "mode": "second_payout",
    "max_accepted_payout": "0.000 GBG",
    "percent_steem_dollars": 10000,
    "allow_replies": true,
    "allow_votes": true,
    "allow_curation_rewards": true,
    "url": "/ru--otkrytyijkod/@golos/blokchein-proekta-golos-vozmozhnosti-dlya-developerov",
    "root_title": "Блокчейн проекта Голос: возможности для девелоперов",
    "pending_payout_value": "0.000 GBG",
    "total_pending_payout_value": "4.323 GBG",
    "active_votes": [{
      "voter": "penambang",
      "weight": 0,
      "rshares": 210522425,
      "percent": 160,
      "reputation": 0,
      "time": "2017-03-22T13:10:57"
    }, {
      "voter": "berkah",
      "weight": 0,
      "rshares": 696375822,
      "percent": 150,
      "reputation": 0,
      "time": "2017-03-22T13:10:57"
    }, {
      "...": "...",
    }],
    "replies": [],
    "author_reputation": "114622683700029",
    "promoted": "0.000 GBG",
    "body_length": 0,
    "reblogged_by": []
  }
}

get_content_replies("golos","blokchein-proekta-golos-vozmozhnosti-dlya-developerov")
{
  "id": 41,
  "result": [{
    "id": 306830,
    "author": "litrbooh",
    "permlink": "re-golos-blokchein-proekta-golos-vozmozhnosti-dlya-developerov-20170322t123753143z",
    "category": "ru--otkrytyijkod",
    "parent_author": "golos",
    "parent_permlink": "blokchein-proekta-golos-vozmozhnosti-dlya-developerov",
    "title": "",
    "body": "Так пост надо было сделать с оплатой, вот и были бы пожертвования от блокчейна :)\n\nЗ.Ы. Всё ликвидные голоса и SBD с этого коммента переведу на @golos :)",
    "json_metadata": "{\"tags\":[\"ru--otkrytyijkod\"],\"users\":[\"golos\"]}",
    "last_update": "2017-03-22T12:45:57",
    "created": "2017-03-22T12:37:54",
    "active": "2017-03-23T09:08:54",
    "last_payout": "2017-03-23T14:02:51",
    "depth": 1,
    "children": 12,
    "children_rshares2": "174793488469522015735788081",
    "net_rshares": 0,
    "abs_rshares": 0,
    "vote_rshares": 0,
    "children_abs_rshares": 0,
    "cashout_time": "2017-04-22T14:02:51",
    "max_cashout_time": "1969-12-31T23:59:59",
    "total_vote_weight": 0,
    "reward_weight": 10000,
    "total_payout_value": "83.877 GBG",
    "curator_payout_value": "2.297 GBG",
    "author_rewards": 207263,
    "net_votes": 12,
    "root_comment": 306805,
    "mode": "second_payout",
    "max_accepted_payout": "1000000.000 GBG",
    "percent_steem_dollars": 10000,
    "allow_replies": true,
    "allow_votes": true,
    "allow_curation_rewards": true,
    "url": "/ru--otkrytyijkod/@golos/blokchein-proekta-golos-vozmozhnosti-dlya-developerov#@litrbooh/re-golos-blokchein-proekta-golos-vozmozhnosti-dlya-developerov-20170322t123753143z",
    "root_title": "Блокчейн проекта Голос: возможности для девелоперов",
    "pending_payout_value": "0.000 GBG",
    "total_pending_payout_value": "4.399 GBG",
    "active_votes": [],
    "replies": [],
    "author_reputation": "105399209926495",
    "promoted": "0.000 GBG",
    "body_length": 0,
    "reblogged_by": []
  }, {
    "id": 306860,
    "author": "vadbars",
    "permlink": "re-golos-blokchein-proekta-golos-vozmozhnosti-dlya-developerov-2017322t17573888z",
    "category": "ru--otkrytyijkod",
    "parent_author": "golos",
    "parent_permlink": "blokchein-proekta-golos-vozmozhnosti-dlya-developerov",
    "title": "",
    "body": "Трансляция будет?",
    "json_metadata": "{\"tags\":\"ru--otkrytyijkod\",\"app\":\"esteem/1.4.0\",\"format\":\"markdown+html\"}",
    "last_update": "2017-03-22T12:57:03",
    "created": "2017-03-22T12:57:03",
    "active": "2017-03-22T13:55:21",
    "last_payout": "2017-03-23T14:02:51",
    "depth": 1,
    "children": 1,
    "children_rshares2": "0",
    "net_rshares": 0,
    "abs_rshares": 0,
    "vote_rshares": 0,
    "children_abs_rshares": 0,
    "cashout_time": "2017-04-22T14:02:51",
    "max_cashout_time": "1969-12-31T23:59:59",
    "total_vote_weight": 0,
    "reward_weight": 10000,
    "total_payout_value": "0.261 GBG",
    "curator_payout_value": "0.086 GBG",
    "author_rewards": 647,
    "net_votes": 2,
    "root_comment": 306805,
    "mode": "second_payout",
    "max_accepted_payout": "1000000.000 GBG",
    "percent_steem_dollars": 10000,
    "allow_replies": true,
    "allow_votes": true,
    "allow_curation_rewards": true,
    "url": "/ru--otkrytyijkod/@golos/blokchein-proekta-golos-vozmozhnosti-dlya-developerov#@vadbars/re-golos-blokchein-proekta-golos-vozmozhnosti-dlya-developerov-2017322t17573888z",
    "root_title": "Блокчейн проекта Голос: возможности для девелоперов",
    "pending_payout_value": "0.000 GBG",
    "total_pending_payout_value": "0.000 GBG",
    "active_votes": [],
    "replies": [],
    "author_reputation": "10408464397643",
    "promoted": "0.000 GBG",
    "body_length": 0,
    "reblogged_by": []
  }, {
    "...": "..."
  }]
}

```

`get_content`

*params: account(string)*

`get_content_replies`

*params: account(string)*

# Discussions

### Discussion Endpoints

```javascript
Example responses

get_discussions_by_active({"tag":"golos","limit":"2"})
{
  "id": 27,
  "result": [{
    "id": 314165,
    "author": "itsynergis",
    "permlink": "verifikaciya-na-golos",
    "category": "kulturagolosa",
    "parent_author": "",
    "parent_permlink": "kulturagolosa",
    "title": "Верификация на Golos",
    "body": "Итак, мы - команда IT-юристов, выражаем свою благодарность команде Golos'а, а также @kulturagolosa.\n\nЭто наш официальный пост-подтверждение факта владения сайтом (и блогом) ItSynergis - http://itsynergis.ru/itsynergis-golos.\n\nБлагодарим за содействие!\n\nhttp://itsynergis.ru/assets/img/golos.jpg",
    "json_metadata": "{\"tags\":[\"kulturagolosa\",\"golos\",\"itsynergis\"],\"users\":[\"kulturagolosa\"],\"image\":[\"http://itsynergis.ru/assets/img/golos.jpg\"],\"links\":[\"http://itsynergis.ru/itsynergis-golos\"],\"app\":\"steemit/0.1\",\"format\":\"markdown\"}",
    "last_update": "2017-03-24T01:53:09",
    "created": "2017-03-24T01:53:09",
    "active": "2017-03-24T02:56:45",
    "last_payout": "1970-01-01T00:00:00",
    "depth": 0,
    "children": 2,
    "children_rshares2": "45393920646632562340348645",
    "net_rshares": "5020330498958",
    "abs_rshares": "5020330498958",
    "vote_rshares": "5020330498958",
    "children_abs_rshares": "5047458381379",
    "cashout_time": "2017-03-25T03:19:36",
    "max_cashout_time": "2017-04-07T01:53:09",
    "total_vote_weight": "10266669485160734675",
    "reward_weight": 10000,
    "total_payout_value": "0.000 GBG",
    "curator_payout_value": "0.000 GBG",
    "author_rewards": 0,
    "net_votes": 13,
    "root_comment": 314165,
    "mode": "first_payout",
    "max_accepted_payout": "1000000.000 GBG",
    "percent_steem_dollars": 0,
    "allow_replies": true,
    "allow_votes": true,
    "allow_curation_rewards": true,
    "url": "/kulturagolosa/@itsynergis/verifikaciya-na-golos",
    "root_title": "Верификация на Golos",
    "pending_payout_value": "1.117 GBG",
    "total_pending_payout_value": "1.120 GBG",
    "active_votes": [{
      "voter": "litrbooh",
      "weight": "2174352605979698399",
      "rshares": "1894202234342",
      "percent": 10000,
      "reputation": "105394782613401",
      "time": "2017-03-24T04:42:39"
    }, {
      "voter": "kurtbeil",
      "weight": "1248513418670939",
      "rshares": 859148839,
      "percent": 10000,
      "reputation": "137299870631",
      "time": "2017-03-24T04:26:00"
    }, {
      "...": "..."
    }],
    "replies": [],
    "author_reputation": "8526451285643",
    "promoted": "0.000 GBG",
    "body_length": 435,
    "reblogged_by": []
  }, {
    "id": 309615,
    "author": "inertia",
    "permlink": "drphil-rb-voting-bot-for-golos",
    "category": "en",
    "parent_author": "",
    "parent_permlink": "en",
    "title": "drphil.rb - Voting Bot - For GOLOS",
    "body": "Dr. Phil (`drphil.rb`) is reimplementation of the \"Winfrey\" voting bot specification.  The goal is to give everyone an upvote.\n\nOne optional improvement is that instead of voting 1% by 100 accounts like the Winfrey bot spec, this script can vote 100% with 1 randomly chosen account.\n\nIf the complaint about Winfrey is blockchain bloat, Dr. Phil prescribes weight loss to address this. But this feature would only work if there are enough voters defined in the script.  If you plan to use this script for one or two accounts, you'll probably want to adjust the `VOTE_WEIGHT` constant to something a bit lower.\n\n---\n\nTo use this [Radiator](https://steemit.com/steem/@inertia/radiator-steem-ruby-api-client) bot:\n\n##### Linux\n\n```bash\n$ sudo apt-get install ruby-full git openssl libssl1.0.0 libssl-dev\n$ gem install bundler\n```\n\n##### macOS\n\n```bash\n$ gem install bundler\n```\n\nI've tested it on various versions of ruby.  The oldest one I got it to work was:\n\n`ruby 2.0.0p645 (2015-04-13 revision 50299) [x86_64-darwin14.4.0]`\n\nFirst, clone this gist and install the dependencies:\n\n```bash\n$ git clone https://gist.github.com/61bcc2b821aa5acb24f7fc88921950c7.git drphil\n$ cd drphil\n$ bundle install\n```\n\nHere's a sample `drphil.yml` config file to use instead of the default STEEM settings:\n\n```yml\nvoters:\n  - social 5JrvPrQeBBvCRdjv29iDvkwn3EQYZ9jqfAHzrCyUvfbEbRkrYFC\n  - bad.account 5XXXBadWifXXXdjv29iDvkwn3EQYZ9jqfAHzrCyUvfbEbRkrYFC\nskip_accounts: leeroy.jenkins the.masses danlarimer ned-reddit-login\nskip_tags: nsfw test ru--mat bm-open\nflag_signals: cheetah steemcleaners\nchain_options:\n  chain: golos\n  url: https://node.golos.ws\n```\n\nThen run it:\n\n```bash\n$ ruby drphil.rb\n```\n\nDr. Phil will now do it's thing.  Check here to see an updated version of this bot:\n\nhttps://gist.github.com/inertia186/61bcc2b821aa5acb24f7fc88921950c7\n\n<center>\n  ![](https://cl.ly/1j1Z262a2A3d/Image%202017-03-22%20at%2012.17.22%20PM.png)\n</center>\n\nSee my previous Ruby How To posts in: [#radiator](https://steemit.com/created/radiator) [#ruby](https://steemit.com/created/ruby)",
    "json_metadata": "{\"tags\":[\"en\",\"radiator\",\"ruby\",\"golos\",\"curation\"],\"image\":[\"https://cl.ly/1j1Z262a2A3d/Image%202017-03-22%20at%2012.17.22%20PM.png\"],\"links\":[\"https://steemit.com/steem/@inertia/radiator-steem-ruby-api-client\",\"https://gist.github.com/inertia186/61bcc2b821aa5acb24f7fc88921950c7\",\"https://steemit.com/created/radiator\",\"https://steemit.com/created/ruby\"],\"app\":\"steemit/0.1\",\"format\":\"markdown\"}",
    "last_update": "2017-03-23T05:49:30",
    "created": "2017-03-23T05:49:30",
    "active": "2017-03-23T21:48:03",
    "last_payout": "1970-01-01T00:00:00",
    "depth": 0,
    "children": 2,
    "children_rshares2": "6341870347683207185676536384",
    "net_rshares": "77660971295128",
    "abs_rshares": "77677622221271",
    "vote_rshares": "77656824762888",
    "children_abs_rshares": "77677622221271",
    "cashout_time": "2017-03-24T08:10:37",
    "max_cashout_time": "2017-04-06T05:49:30",
    "total_vote_weight": "17542934647910258128",
    "reward_weight": 10000,
    "total_payout_value": "0.000 GBG",
    "curator_payout_value": "0.000 GBG",
    "author_rewards": 0,
    "net_votes": 45,
    "root_comment": 309615,
    "mode": "first_payout",
    "max_accepted_payout": "1000000.000 GBG",
    "percent_steem_dollars": 0,
    "allow_replies": true,
    "allow_votes": true,
    "allow_curation_rewards": true,
    "url": "/en/@inertia/drphil-rb-voting-bot-for-golos",
    "root_title": "drphil.rb - Voting Bot - For GOLOS",
    "pending_payout_value": "156.536 GBG",
    "total_pending_payout_value": "156.536 GBG",
    "active_votes": [{
      "voter": "penambang",
      "weight": 0,
      "rshares": 3693036744,
      "percent": 10000,
      "reputation": 0,
      "time": "2017-03-23T14:05:36"
    }, {
      "voter": "berkah",
      "weight": 0,
      "rshares": "17104421639",
      "percent": 10000,
      "reputation": 0,
      "time": "2017-03-23T14:05:24"
    }, {
      "voter": "steem-id",
      "weight": "715184154440983",
      "rshares": "63906094531",
      "percent": 10000,
      "reputation": "10854623437",
      "time": "2017-03-23T14:05:30"
    }, {
      "...": "..."
    }],
    "replies": [],
    "author_reputation": "28928695948222",
    "promoted": "0.000 GBG",
    "body_length": 2067,
    "reblogged_by": []
  }]
}

```

`get_discussions_by_active`

*params: tag(string), limit(integer)*

`get_discussions_by_author_before_date`

*params: tag(string), start_permalink(string), before_date(integer), limit(integer)*

`get_discussions_by_cashout`

*params: tag(string), limit(integer)*

`get_discussions_by_children`

*params: tag(string), limit(integer)*

`get_discussions_by_created`

*params: tag(string), limit(integer)*

`get_discussions_by_feed`

*params: tag(string), limit(integer)*

`get_discussions_by_hot`

*params: tag(string), limit(integer)*

`get_discussions_by_payout`

*params: tag(string), limit(integer)*

`get_discussions_by_trending`

*params: tag(string), limit(integer)*

`get_discussions_by_votes`

*params: tag(string), limit(integer)*

# Categories

### Category Details


```javascript
Example responses

get_trending_tags("","2")
{
  "id": 5,
  "result": [{
    "name": "",
    "total_children_rshares2": "1076939242806702765717638121719",
    "total_payouts": "4100002.965 GBG",
    "net_votes": 713607,
    "top_posts": 86673,
    "comments": 119884
  }, {
    "name": "ru--golos",
    "total_children_rshares2": "447091768634961487811421297268",
    "total_payouts": "1489582.186 GBG",
    "net_votes": 132199,
    "top_posts": 3176,
    "comments": 17322
  }]
}

get_trending_categories("","2")
{
  "id": 7,
  "result": [{
    "id": 158,
    "name": "mapala",
    "abs_rshares": "1427980787178385",
    "total_payouts": "347736.822 GBG",
    "discussions": 10737,
    "last_update": "2017-03-24T05:54:27"
  }, {
    "id": 88,
    "name": "ru--obrazovanie",
    "abs_rshares": "1316057684542314",
    "total_payouts": "123946.849 GBG",
    "discussions": 3073,
    "last_update": "2017-03-24T04:59:00"
  }]
}

```

`get_trending_tags`

*params: tag(string), limit(integer)*

`get_trending_categories`

*params: tag(string), limit(integer)*

# Feed

### Feed Endpoints

```javascript
Example responses

get_feed_history()
{
  "id": 12,
  "result": {
    "id": 0,
    "current_median_history": {
      "base": "1.000 GBG",
      "quote": "2.566 GOLOS"
    },
    "price_history": [{
      "base": "1.000 GBG",
      "quote": "2.164 GOLOS"
    }, {
      "base": "1.000 GBG",
      "quote": "2.192 GOLOS"
    }, {
      "base": "0.443 GBG",
      "quote": "1.000 GOLOS"
    }, {
      "base": "1.000 GBG",
      "quote": "2.027 GOLOS"
    }, {
      "base": "0.519 GBG",
      "quote": "1.000 GOLOS"
    }, {
      "...": "...",
    }]
  }
}

```

`get_feed_history`

# Witness

### Witness Endpoints

```javascript
Example responses

get_active_witnesses()
{
  "id": 1,
  "result": ["hipster", "primus", "serejandmyself", "dark.sun", "lehard", "good-karma", "on0tole", "kuna", "phenom", "creator", "roelandp", "xanoxt", "anyx", "larsen", "dr2073", "arcange"]
}

get_witness_by_account("primus")
{
  "id": 3,
  "result": {
    "id": 88,
    "owner": "primus",
    "created": "2016-10-18T11:12:48",
    "url": "https://golos.io/ru--delegat/@primus/delegat-primus-deklaraciya-namerenii",
    "votes": "97776681764007281",
    "virtual_last_update": "2389709914703227364173651810",
    "virtual_position": "0",
    "virtual_scheduled_time": "2389713394902808510118262616",
    "total_missed": 19,
    "last_aslot": 4515658,
    "last_confirmed_block_num": 4508823,
    "pow_worker": 0,
    "signing_key": "GLS6m778dFs9fH2DLWEXYym7PuMa3DkhMyfkPjeRVL8ymBguunfoq",
    "props": {
      "account_creation_fee": "3.000 GOLOS",
      "maximum_block_size": 131072,
      "sbd_interest_rate": 1000
    },
    "sbd_exchange_rate": {
      "base": "1.000 GBG",
      "quote": "2.606 GOLOS"
    },
    "last_sbd_exchange_update": "2017-03-24T06:00:00",
    "last_work": "0000000000000000000000000000000000000000000000000000000000000000",
    "running_version": "0.16.3",
    "hardfork_version_vote": "0.16.0",
    "hardfork_time_vote": "2017-03-01T12:00:00"
  }
}

get_witness_count()
{
  "id": 5,
  "result": 1148
}

get_witness_schedule()
{
  "id": 6,
  "result": {
    "id": 0,
    "current_virtual_time": "2389709407642064290167735603",
    "next_shuffle_block_num": 4508805,
    "current_shuffled_witnesses": "63726561746f7200000000000000000068697073746572000000000000000000616c656b73616e6472617a0000000000616e79780000000000000000000000006f6e30746f6c650000000000000000007068656e6f6d00000000000000000000736572656a616e646d7973656c660000746573747a00000000000000000000007269706c6579000000000000000000007072696d757300000000000000000000726f656c616e6470000000000000000064723230373300000000000000000000736d6f6f74682e7769746e65737300006b756e610000000000000000000000006c6568617264000000000000000000006461726b2e73756e00000000000000006c697476696e74656368000000000000676f6f642d6b61726d61000000000000766974616c792d6c766f76000000000078746172000000000000000000000000617263616e6765000000000000000000",
    "num_scheduled_witnesses": 21,
    "top19_weight": 1,
    "timeshare_weight": 5,
    "miner_weight": 1,
    "witness_pay_normalization_factor": 25,
    "median_props": {
      "account_creation_fee": "3.000 GOLOS",
      "maximum_block_size": 65536,
      "sbd_interest_rate": 1000
    },
    "majority_version": "0.16.3"
  }
}

get_witnesses_by_vote("","1")
{
  "id": 11,
  "result": [{
    "id": 148,
    "owner": "on0tole",
    "created": "2016-10-18T11:47:18",
    "url": "https://golos.io/ru--golos/@on0tole/eksklyuzivnoe-intervyu-s-kandidatom-v-delegaty-on0tole",
    "votes": "135934484188197332",
    "virtual_last_update": "2389709493851543110550599607",
    "virtual_position": "245753748204741515590733142243414878863",
    "virtual_scheduled_time": "2389710189249912999715951402",
    "total_missed": 93,
    "last_aslot": 4515634,
    "last_confirmed_block_num": 4508799,
    "pow_worker": 0,
    "signing_key": "GLS5ye7eCanaVRfCXD9BJBh495J6Qu5VexAKTiuCep8tKQRhho892",
    "props": {
      "account_creation_fee": "3.000 GOLOS",
      "maximum_block_size": 65536,
      "sbd_interest_rate": 1000
    },
    "sbd_exchange_rate": {
      "base": "1.000 GBG",
      "quote": "2.617 GOLOS"
    },
    "last_sbd_exchange_update": "2017-03-24T06:00:00",
    "last_work": "0000000000000000000000000000000000000000000000000000000000000000",
    "running_version": "0.16.3",
    "hardfork_version_vote": "0.16.0",
    "hardfork_time_vote": "2017-03-01T12:00:00"
  }]
}

```

`get_active_witnesses`

`get_witness_by_account`

*params: account(string)*

`get_witness_count`

`get_witness_schedule`

`get_witnesses_by_vote`

# Lookup

### Lookup Endpoints

```javascript
Example responses

lookup_account_names("golos")
{
  "id": 6,
  "result": [{
    "id": 8469,
    "name": "golos",
    "owner": {
      "weight_threshold": 1,
      "account_auths": [],
      "key_auths": [
        ["GLS6Rk8stEjcRhweUxg4s6LYguT1Ms6tzKAiAfEonnJPwcPtHojPz", 1]
      ]
    },
    "active": {
      "weight_threshold": 1,
      "account_auths": [],
      "key_auths": [
        ["GLS8fdxXwFspKQrUyoEqPoAhWMb44wkJFoqp3TEZZAsLNWbgeYodk", 1]
      ]
    },
    "posting": {
      "weight_threshold": 1,
      "account_auths": [],
      "key_auths": [
        ["GLS6avidaRNGzSpqq8pX76Nqursz47doi68VPzEgDZo9b1ijm3EQV", 1]
      ]
    },
    "memo_key": "GLS738gqm2cEvRKMzi2i2qcvf4MyMXvCs8mL7vmDnVujqfFT5QJr8",
    "json_metadata": "",
    "proxy": "",
    "last_owner_update": "1970-01-01T00:00:00",
    "last_account_update": "1970-01-01T00:00:00",
    "created": "2016-10-18T11:16:00",
    "mined": false,
    "owner_challenged": false,
    "active_challenged": false,
    "last_owner_proved": "1970-01-01T00:00:00",
    "last_active_proved": "1970-01-01T00:00:00",
    "recovery_account": "cyberfounder",
    "last_account_recovery": "1970-01-01T00:00:00",
    "reset_account": "null",
    "comment_count": 0,
    "lifetime_vote_count": 0,
    "post_count": 45,
    "can_vote": true,
    "voting_power": 9950,
    "last_vote_time": "2017-03-22T18:38:42",
    "balance": "47500.036 GOLOS",
    "savings_balance": "0.000 GOLOS",
    "sbd_balance": "7351.037 GBG",
    "sbd_seconds": "0",
    "sbd_seconds_last_update": "2017-03-23T22:48:57",
    "sbd_last_interest_payment": "2017-03-23T22:48:57",
    "savings_sbd_balance": "0.000 GBG",
    "savings_sbd_seconds": "0",
    "savings_sbd_seconds_last_update": "1970-01-01T00:00:00",
    "savings_sbd_last_interest_payment": "1970-01-01T00:00:00",
    "savings_withdraw_requests": 0,
    "vesting_shares": "34339378002.167418 GESTS",
    "vesting_withdraw_rate": "0.000000 GESTS",
    "next_vesting_withdrawal": "1969-12-31T23:59:59",
    "withdrawn": 0,
    "to_withdraw": 0,
    "withdraw_routes": 0,
    "curation_rewards": 0,
    "posting_rewards": 96453953,
    "proxied_vsf_votes": [0, 0, 0, 0, 0, 0, 0, 0],
    "witnesses_voted_for": 0,
    "average_bandwidth": "6959424495",
    "lifetime_bandwidth": "3997897000000",
    "last_bandwidth_update": "2017-03-22T18:39:27",
    "average_market_bandwidth": 558000000,
    "last_market_bandwidth_update": "2017-02-21T18:44:09",
    "last_post": "2017-03-22T18:39:27",
    "last_root_post": "2017-03-22T18:38:42",
    "post_bandwidth": 17435,
    "new_average_bandwidth": "16401343948",
    "new_average_market_bandwidth": "5580000000"
  }]
}

lookup_accounts("","5")
{
  "id": 16,
  "result": ["a-0", "a-a", "a-a-simonov", "a-ahonov", "a-andronov"]
}

lookup_accounts("s","5")
{
  "id": 17,
  "result": ["s-312", "s-a-pobeda", "s-a-zhuzhgov", "s-andrey89", "s-avzalov"]
}

lookup_witness_accounts("","5")
{
  "id": 19,
  "result": ["a-0", "a00", "m31", "a-a", "brb"]
}

```

`lookup_account_names`

*params: lower_bound_name(string), limit(integer)*

`lookup_accounts`

*params: lower_bound_name(string), limit(integer)*

`lookup_witness_accounts`

*params: lower_bound_name(string), limit(integer)*
