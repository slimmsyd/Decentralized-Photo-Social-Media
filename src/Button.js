import React, { Component, useState, useEffect } from "react";
import getWeb3 from "./getWeb3";

import "./App.css";
import Web3 from "web3";

const Button = (props) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [provider, setProvider] = useState(window.ethereum);
  const [isMetaMaskInstalled, setIsMetamMaskInstalled] = useState(false);

  useEffect(() => {
    setProvider(detectedProvider());
    
  }, [])

  useEffect(() => {
    if (provider) { 
      if (provider !== window.ethereum) { 
        console.error(
          "Not window.ethereum provider. Do you have multiple wallets installed?"
        )
      }
      setIsMetamMaskInstalled(true)
  }
 },[provider])



  const detectedProvider = () => { 
    let provider;
    if (window.ethereum) { 
      provider = window.ethereum
    } else if (window.web3) { 
      provider = window.web3.currentProvider
    }else { 
      window.alert("No Eth Browser Detected")
    }
    return provider
  }
  
  const onLoginhandler = async () => { 
    const provider = detectedProvider();
    if (provider) { 
      if (provider !== window.ethereum) { 
        console.error(
          "Not window.ethereum provider. Do you have multiple wallets installed?"
        )
      }
      setIsConnecting(true);
      await provider.request({
        method:'eth_requestAccounts'
      });
      setIsConnecting(false);
      props.onLogin(provider)
    }
  };


  

     
    return (
        
    <div>
      <button className ="btn"
      onClick={onLoginhandler}>
       {!isConnecting && "Connect"}
       {isConnecting && " Loading..."}
        </button>
    </div>
    );
    }
export default Button;
