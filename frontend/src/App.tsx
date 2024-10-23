import { useEffect, useMemo, useRef, useState } from 'react'
import styles from './styles.module.css'
import * as ethereum from '@/lib/ethereum'
import * as main from '@/lib/main'
import { PokemonTCG } from "pokemon-tcg-sdk-typescript";
import { BigNumber, Contract, ethers } from 'ethers';


//const MAIN_ADDRESS = '0x5fbdb2315678afecb367f032d93f642f64180aa3';


type Canceler = () => void
const useAffect = (
  asyncEffect: () => Promise<Canceler | void>,
  dependencies: any[] = []
) => {
  const cancelerRef = useRef<Canceler | void>()
  useEffect(() => {
    asyncEffect()
      .then(canceler => (cancelerRef.current = canceler))
      .catch(error => console.warn('Uncatched error', error))
    return () => {
      if (cancelerRef.current) {
        cancelerRef.current()
        cancelerRef.current = undefined
      }
    }
  }, dependencies)
}

const useWallet = () => {
  const [details, setDetails] = useState<ethereum.Details>()
  const [contract, setContract] = useState<main.Main>()
  useAffect(async () => {
    const details_ = await ethereum.connect('metamask')
    if (!details_) return
    setDetails(details_)
    const contract_ = await main.init(details_)
    if (!contract_) return
    setContract(contract_)
  }, [])
  return useMemo(() => {
    if (!details || !contract) return
    return { details, contract }
  }, [details, contract])
}
export const App = () => {
  const wallet = useWallet()
  const [collectionName, setCollectionName] = useState('') // State for collection name
  const [collectionNum, setCollectionNum] = useState('') // State for card count
  const [collection, setCollection] = useState('')
  const [cardNum, setCardNum] = useState<BigNumber>(BigNumber.from(0))
  const [card, setCard] = useState('')
  const [cardURI, setCardURI] = useState('')


  // Function to handle creating the collection
  const createCollection = async () => {
    if (!wallet || !wallet.contract) {
      console.warn('Wallet or contract is not connected');
      return;
    }

    try {
      // Call the createCollection function on the Main contract
      const tx = await wallet.contract.createCollection(collectionName);
      await tx.wait();  // Wait for transaction to be mined
      console.log(collection);

      alert('Collection created successfully!');
    } catch (error) {
      console.error('Error creating collection:', error);
    }
  }

  const getCollection = async () => {
    if (!wallet || !wallet.contract) {
      console.warn('Wallet or contract is not connected');
      return;
    }
    try {
      setCollection(await wallet.contract.functions.getCollection(collectionNum));
    } catch (error) {
      console.error('Error creating collection:', error);
    }
  }

  const getCard = async () => {
    if (!wallet || !wallet.contract) {
      console.warn('Wallet or contract is not connected');
      return;
    }
    try {
      setCard(await wallet.contract.functions.getCard(collectionNum, cardNum));
      
    } catch (error) {
      console.error('Error retrieving card:', error);
    }
  }


  const putCardInCollec = async () => {
    if (!wallet || !wallet.contract) {
      console.warn('Wallet or contract is not connected');
      return;
    }
    try {
      const result = await wallet.contract.functions.setCard(collectionNum, cardURI);
      await result.wait();
    } catch (error) {
      console.error('Error retrieving card:', error);
    }
  }

  return (
    <div className={styles.body}>
        <h1>Welcome to Pokémon TCG</h1>

        <div>
          {wallet ? (
            <><div>
              <h2>Create a New Collection</h2>
              <input
                type="text"
                placeholder="Collection Name"
                value={collectionName}
                onChange={(e) => setCollectionName(e.target.value)} />
              <button onClick={createCollection}>Create Collection</button>
            </div>

              <div>
                <h2>GetCollection = {collection}</h2>
                <input
                  type="number"
                  placeholder="Collection Name"
                  value={collectionNum}
                  onChange={(e) => setCollectionNum(e.target.value)} />
                {<button onClick={getCollection}>Get Collection</button>}
              </div>

              <div>
                <h2>GetCard = {card}</h2>
                <input
                  type="number"
                  placeholder="CardID"
                  value={cardNum.toString()}
                  onChange={(e) => setCardNum(BigNumber.from(e.target.value))} />
                {<button onClick={getCard}>Get Card</button>}
              </div>

              <div>
                <h2>SetCard = {card}</h2>
                <input
                  type="string"
                  placeholder="URI"
                  value={cardURI}
                  onChange={(e) => setCardURI(e.target.value)} />
                {<button onClick={putCardInCollec}>Set Card</button>}
              </div>
            </>

          ) : (
            <p>Connecting to wallet...</p>
          )}
        </div>

      </div>
  )
}