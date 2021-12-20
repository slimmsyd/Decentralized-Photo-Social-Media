import React, { Component, useState, useEffect} from "react";
import 'bootstrap/dist/css/bootstrap.min.css';

import Web3 from 'web3';
import { Navbar } from "./Navbar";
import Main from './Main';
import { Home } from "./Home";
import Button from './Button'
//Import the Contract ABI
import WeDream from './contracts/weDream.json'
import { create } from 'ipfs-http-client'

import "./App.css";


const client = create('https://ipfs.infura.io:5001/api/v0');


const App =  () => {
//Declare IPFS
  

  const [isConnected, setIsConnected] = useState(false)
  const [provider, setProvider] = useState(window.ethereum)
  const [currentAccount, setCurrentAccount] = useState(null)
  const [chainId, setChainId] = useState(null)
  const [web3, setWeb3] = useState(null)
  const [balance, setBalance] = useState(null)
  const [contract, setContract] = useState(null)
  const [images, setImages] = useState([])
  const [buffer, setBuffer] = useState(null)
  const [urlArr, setUrlArr] = useState([])
  

const onLogin = async (provider) =>  {
  const web3 = new Web3(provider);
  const accounts = await web3.eth.getAccounts();
  const chainId = await web3.eth.getChainId();
  const balance = await web3.eth.getBalance(accounts[0])

  //Getting Contract Data
  const networkId = await web3.eth.net.getId()
  const networkData = WeDream.networks[networkId]
  const contract = new web3.eth.Contract(WeDream.abi, networkData.address)
  if(networkData) { 
    setContract(contract)
    //Get Image Count 
    const imageCount = await contract.methods.imagecount().call()
    setImages(imageCount)

    //Load Images 
    for(var i = 1; i <= imageCount; i++) { 
      const image = await contract.methods.images(i).call()
      setImages(images => [...images, image])
    }


  }else { 
    window.alert("Contract has not been deployed to detected network")
  }

  //Detects If No Accounts
  if(accounts.length === 0  )  { 
    console.log("Please Connect To Metamask")

  }else if (accounts[0] !== currentAccount) { 
    setProvider(provider)
    setWeb3(web3)
    setChainId(chainId)
    setCurrentAccount(accounts[0]);
    setBalance(balance)
    setIsConnected(true)
  
  }

  // function onLogout() {
  //   setIsConnected(false)
  // }

}

useEffect(() => { 

  //Handles Change Of Account
  const handleAccountsChanged = async (accounts) => { 
    const web3Accounts = await Web3.eth.getAccounts();
    if(accounts.length === 0) {
      console.log("Please Connect to MetamMask!")
    }else if (accounts[0] !== currentAccount) { 
      setCurrentAccount(accounts[0])
      setIsConnected(true)
    }

  };
  //Handles Change of Network
  const handleChainChanged = async (chainId) => {
    const web3ChainId = await web3.eth.getChainId(); 
    setChainId(web3ChainId)
  }


  if (isConnected) {
    provider.on("accountChanged", handleAccountsChanged);
    provider.on('chainChanged',handleChainChanged)
  }
  return () => { 
    if (isConnected) {
    provider.removeListener("accountChanged", handleAccountsChanged);
    provider.removeListener('chainChanged',handleChainChanged)
  }
  }
}, [isConnected])


const captureFile = (event) => { 


  const file = event.target.files[0]
  const reader = new window.FileReader()
  reader.readAsArrayBuffer(file)

  reader.onloadend = () => { 
    setBuffer(Buffer(reader.result))
    console.log('buffer', buffer)
  }
  event.preventDefault()

}

const uploadImage = async (description) => { 
  console.log("Submitting to ipfs...")

  //adding file to the IPFS
  try {
  const created = await client.add(buffer)
  const url = `https://ipfs.infura.io/ipfs/${created.path}`
  setUrlArr(prev => [...prev, url])


  contract.methods.uploadImage(created.path, description).send({from: currentAccount}).on('transactionHash', (hash) => { 
  })
  console.log(images)

}catch(error) {
  console.log(error)
}
}


const tipImageOwner = async (id, tipAmount) => { 
  contract.methods.tipImageOwner(id).send({from:currentAccount, value: tipAmount}).on("transactionHash" , (hash) => {
  }) 


}



    
    return (
      <div className="App">
      { !isConnected && <Button onLogin = {onLogin}  />}
      {isConnected && (<Navbar  currentAccount = {currentAccount} balance = {balance} chainId = {chainId}
      />)
      }
      {isConnected && <Main 
      images = {images}
      captureFile = {captureFile} 
      uploadImage = {uploadImage}
      tipImageOwner = {tipImageOwner}
      
      />}
    
      </div>

    );
    }
export default App;
