import { useEffect, useMemo, useRef, useState } from 'react'
import styles from './styles.module.css'
import * as ethereum from '@/lib/ethereum'
import * as main from '@/lib/main'
import { BigNumber, Contract, ethers } from 'ethers';



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

export const useWallet = () => {
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


const Admin = () => {
    const wallet = useWallet()
    const [collectionName, setCollectionName] = useState('')
    const [collectionSize, setCollectionSize] = useState<BigNumber>(BigNumber.from(0))
    const [collection, setCollection] = useState([])
    const [collections, setCollections] = useState([])
    const [adressOwner, setAddressOwner] = useState('')
    const [from, setFrom] = useState('')
    const [to, setTo] = useState('')
    const [cards, setCards] = useState([])
    const [address, setAddress] = useState('')
    const [addressInCollec, setAddressInCollec] = useState('')


    const createCollection = async () => {
        if (!wallet || !wallet.contract) {
            console.warn('Wallet or contract is not connected');
            return;
        }

        try {
            const tx = await wallet.contract.createCollection(collectionName, collectionSize);
            await tx.wait();
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
            setCollection(await wallet.contract.functions.getCollectionList(collectionName));
        } catch (error) {
            console.error('Error creating collection:', error);
        }
    }

    const getCollections = async () => {
        if (!wallet || !wallet.contract) {
            console.warn('Wallet or contract is not connected');
            return;
        }
        try {
            setCollections(await wallet.contract.functions.getCollections());
        } catch (error) {
            console.error('Error creating collection:', error);
        }
    }


    const giveCards = async () => {
        if (!wallet || !wallet.contract) {
            console.warn('Wallet or contract is not connected');
            return;
        }
        try {
            const result = await wallet.contract.functions.giveCardsto(collectionName, adressOwner, from, to);
            await result.wait();

        } catch (error) {
            console.error('Error retrieving card:', error);
        }
    }

    const getMyCardsinCollec = async () => {
        if (!wallet || !wallet.contract) {
            console.warn('Wallet or contract is not connected');
            return;
        }
        try {
            setCards(await wallet.contract.functions.getMyCardsinCollec(collectionName));
        } catch (error) {
            console.error('Error retrieving card:', error);
        }
    }


    const getMyAddress = async () => {
        if (!wallet || !wallet.contract) {
            console.warn('Wallet or contract is not connected');
            return;
        }
        try {
            setAddress(await wallet.contract.functions.getMyAddress());
        } catch (error) {
            console.error('Error retrieving card:', error);
        }
    }

    const getMyAddressinColl = async () => {
        if (!wallet || !wallet.contract) {
            console.warn('Wallet or contract is not connected');
            return;
        }
        try {
            setAddressInCollec(await wallet.contract.functions.getMyAddressinColl(collectionName));
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
                        <input
                            type="number"
                            placeholder="Collection Size"
                            value={collectionSize.toString()}
                            onChange={(e) => setCollectionSize(BigNumber.from(e.target.value))} />
                        <button onClick={createCollection}>Create Collection</button>
                    </div>

                        <div>
                            <h2>GetCollection = {collection.toString()}</h2>
                            <input
                                type="text"
                                placeholder="Collection Name"
                                value={collectionName}
                                onChange={(e) => setCollectionName(e.target.value)} />
                            {<button onClick={getCollection}>Get Collection</button>}
                        </div>

                        <div>
                            <h2>Get Collections= {collections.toString()}</h2>
                            {<button onClick={getCollections}>Getcollections</button>}
                        </div>

                        <div>
                            <h2>giveCardto </h2>
                            <input
                                type="string"
                                placeholder="address"
                                value={adressOwner}
                                onChange={(e) => setAddressOwner(e.target.value)} />
                            <input
                                type="string"
                                placeholder="from"
                                value={from}
                                onChange={(e) => setFrom(e.target.value)} />
                            <input
                                type="string"
                                placeholder="to"
                                value={to}
                                onChange={(e) => setTo(e.target.value)} />
                            {<button onClick={giveCards}>Give Cards</button>}
                        </div>

                        <div>
                            <h2>Get My cards = {cards.toString()}</h2>
                            <input
                                type="text"
                                placeholder="Collection Name"
                                value={collectionName}
                                onChange={(e) => setCollectionName(e.target.value)} />
                            {<button onClick={getMyCardsinCollec}>Get my card collection</button>}
                        </div>
                        <div>
                            <h2>Get My address= {address}</h2>
                            {<button onClick={getMyAddress}>Get my card collection</button>}
                        </div>
                        <div>
                            <h2>Get My address in collec = {addressInCollec}</h2>
                            <input
                                type="text"
                                placeholder="Collection Name"
                                value={collectionName}
                                onChange={(e) => setCollectionName(e.target.value)} />
                            {<button onClick={getMyAddressinColl}>Get my card collection</button>}
                        </div>
                    </>

                ) : (
                    <p>Connecting to wallet...</p>
                )}
            </div>

        </div>
    )

}

export default Admin;
