# Binance Deskapp Server

## <span id="margin"> Save Account Information </span>

#### URL
 
> [http://3.16.148.142:8080/save_accountInfo](http://3.16.148.142:8080/save_accountInfo)

#### HTTP Request Method
 
> post

#### Content-Type

> application/json

#### Parameters

|Name|Type|Mandatory|Description|
|:---:|:---:|:---:|:---:|
|email|STRING|YES|user@example.net |
|plan|STRING|YES|default values: "trial", "planA", "planB", "planC", "planD", "planE", "planF", "planG"|

#### Parameter example

```js

{
  "email": "user@example.net",
  "plan": "trial"
}

```

#### Response example

```js

{
    "license": "YX85F-45UU5-S2DWF-22657-7B86C-A2620",
    "end_at": "2021-04-06 10:12:47",
    "planMax": 250
}

```