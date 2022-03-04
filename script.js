//TODO : Améliorer l'aspect graphique des messages d'alert
//TODO : Gérer les menus (Partie-> nouvelle partie, sauvegarder, charger)
//TODO : Gérer une IA pour l'ordinateur
//TODO : Gérer le responsive sur petit écran
//TODO : Ajouter une ambiance sonore ? "Hang Drum Music for Focus with Binaural Beats, Focus Music, Handpan Study Music"


const MAX_NUMBER_OF_DICES = 5;
let START_PLAYERS = [['Cecile', 6], ['Kevin', 1]] //, ['Zora', 3]];

const MINUS_BID_COUNT_BTN = document.getElementById('minusBidCount');
const PLUS_BID_COUNT_BTN = document.getElementById('plusBidCount');
const MINUS_BID_DICE_BTN = document.getElementById('minusBidDice');
const PLUS_BID_DICE_BTN = document.getElementById('plusBidDice');
const BID_BTN = document.getElementById('bidBtn');
const DUDO_BTN = document.getElementById('dudoBtn');
const SHOW_BTN = document.getElementById('showBtn');

const USER_BID_COUNT_ELEM = document.querySelector('#userBidCount > p');
const USER_BID_DICE_ELEM = document.querySelector("#userBidDice > img");
const USER_DICES_ELEM = document.getElementById("userDices");
const USER_PANNEL = document.querySelector('#userPannel');
const PALIFICO_SIGN = document.querySelector('#palificoSign');

const MAIN_SECTION_PANNEL = document.getElementById('sectionPannel');

let currentPlayer = 1;
let isPalifico = false;
let isGameInProgress = false;



let PLAYER_BID_COUNT_ELEMS = [];
let PLAYER_BID_DICE_ELEMS = [];
let PLAYER_DICES_ELEMS = [];
let PLAYER_IMAGE_ELEMS = [];
let PLAYER_NAME_ELEMS = [];
let PLAYER_PANNELS = [];

let players = [];
let eliminatedPlayers = [];
let user;

let totalPlayersDices = 0;



class Player {
    constructor(name, imageIndex, dicesElem, bidCountElem, bidDiceElem, nameElem, imageElem, pannelElem) {
        this.dices = [0, 0, 0, 0, 0];
        this.bidCount = undefined;
        this.bidDice = undefined;
        this.name = name;
        this.imageIndex = imageIndex;
        this.dicesElem = dicesElem;
        this.bidCountElem = bidCountElem;
        this.bidDiceElem = bidDiceElem;
        this.nameElem = nameElem;
        this.imageElem = imageElem;
        this.pannelElem = pannelElem;
        this.isHighLighted = false;
        this.isEliminated = false;
    }
    
    updatePlayerElem() {
        this.updatePlayerDicesElem();
        this.updatePlayerBidCountElem();
        this.updatePlayerBidDiceElem();
        this.updatePlayerName();
        this.updatePlayerImage();
        this.updatePlayerHighLight();
        this.updatePlayerEliminated();
    }

    updatePlayerName() {
        if(this.name === undefined) return;
        this.nameElem.innerHTML = this.name;
    }

    updatePlayerImage() {
        if(isNaN(this.imageIndex)) return;
        this.imageElem.src = 'Sources/Images/PlayerImage' + this.imageIndex + '.png';
    }
    
    showPlayerDiceElem(elem, diceValue) {
        if(diceValue >= 1 && diceValue <= 6) elem.src='Sources/Images/DiceFace' + diceValue + '.png';
        else elem.src='Sources/Images/DiceFaceEmpty.png';
        elem.style.opacity = 1;
    }
    
    hidePlayerDiceElem(elem) {
        elem.src='Sources/Images/DiceFaceEmpty.png';
        elem.style.opacity = 1;
    }
    
    discardPlayerDiceElem() {
        for(let i = MAX_NUMBER_OF_DICES; i > this.dices.length; i--) {
            this.dicesElem.children[i-1].children[0].src='Sources/Images/DiceFaceEmpty.png';
            this.dicesElem.children[i-1].children[0].style.opacity = 0.4;
        }
    }

    showPlayerDicesElem() {
        for(let nDice in this.dices){
            this.showPlayerDiceElem(this.dicesElem.children[nDice].children[0], this.dices[nDice]);
        }
    }
    
    updatePlayerDicesElem() {
        for(let i = 0; i < MAX_NUMBER_OF_DICES; i++){
            this.hidePlayerDiceElem(this.dicesElem.children[i].children[0]);
        }
        this.discardPlayerDiceElem();
    }

    updatePlayerBidCountElem() {
        if(isNaN(this.bidCount)) {
            this.bidCountElem.innerHTML = '';
            return;
        }
        if(this.bidCount > 0 && this.bidCount <= totalPlayersDices) this.bidCountElem.innerHTML = this.bidCount + '';
    }

    updatePlayerBidDiceElem() {
        this.showPlayerDiceElem(this.bidDiceElem, this.bidDice);
    }

    randomizeDice() {
        return Math.floor(Math.random() * 6 + 1);
    }

    randomizeDices() {
        for(let nDice in this.dices){
            this.dices[nDice] = this.randomizeDice();
        }
    }

    updatePlayerHighLight() {
        if(this.pannelElem === undefined) return;
        if(this.imageElem === undefined) return;

        if(this.isHighLighted) {
            this.pannelElem.style.border = '2px solid var(--plusLightGreen)';
            this.imageElem.style.border = '2px solid var(--plusLightGreen)';
            this.pannelElem.style.filter = 'drop-shadow(0px 0px 6px var(--lightGreen))';
            this.imageElem.style.filter = 'drop-shadow(0px 0px 6px var(--lightGreen))';
        }else if(this.isHighLighted == false) {
            this.pannelElem.style.border = '2px solid var(--lightWhite)';
            this.imageElem.style.border = '2px solid var(--lightWhite)';
            this.pannelElem.style.filter = 'drop-shadow(0px 0px 0px rgb(0,0,0,0))';
            this.imageElem.style.filter = 'drop-shadow(0px 0px 0px rgb(0,0,0,0))';
        }
    }

    updatePlayerEliminated() {
        if(this.pannelElem === undefined) return;
        if(this.isEliminated) this.pannelElem.style.display = 'none';
    }

    checkBidValidityAgainst(player) {
        if(isNaN(this.bidCount) || isNaN(this.bidDice)) {
            alert("Enchère invalide : Votre enchère est incomplète !");
            return false;
        }
        if(this.bidCount > totalPlayersDices) {
            alert("Enchère invalide : Vous avez parié sur un nombre de dés plus élevé que le total présent sur la table !");
            return false;
        }
        if(isNaN(player.bidCount) || isNaN(player.bidDice)) return true;

        if(player.bidDice !== 1
            && this.bidDice !== 1
            && this.bidCount === player.bidCount
            && this.bidDice > player.bidDice
            && !isPalifico)
            return true;

        if(player.bidDice !== 1
            && this.bidDice !== 1
            && this.bidCount > player.bidCount
            && this.bidDice === player.bidDice)
            return true;

        if(player.bidDice !== 1
            && this.bidDice === 1
            && this.bidCount >= Math.ceil((player.bidCount) / 2)
            && !isPalifico)
            return true;

        if(player.bidDice === 1
            && this.bidDice !== 1
            && this.bidCount > player.bidCount * 2
            && !isPalifico)
            return true;

        if(player.bidDice === 1
            && this.bidDice === 1
            && this.bidCount > player.bidCount)
            return true;


        if(this.bidCount === player.bidCount
            && this.bidDice === player.bidDice)
            alert("Enchère invalide : L'enchère ne peut être la même que la précédente !");
        else if(isPalifico
            && this.bidDice !== player.bidDice)
            alert("Enchère invalide : En situtation de Palifico la valeur du dé doit être la même que celle de l'enchère précédente !");
        else if(player.bidDice !== 1
            && this.bidDice === 1
            && this.bidCount < Math.ceil((player.bidCount) / 2))
            alert("Enchère invalide : Le nombre de Paco doit être au moins égale à la moitié de l'enchère précédente");
        else if(player.bidDice === 1
            && this.bidDice !== 1
            && this.bidCount <= player.bidCount * 2)
            alert("Enchère invalide :  Si l'enchère précédente porte sur des Paco le nombre de dés doit être au moins égale au double plus 1");
        else if(this.bidDice < player.bidDice)
            alert("Enchère invalide : La valeur du dé ne peut être inférieure à celle de l'enchère précédente !");
        else if(this.bidCount < player.bidCount)
            alert("Enchère invalide : Le nombre de dés ne peut être inférieur à celui de l'enchère précédente !");
        else if(this.bidCount !== player.bidCount
            && this.bidDice !== player.bidDice)
            alert("Enchère invalide : Vous ne pouvez faire évoluer que le nombre de dés ou la valeur du dé, pas les deux en même temps !");
        else alert("Enchère invalide !")
        return false;
    }
    
    checkPlayerBidValidity() {
        if(this.bidDice === 1 || isPalifico) {
            if(this.bidCount <= countTotalDicesByValue(this.bidDice)) return true;
        }else {
            if(this.bidCount <= countTotalDicesByValue(1) + countTotalDicesByValue(this.bidDice)) return true;
        }
        return false;
    }

    countDicesInPlayerHandByValue(diceValue) {
        let diceNumber = 0;
        for(let dice of this.dices) {if(dice === diceValue) diceNumber++;}
        return diceNumber;
    }

}



function setPlayerAttributeToUser(player) {
    user.dices = player.dices;
}

function setUserAttributeToPlayer(player) {
    player.bidCount = user.bidCount;
    player.bidDice = user.bidDice;
}

function countTotalPlayersDices() {
    totalPlayersDices = 0;
    for(let player of players){
        totalPlayersDices += player.dices.length;
    }
}

function countTotalDicesByValue(diceValue) {
    let diceNumber = 0;
    for(let player of players) {diceNumber += player.countDicesInPlayerHandByValue(diceValue);}
    return diceNumber;
}



function initializeTable(numberOfPlayers) {
    MAIN_SECTION_PANNEL.innerHTML = '';
    for(let nPlayer = 0; nPlayer < numberOfPlayers; nPlayer++){
        MAIN_SECTION_PANNEL.innerHTML = MAIN_SECTION_PANNEL.innerHTML + 
        `<div id="player${nPlayer + 1}" class="playerPannel">` +
            `<div class="playerImage"><img src="Sources/Images/QuestionMark.png" alt=""></div>` +
            `<h1 class="playerName">Player ${nPlayer + 1}</h1>` +
            `<ul class="playerDices">` +
                `<li class="playerDice1"><img src="Sources/Images/DiceFaceEmpty.png" class="dice" alt=""></li>` +
                `<li class="playerDice2"><img src="Sources/Images/DiceFaceEmpty.png" class="dice" alt=""></li>` +
                `<li class="playerDice3"><img src="Sources/Images/DiceFaceEmpty.png" class="dice" alt=""></li>` +
                `<li class="playerDice4"><img src="Sources/Images/DiceFaceEmpty.png" class="dice" alt=""></li>` +
                `<li class="playerDice5"><img src="Sources/Images/DiceFaceEmpty.png" class="dice" alt=""></li>` +
            `</ul>` +
            `<h2 class="lastBidTitle">Enchère</h2>` +
            `<div class="playerBid">` +
                `<p class="playerBidCount"></p>` +
                `<div class="playerBidDice"><img src="Sources/Images/DiceFaceEmpty.png" class="dice" alt=""></div>` +
            `</div>` +
        `</div>`;
    }
}

function initializePlayerElems(numberOfPlayers) {
    for(let nPlayer = 0; nPlayer < numberOfPlayers; nPlayer++) {
        PLAYER_BID_COUNT_ELEMS.push(document.querySelector(`#player${nPlayer + 1} > div.playerBid > p.playerBidCount`));
        PLAYER_BID_DICE_ELEMS.push(document.querySelector(`#player${nPlayer + 1} > div.playerBid > div.playerBidDice > img`));
        PLAYER_DICES_ELEMS.push(document.querySelector(`#player${nPlayer + 1} > ul.playerDices`));
        PLAYER_IMAGE_ELEMS.push(document.querySelector(`#player${nPlayer + 1} > div.playerImage > img`));
        PLAYER_NAME_ELEMS.push(document.querySelector(`#player${nPlayer + 1} > h1.playerName`));
        PLAYER_PANNELS.push(document.querySelector(`#player${nPlayer + 1}`));
    }
}

function initializePlayers(startPlayers = []) {
    user = new Player(undefined, undefined, USER_DICES_ELEM, USER_BID_COUNT_ELEM, USER_BID_DICE_ELEM, undefined, undefined, USER_PANNEL);
    for(let nPlayer = 0; nPlayer < startPlayers.length; nPlayer++) {
        players.push(new Player(startPlayers[nPlayer][0], startPlayers[nPlayer][1], PLAYER_DICES_ELEMS[nPlayer], PLAYER_BID_COUNT_ELEMS[nPlayer], PLAYER_BID_DICE_ELEMS[nPlayer], PLAYER_NAME_ELEMS[nPlayer], PLAYER_IMAGE_ELEMS[nPlayer], PLAYER_PANNELS[nPlayer]));
    }
    randomizePlayersDices();
}

function initializeGame(startPlayers = []) {
    isGameInProgress = true;
    initializeTable(startPlayers.length);
    initializePlayerElems(startPlayers.length);
    initializePlayers(startPlayers);
    currentPlayer = 0;
    setPlayerAttributeToUser(players[currentPlayer]);
    updatePlayers();
}

function randomizePlayersDices() {
    for(let player of players) player.randomizeDices();
}

function resetPlayersBid() {
    user.bidCount = undefined;
    user.bidDice = undefined;
    for(let player of players) {
        player.bidCount = undefined;
        player.bidDice = undefined;
    }
}


function resetPlayers() {
    randomizePlayersDices();
    resetPlayersBid();
    updatePlayers();
}

function checkBid() {
    let lastPlayer = currentPlayer - 1;
    if(lastPlayer < 0) lastPlayer = players.length - 1;
    let currentBidDice = players[lastPlayer].bidDice;
    let currentBidDiceCount = countTotalDicesByValue(currentBidDice);
    let currentPacoDiceCount = countTotalDicesByValue(1);

    let messageBid = `L'enchère en cours annonce : ${players[lastPlayer].bidCount} dés de ${currentBidDice}.`

    if(currentBidDice === 1) {
        messageBid += `\n\nEn tout il y a ${currentBidDiceCount} Paco.`
    }else if(isPalifico) {
        messageBid += `\n\nEn tout il y a ${currentBidDiceCount} dés de ${currentBidDice}. (Palifico : les Paco ne sont pas comptés)`
    }else {
        messageBid += `\n\nEn tout il y a ${currentBidDiceCount} dés de ${currentBidDice} et ${currentPacoDiceCount} Paco.`
        messageBid += `\nSoit ${currentBidDiceCount + currentPacoDiceCount} dés de ${currentBidDice}.`
    }

    if(players[lastPlayer].checkPlayerBidValidity() === true) {
        messageBid += `\n\nL'enchère est donc validée !`;
        messageBid += `\nLe joueur qui a douté perd un dé et les dés sont à nouveau mélangés.`;
        players[currentPlayer].dices.pop();
    }else if(players[lastPlayer].checkPlayerBidValidity() === false) {
        messageBid += `\n\nL'enchère n'est donc pas validée !`;
        messageBid += `\nLe joueur qui a fait l'enchère perd un dé ! Les dés sont à nouveau mélangés.`;
        players[lastPlayer].dices.pop();
        currentPlayer = lastPlayer;
    }

    alert(messageBid);
}


function eliminatePlayer(playerIndex) {
    players[playerIndex].isEliminated = true;
    players[playerIndex].updatePlayerElem();
    eliminatedPlayers.push(players[playerIndex]);
    players.splice(playerIndex,1);
}


function finishGame() {
    isGameInProgress = false;
    let finishMessage = `La partie est finie ! \nLe gagnant est ${players[0].name} !`
    let place = 2;
    for(let playerIndex = eliminatedPlayers.length - 1; playerIndex >= 0; playerIndex--) {
        finishMessage += `\n${place}ème place : ${eliminatedPlayers[playerIndex].name}`;
        place++;
    }
    alert(finishMessage);
}


function updatePlayers() {
    isPalifico = false;
    for(let playerIndex = 0; playerIndex < players.length; playerIndex++){
        if(players[playerIndex].dices.length === 1) isPalifico = true;
        players[playerIndex].isHighLighted = false;
        if(players[playerIndex].dices.length === 0 && !players[playerIndex].isEliminated) eliminatePlayer(playerIndex);
    }
    players[currentPlayer].isHighLighted = true;
    
    if(isPalifico) PALIFICO_SIGN.style.display = 'flex';
    else PALIFICO_SIGN.style.display = 'none';

    user.updatePlayerElem();
    for(let player of players){
        player.updatePlayerElem();
    }
    countTotalPlayersDices();

    if(players.length === 1) {
        finishGame();
        return;
    }
}

function changeCurrentPlayer() {
    currentPlayer++;
    if(currentPlayer > players.length - 1) currentPlayer = 0;
    setPlayerAttributeToUser(players[currentPlayer]);
    setUserAttributeToPlayer(players[currentPlayer]);
    players[currentPlayer].pannelElem.scrollIntoView({behavior: "smooth", block: "center"});

    updatePlayers();
}



function mainProgram() {
    initializeGame(START_PLAYERS);
}

mainProgram();





function addBidCount() {
    if(!isGameInProgress) return;
    if(isNaN(user.bidCount)) user.bidCount = 1;
    else if(user.bidCount + 1 <= totalPlayersDices) user.bidCount++;
    setUserAttributeToPlayer(players[currentPlayer]);
    updatePlayers();
}

function substractBidCount() {
    if(!isGameInProgress) return;
    if(isNaN(user.bidCount)) user.bidCount = 1;
    else if(user.bidCount - 1 >= 1) user.bidCount--;
    setUserAttributeToPlayer(players[currentPlayer]);
    updatePlayers();
}

function addBidDice() {
    if(!isGameInProgress) return;
    if(isNaN(user.bidDice)) user.bidDice = 1;
    else if(user.bidDice + 1 <= 6) user.bidDice++;
    setUserAttributeToPlayer(players[currentPlayer]);
    updatePlayers();
}

function substractBidDice() {
    if(!isGameInProgress) return;
    if(isNaN(user.bidDice)) user.bidDice = 1;
    else if(user.bidDice - 1 >= 1) user.bidDice--;
    setUserAttributeToPlayer(players[currentPlayer]);
    updatePlayers();
}

function makeBid() {
    if(!isGameInProgress) return;
    let lastPlayer = currentPlayer - 1;
    if(lastPlayer < 0) lastPlayer = players.length - 1;
    if(players[currentPlayer].checkBidValidityAgainst(players[lastPlayer])) changeCurrentPlayer();
}

function dudo() {
    if(!isGameInProgress) return;
    if(isNaN(players[currentPlayer].bidCount) || isNaN(players[currentPlayer].bidDice)) {
        alert("Dudo impossible : L'enchère en cours est incomplète !");
        return;
    }
    for(let player of players) {
        player.showPlayerDicesElem();
    }
    checkBid();
    resetPlayers();
}


SHOW_BTN.addEventListener('mousedown', function() {
    if(!isGameInProgress) return;
    user.showPlayerDicesElem();
});
SHOW_BTN.addEventListener('click', function() {
    if(!isGameInProgress) return;
     user.updatePlayerDicesElem();
});
SHOW_BTN.addEventListener('mouseout', function() {
    if(!isGameInProgress) return;
     user.updatePlayerDicesElem();
});

PLUS_BID_COUNT_BTN.addEventListener('click',addBidCount);
MINUS_BID_COUNT_BTN.addEventListener('click',substractBidCount);
PLUS_BID_DICE_BTN.addEventListener('click',addBidDice);
MINUS_BID_DICE_BTN.addEventListener('click',substractBidDice);

BID_BTN.addEventListener('click',makeBid);
DUDO_BTN.addEventListener('click',dudo);


window.addEventListener("keydown", (event) => {
	switch (event.key) {
        case "ArrowDown":
            substractBidCount();
            event.preventDefault();
            break;
        case "ArrowUp":
            addBidCount();
            event.preventDefault();
            break;
        case "ArrowLeft":
            substractBidDice();
            event.preventDefault();
            break;
        case "ArrowRight":
            addBidDice();
            event.preventDefault();
            break;
        case "Enter":
            makeBid();
            event.preventDefault();
            break;
        case "Shift":
            dudo();
            event.preventDefault();
            break;
        case "Control":
            user.showPlayerDicesElem();
            SHOW_BTN.style.background = 'var(--userShowBtnColor_Click)';
            SHOW_BTN.style.color = 'var(--darkGreen)';
	        SHOW_BTN.style.fontWeight = 'bold';
            event.preventDefault();
            break;
        default:
            console.log(event.key);
            return; 
        }
});

window.addEventListener("keyup", (event) => {
	switch (event.key) {
        case "Control":
            user.updatePlayerDicesElem();
            SHOW_BTN.style.background='transparent';
            SHOW_BTN.style.color = 'white';
	        SHOW_BTN.style.fontWeight = 'normal';
            //! Pourquoi le #showBtn:hover ne fonctionne plus après ça ?
            event.preventDefault();
            break;
        default:
            return; 
        }
});


console.log('hello');
