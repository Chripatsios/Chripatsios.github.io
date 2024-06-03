document.addEventListener('DOMContentLoaded', () => {
    const dealerCardsElement = document.getElementById('dealer-cards');
    const playerCardsElement = document.getElementById('player-cards');
    const dealerHandValueElement = document.getElementById('dealer-hand-value');
    const playerHandValueElement = document.getElementById('player-hand-value');
    const messageElement = document.getElementById('message');
    const hitButton = document.getElementById('hit-button');
    const standButton = document.getElementById('stand-button');
    const newGameButton = document.getElementById('new-game-button');
    const betButton = document.getElementById('betbutton');

    let deck = [];
    let playerHand = [];
    let dealerHand = [];

    

    function createDeck() {
        const suits = ['H', 'D', 'C', 'S'];
        const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
        deck = [];

        for (let suit of suits) {
            for (let value of values) {
                deck.push({ value, suit });
            }
        }
    }

    function shuffleDeck() {
        for (let i = deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [deck[i], deck[j]] = [deck[j], deck[i]];
        }
    }

    function getCardValue(card) {
        if (['J', 'Q', 'K'].includes(card.value)) {
            return 10;
        } else if (card.value === 'A') {
            return 11; // asos metraei san 11
        } else {
            return parseInt(card.value);
        }
    }

    function calculateHandValue(hand) {
        let value = 0;
        let aces = 0;

        for (let card of hand) {
            value += getCardValue(card);
            if (card.value === 'A') {
                aces++;
            }
        }

        // diorthosi asou gia panw apo 21
        while (value > 21 && aces > 0) {
            value -= 10;
            aces--;
        }

        return value;
    }

    function dealInitialHands() {
        playerHand = [deck.pop(), deck.pop()];
        dealerHand = [deck.pop()];
    }

    function renderHand(hand, element) {
        element.innerHTML = '';
        hand.forEach(card => {
            const cardElement = document.createElement('img');
            cardElement.className = 'card';
            cardElement.src = `cards/${card.value}-${card.suit}.png`;
            element.appendChild(cardElement);
        });
    }

    function renderHands() {
        renderHand(playerHand, playerCardsElement);
        renderHand(dealerHand, dealerCardsElement);
        playerHandValueElement.innerText = `Value: ${calculateHandValue(playerHand)}`;
        dealerHandValueElement.innerText = `Value: ${calculateHandValue(dealerHand)}`;
    }

    function isBust(hand) {
        return calculateHandValue(hand) > 21;
    }

    function endGame(message) {
        hitButton.disabled = true;
        standButton.disabled = true;
        messageElement.innerText = message;
    }

    function dealerTurn() {
        while (calculateHandValue(dealerHand) < 17) {
            dealerHand.push(deck.pop());
        }

        renderHands();

        const playerScore = calculateHandValue(playerHand);
        const dealerScore = calculateHandValue(dealerHand);

        if (isBust(dealerHand)) {
            endGame('Dealer busts! Player wins.');
        } else if (dealerScore > playerScore) {
            endGame('Dealer wins.');
        } else if (dealerScore < playerScore) {
            endGame('Player wins!');
        } else {
            endGame('It\'s a tie!');
        }
    }

    hitButton.addEventListener('click', () => {
        playerHand.push(deck.pop());
        renderHands();
        if (isBust(playerHand)) {
            endGame('Player busts! Dealer wins.');
        }
    });

    standButton.addEventListener('click', dealerTurn);

    newGameButton.addEventListener('click', () => {
        createDeck();
        shuffleDeck();
        dealInitialHands();
        renderHands();
        messageElement.innerText = '';
        hitButton.disabled = false;
        standButton.disabled = false;
    });

    newGameButton.click();
});
