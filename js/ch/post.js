// defi主链列表
const hosturl = "https://port.poolmy.icu";
function queryChain(_async,fnc,_that){
	let _url = hosturl + "/api/defi/queryChain";
	return post(_url, null,_async,fnc,_that);
}
//defi产品页信息 返回DefiChainInfoOutVo
function getDefiIndexList(_data,_async,fnc,_that){
	let _url = hosturl + "/api/defi/getDefiIndexList";
	let data = post(_url,_data,_async,fnc,_that);
	if(!_async){
		data = unzip(data.data);
	}
	return data;
}
// defi邀请页信息 返回DefiAddressInviterOutVo
function inviterInfo(_data,_async,fnc,_that){
	let _url = hosturl + "/api/defi/inviterInfo";
	return post(_url,_data,_async,fnc,_that);
}
// defi钱包连接成功调用 返回DefiAddressInfoOutVo
function login(_data,_async,fnc,_that){
	let _url = hosturl + "/api/defi/login";
	return post(_url,_data,_async,fnc,_that);
}
//defi挖矿参与列表 返回DefiMiningListOutVo
function miningList(_data,_async,fnc,_that){
	let _url = hosturl + "/api/defi/miningList";
	return post(_url,_data,_async,fnc,_that);
} 
//defi参与挖矿上报
function miningUp(_data,_async){
	let _url = hosturl + "/api/defi/miningUp";
	return post(_url,_data,_async);
}  
// defi提币申请
function withdrawApply(_data,_async){
	let _url = hosturl + "/api/defi/withdrawApply";
	return post(_url,_data,_async);
} 
// defi提币列表 返回DefiWithdrawRecordOutVo
function withdrawRecord(_data,_async,fnc,_that){
	let _url = hosturl + "/api/defi/withdrawRecord";
	return post(_url,_data,_async,fnc,_that);
} 
//分页查询defi挖矿每日收益列表 返回DefiDailyYieldDetailsOutVo
function yieldDayList(_data,_async,fnc,_that){
	let _url = hosturl + "/api/defi/yieldDayList";
	return post(_url,_data,_async,fnc,_that);
} 
// defi挖矿收益余额信息 返回DefiAddressDetailOutVo
function yieldlist(_data,_async,fnc,_that){
	let _url = hosturl + "/api/defi/yieldlist";
	return post(_url,_data,_async,fnc,_that);
}

// defi邀请奖励详情列表
function defiInviteRewardsList(_data,_async,fnc,_that){
	let _url = hosturl + "/api/defi/defiInviteRewardsList";
	return post(_url,_data,_async,fnc,_that);
}

// defi获取代理信息
function defiAgentInfo(_data,_async,fnc,_that){
	let _url = hosturl + "/api/defi/agentInfo";
	return post(_url,_data,_async,fnc,_that);
}

function getaAssetsByCoincap(coincap){
	 $.ajaxSettings.async = false;
	let _data = $.getJSON("https://api.coincap.io/v2/assets/" + coincap, function(data) {})
	$.ajaxSettings.async = true;
	return _data;
}

// function getaAssetsBySymbol(symbol){
// 	 let _url = "https://api.coincap.io/v2/assets?search=" + symbol
// 	 let r_data;
// 	 $.ajax({
// 	 	url: _url,
// 	 	type:"GET",
// 	 	async: false,
// 	 	success:function (data) {
// 	 		console.log(data);
// 			if(notNull(data)){
// 				let coincap = data.data[0].id;
// 				let url2 = "https://api.coincap.io/v2/assets/" + coincap;
// 				$.ajax({
// 					url: url2,
// 					type:"GET",
// 					async: false,
// 					success:function (data2) {
// 						console.log(data2);
// 						r_data = data2;
// 					},
// 					dataType : "json",
// 					error: function(err2){
// 						console.log(err2);
// 					}
// 				});
// 			}
// 	 	},
// 	 	dataType : "json",
// 	 	error: function(err){
// 	 		console.log(err);
// 	 	}
// 	 });
// 	 return r_data;
// }
/**
 * 【已修改】: 使用 api.coingecko.com 替代 api.coincap.io
 * * 通过币种符号（如 "ETH"）获取市场数据。
 * 注意：此函数保持了原始的同步调用 (async: false)，这会冻结浏览器，
 * 在实际生产中强烈不推荐，但为了兼容你现有的代码结构，此处予以保留。
 */
function getaAssetsBySymbol(symbol) {
	let r_data; // 最终返回的数据
	let coin_id; // CoinGecko 的币种 ID (例如 "ethereum")

	// --- 步骤 1: 使用 CoinGecko 的 search API 查找 coin_id ---
	// 对应原 CoinCap 的 /assets?search=...
	let search_url = "https://api.coingecko.com/api/v3/search?query=" + symbol;

	$.ajax({
		url: search_url,
		type: "GET",
		async: false, // 保持同步调用
		success: function(searchData) {
			console.log("CoinGecko Search Data:", searchData);
			if (searchData && searchData.coins && searchData.coins.length > 0) {
				
				// 优化：优先查找符号(symbol)完全匹配的
				let exactMatch = searchData.coins.find(coin => coin.symbol.toLowerCase() === symbol.toLowerCase());
				
				if (exactMatch) {
					coin_id = exactMatch.id;
				} else {
					// 如果没有完全匹配的，则退而求其次，使用第一个搜索结果
					coin_id = searchData.coins[0].id;
				}
				console.log("CoinGecko 匹配到的 ID:", coin_id);
			}
		},
		dataType: "json",
		error: function(err) {
			console.error("CoinGecko Search API 失败:", err);
		}
	});

	// 如果步骤 1 失败，无法获取 coin_id，则直接返回
	if (!coin_id) {
		console.error("CoinGecko 未能找到 " + symbol + " 的 ID");
		// 返回一个与原函数失败时类似的 undefined
		return undefined; 
	}

	// --- 步骤 2: 使用 coin_id 获取市场数据 ---
	// 对应原 CoinCap 的 /assets/ID
	let market_url = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=" + coin_id;

	$.ajax({
		url: market_url,
		type: "GET",
		async: false, // 保持同步调用
		success: function(marketData) {
			console.log("CoinGecko Market Data:", marketData);
			if (marketData && marketData.length > 0) {
				
				// 从 CoinGecko 获取 'current_price'
				let price = marketData[0].current_price; 

				// --- 步骤 3: 格式化返回数据 ---
				// 将 CoinGecko 的 price 封装成原 CoinCap 的数据结构
				// 你的调用代码期望: data.data.vwap24Hr
				// 我们将 price 赋值给 vwap24Hr
				r_data = {
					"data": {
						"vwap24Hr": price
					}
				};
				console.log("格式化后的 r_data:", r_data);
			}
		},
		dataType: "json",
		error: function(err) {
			console.error("CoinGecko Market API 失败:", err);
		}
	});

	// 返回格式化后的数据 (如果API调用失败，这里将返回 undefined)
	return r_data;
}
function post(_url,_data,_async,_fnc,_that){
	let r_data;
	if(isNull(_async) && _async!= false){
		_async = true
	}
	
	if(notNull(_data) 
		&& isNull(_data.inviterCode)
		&& notNull(getInviterCode())){
		_data.inviterCode = getInviterCode();
	}
	
	if(notNull(_data)
		&& isNull(_data.code)
		&& notNull(getAgentCode())){
		_data.code = getAgentCode();
	}
	
	$.ajax({
		url: _url,
		data:_data,
		type:"POST",
		async: _async,
		success:function (data) {
			r_data = data;
			if(typeof _fnc == 'function'){
				_fnc(_that,data);
			}
		},
		dataType : "json",
		error: function(err){
			console.log(err);
		}
	});
	return r_data;
}

// 设置链信息
var setChain = function(_that,_res){
	console.log(_res);
	_that.chainList = _res.data;
}
// 设置产品信息
var productList = function(_that,_res){
	let res = unzip(_res.data);
	_that.nftList = res["2"];
	_that.defilList = res["1"];
	let data = new Array();
	
	// nft先不考虑
	// for(let key in _that.nftList){
	// 	if(_that.nftList[key].productINfos.length > 0){
	// 		data = data.concat(_that.nftList[key].productINfos);
	// 	}
	// }
	for(let key in _that.defilList){
		if(_that.defilList[key].productINfos.length > 0){
			data = data.concat(_that.defilList[key].productINfos);
		}
	}
	productData = data;
	// 更新钱包余额信息
	queryWalletInfo(_that);
}

//获取推广信息
function asycnInviterInfo(_that,_res){
	_that.tgData.list = _res.data.list
	_that.tgData.referralNum = _res.data.referralNum
	_that.tgData.referralCode = _res.data.referralCode
	_that.tgData.inviterWsurl = _res.data.serviceUrl
}

// 用户信息填充
function getYield(_that,_res){
	_that.yield = _res.data;
}

// 获取每日挖矿列表
function asycnyieldDayList(_that,_res){
	console.log('yieldDay', _res.data);
	_that.yieldDay.list = _res.data.data;
	_that.yieldDay.count = Math.ceil(_res.data.total / 10)
	// 重新再加载一下活动列表
	_that.miningList()
}

// 获取每日邀请收益列表
function asycnInviteRewardsList(_that,_res){
	console.log('inviteRewards', _res.data);
	_that.inviteRewards.list = _res.data.data;
	_that.inviteRewards.count = Math.ceil(_res.data.total / 10)
}

//获取参加活动列表
function asycnMiningList(_that,_res){
	_that.mining = _res.data;
	// 没有添加过客服 
	let mining1 = _res.data.find((d)=>d.type ==2 && d.isLock == 1);
	if(notNull(mining1) ){
		_that.activity2Lock = 1;//客服活动还没有解锁
	}else{
		_that.activity2Lock = 0;//客服活动已经解锁
	}
	
	// nft持有情况
	// nftImgList
	for(var i =0;i<_res.data.length;i++){
		let d = _res.data[i]
		let protocol = d.protocol
		if(protocol == "erc721"){
			let n = d.nftList
			for(var j=0;j<n.length;j++){
				let f = n[j]
				let imgs = [];
				imgs[0] = f.coinImg
				let key = d.productId + "-" + f.tokenId
				_that.nftImgList[key] = imgs;
			}
		}
	}
}

//获取提现记录
function asycnwithdrawRecord(_that,_res){
	_that.withdrawRecord = _res.data;
}
// 代理信息
function asyDefiAgentInfo(_that,_res){
	if(notNull(_res.data)){
		_that.agentInfo = _res.data;
	}
}


function asyLogin(_that,_res){
	if(notNull(_res.data)){
		_that.defiTips = _res.data.defiTips;
		_that.virtualVoMap = _res.data.virtualVoMap;
	}
}
