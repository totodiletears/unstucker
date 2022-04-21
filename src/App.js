import { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import './App.css'
import contract from './contracts/Marketplace.json'

const contractAddress = "0xae00e2F72008fca61Aa4Aa99bd3Ce07552FCbb87"
const abi = contract.abi

function App() {

  const [currentAccount, setCurrentAccount] = useState(null)
  const [nftContract, setNftContract] = useState("")
  const [tokenId, setTokenId] = useState(0)

  const checkWalletIsConnected = async () => {
    const {ethereum} = window

    if (!ethereum) {
      console.log("Please install Metamask")
      return
    } else {
      console.log("Wallet exists, ready to go")
    }

    const accounts = await ethereum.request({ method: 'eth_accounts' })

    if (accounts.length !== 0) {
      const account = accounts[0]
      console.log("Found an authorized account: ", account)
      setCurrentAccount(account)
    } else {
      console.log("No account found")
    }
  }

  const connectWalletHandler = async () => {
    const {ethereum} = window

    if (!ethereum) {
      alert("Please install Metamask")
    }

    try {
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' })
      console.log("Found an account. Address: ", accounts[0])
      setCurrentAccount(accounts[0])
    } catch (err) {
      console.log(err)
    }
  }

  const unstuckNftHandler = async () => {
    try {
      const { ethereum } = window

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum)
        const signer = provider.getSigner()
        const marketplaceContract = new ethers.Contract(contractAddress, abi, signer)

        console.log("Unlisting NFT")
        let unlistTxn = await marketplaceContract.cancelNFTSale(nftContract, tokenId)

        console.log("Confirming....")
        await unlistTxn.wait()

        console.log(`Tx Hash: https://explorer.harmony.one/tx/${unlistTxn.hash}`)
      } else {
        console.log("Ethereum object does not exist")
      }
    } catch (err) {
      console.log(err)
    }
  }

  const connectWalletButton = () => {
    return (
      <button onClick={connectWalletHandler} className='cta-button connect-wallet-button'>
        Connect Wallet
      </button>
    )
  }

  const unstuckNftButton = () => {
    return (
      <button onClick={unstuckNftHandler} className='cta-button mint-nft-button'>
        Unstuck NFT
      </button>
    )
  }

  const nftContractInput = () => {
    return (
      <>
        <h3>NFT Contract Address</h3>
        <input name="nftContractAddress" onChange={e => setNftContract(e.target.value)} />
      </>
    )
  }

  const tokenIdInput = () => {
    return (
      <>
        <h3>NFT Token ID</h3>
        <input name="tokenId" onChange={e => setTokenId(e.target.value)} />
      </>
    )
  }

  useEffect(() => {
    checkWalletIsConnected()
  }, [])

  return (
    <div className='main-app'>
      <h1>Unstuck It</h1>
      <br />
        <div>
          {currentAccount ? nftContractInput() : null}
          {currentAccount ? tokenIdInput() : null}
        </div>
      <br />
      <div>
        {/* {currentAccount ? <h4>Connected with: 0x...{currentAccount.slice(currentAccount.length - 4, currentAccount.length)}</h4> : null} */}
      </div>
      <br />
      <div>
        {currentAccount ? unstuckNftButton() : connectWalletButton()}
      </div>
    </div>
  )
}

export default App