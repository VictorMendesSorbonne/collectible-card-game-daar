import React, { useEffect, useState, useRef } from 'react';
import styles from './CardList.module.css';
import { useWallet } from './Admin';

export type Card = {
  id: string;
  name: string;
  imageUrl: string;
  imageUrlSmall: string;
  type: string;
  rarity: string;
  set: string;
};


function CardList() {
  const wallet = useWallet();
  const [cards, setCards] = useState<Card[]>([]);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!wallet || !wallet.contract) {
        console.warn('Wallet or contract is not connected');
        return;
      }
      try {
        const collections = (await wallet.contract.functions.getCollections())[0];

        let cardsIDs: string[] = []
        for (const c of collections) {
          const ids = (await wallet.contract.functions.getMyCardsinCollec(c))[0];
          cardsIDs = cardsIDs.concat(ids.filter((id: string) => { return id != "" }));
        }
        
        let query = "";
        for (let i = 0; i < cardsIDs.length; i++) {
          const id = cardsIDs[i];
          query += `id:${id}`;
          if (i < cardsIDs.length - 1) {
            query += "%20OR%20";
          }
        }

        const response = await fetch(`https://api.pokemontcg.io/v2/cards?q=${query}&select=id,name,images,set,types,rarity`);
        const data = await response.json();

        const duplicatedCards = [];
        for (const id of cardsIDs) {
          const card = data.data.find((card) => card.id === id);
          if (card) {
            duplicatedCards.push({
              id: card.id,
              name: card.name,
              imageUrl: card.images.large,
              imageUrlSmall: card.images.small,
              type: card.types ? card.types[0] : 'Unknown',
              rarity: card.rarity || 'Unknown',
              set: card.set.name || 'Unknown',
            })
          }
        }
        console.log(duplicatedCards)
        setCards(duplicatedCards)


      } catch (error) {
        console.error('Error retrieving card:', error);
      }
    };

    fetchData();
  }, [wallet]);

  const openCardDialog = (card: Card) => {
    setSelectedCard(card);
    if (dialogRef.current) {
      dialogRef.current.showModal();
    }
  };

  const closeCardDialog = () => {
    if (dialogRef.current) {
      dialogRef.current.close();
    }
  };

  return (
    <div>
      <h1>My Card List</h1>
      <div className={styles.grid}>
        {cards.map((card) => (
          <div key={card.id} className={styles.card} onClick={() => openCardDialog(card)}>
            <img src={card.imageUrlSmall} alt={card.name} className={styles.cardImage} />
            <h3>{card.name}</h3>
            <p>Type: {card.type}</p>
          </div>
        ))}
      </div>
      
      <dialog ref={dialogRef} className={styles.dialog}>
        {selectedCard && (
          <div className={styles.dialogContent}>
            <button className={styles.closeButton} onClick={closeCardDialog}>&times;</button>
            <img src={selectedCard.imageUrl} alt={selectedCard.name} className={styles.dialogImage} />
            <h2>{selectedCard.name}</h2>
            <p><strong>Type:</strong> {selectedCard.type}</p>
            <p><strong>Rarity:</strong> {selectedCard.rarity}</p>
            <p><strong>Set:</strong> {selectedCard.set}</p>
          </div>
        )}
      </dialog>
    </div>
  );
};

export default CardList;
