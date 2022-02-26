const MAX_NUMBER_OF_DICES = 5;
const NUMBER_OF_PLAYERS = 4;

const MINUS_BID_COUNT_BTN = document.getElementById('minusBidCount');
const PLUS_BID_COUNT_BTN = document.getElementById('plusBidCount');
const MINUS_BID_DICE_BTN = document.getElementById('minusBidDice');
const PLUS_BID_DICE_BTN = document.getElementById('plusBidDice');
const BID_BTN = document.getElementById('bidBtn');
const DUDO_BTN = document.getElementById('dudoBtn');

const USER_BID_COUNT_ELEM = document.querySelector('#userBidCount > p');
const USER_BID_DICE_ELEM = document.querySelector("#userBidDice > img");
const USER_DICES_ELEM = document.getElementById("userDices");
const USER_PANNEL = document.querySelector('#userPannel');

const MAIN_SECTION_PANNEL = document.getElementById('sectionPannel');

let currentPlayer = 1;

MAIN_SECTION_PANNEL.innerHTML = '';
for(let nPlayer = 0; nPlayer < NUMBER_OF_PLAYERS; nPlayer++){
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


let PLAYER_BID_COUNT_ELEMS = [];
let PLAYER_BID_DICE_ELEMS = [];
let PLAYER_DICES_ELEMS = [];
let PLAYER_IMAGE_ELEMS = [];
let PLAYER_PANNELS = [];

let players = [];
let user;

let totalPlayersDices = 0;

for(let nPlayer = 0; nPlayer < NUMBER_OF_PLAYERS; nPlayer++) {
    PLAYER_BID_COUNT_ELEMS.push(document.querySelector(`#player${nPlayer + 1} > div.playerBid > p.playerBidCount`));
    PLAYER_BID_DICE_ELEMS.push(document.querySelector(`#player${nPlayer + 1} > div.playerBid > div.playerBidDice > img`));
    PLAYER_DICES_ELEMS.push(document.querySelector(`#player${nPlayer + 1} > ul.playerDices`));
    PLAYER_IMAGE_ELEMS.push(document.querySelector(`#player${nPlayer + 1} > div.playerImage > img`));
    PLAYER_PANNELS.push(document.querySelector(`#player${nPlayer + 1}`));
}




class Player {
    constructor(dices = [], bidCount, bidDice, imageIndex, isHighLighted, dicesElem, bidCountElem, bidDiceElem, imageElem, pannelElem) {
        this.dices = dices;
        this.bidCount = bidCount;
        this.bidDice = bidDice;
        this.imageIndex = imageIndex;
        this.dicesElem = dicesElem;
        this.bidCountElem = bidCountElem;
        this.bidDiceElem = bidDiceElem;
        this.imageElem = imageElem;
        this.pannelElem = pannelElem;
        this.isHighLighted = isHighLighted;
    }
    
    updatePlayerElem() {
        this.updatePlayerDicesElem();
        this.updatePlayerBidCountElem();
        this.updatePlayerBidDiceElem();
        this.updatePlayerImage();
        this.updatePlayerHighLight();

        //! A retirer :
        this.showPlayerDicesElem();
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

    checkBidValidityAgainst(player) {
        if(isNaN(this.bidCount) || isNaN(this.bidDice)) return false;
        if(this.bidCount > totalPlayersDices) return false;
        if(isNaN(player.bidCount) || isNaN(player.bidDice)) return true;
        if(player.bidDice !== 1 && this.bidDice !== 1 && this.bidCount == player.bidCount && this.bidDice > player.bidDice) return true;
        if(player.bidDice !== 1 && this.bidDice !== 1 && this.bidCount > player.bidCount && this.bidDice == player.bidDice) return true;
        if(player.bidDice !== 1 && this.bidDice == 1 && this.bidCount >= Math.ceil((player.bidCount) / 2)) return true;
        if(player.bidDice == 1 && this.bidDice !== 1 && this.bidCount > player.bidCount * 2) return true;
        if(player.bidDice == 1 && this.bidDice == 1 && this.bidCount > player.bidCount) return true;
        alert('Enchère invalide !');
        return false;
    }
    
    checkPlayerBidValidity(players) {
        if(this.bidDice === 1) {
            if(this.bidCount <= this.countTotalDices(1, players)) return true;
        }else {
            if(this.bidCount <= this.countTotalDices(1, players) + this.countTotalDices(this.bidDice, players)) return true;
        }
        return false;
    }

    countTotalDices(diceValue, players) {
        let diceNumber = 0;
        for(let player of players) {diceNumber += this.countDicesInPlayerHand(diceValue, player);}
        return diceNumber;
    }

    countDicesInPlayerHand(diceValue, player) {
        let diceNumber = 0;
        for(let dice of player.dices) {if(dice === diceValue) diceNumber++;}
        return diceNumber;
    }

}





function initializePlayers() {
    user = new Player([0, 0, 0, 0, 0], 0, 0, undefined, undefined, USER_DICES_ELEM, USER_BID_COUNT_ELEM, USER_BID_DICE_ELEM, undefined, USER_PANNEL);
    for(let nPlayer = 0; nPlayer < NUMBER_OF_PLAYERS; nPlayer++) {
        players.push(new Player([0, 0, 0, 0, 0], undefined, undefined, nPlayer + 1, false,PLAYER_DICES_ELEMS[nPlayer], PLAYER_BID_COUNT_ELEMS[nPlayer], PLAYER_BID_DICE_ELEMS[nPlayer], PLAYER_IMAGE_ELEMS[nPlayer], PLAYER_PANNELS[nPlayer]));
    }
    randomizePlayersDices();
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


function updatePlayers() {
    user.updatePlayerElem();
    for(let player of players){
        player.updatePlayerElem();
    }
    countTotalPlayersDices();
}

function initializeGame() {
    initializePlayers();
    currentPlayer = 0;
    players[currentPlayer].isHighLighted = true;
    setPlayerAttributeToUser(players[currentPlayer]);
    updatePlayers();
}

function changeCurrentPlayer() {
    players[currentPlayer].isHighLighted = false;
    currentPlayer++;
    if(currentPlayer > NUMBER_OF_PLAYERS - 1) currentPlayer = 0;
    players[currentPlayer].isHighLighted = true;
    setPlayerAttributeToUser(players[currentPlayer]);
    setUserAttributeToPlayer(players[currentPlayer]);

    //! A corriger : trouver comment scroller vers le current player
    // let top = players[currentPlayer].pannelElem.position().top;
    // window.scrollTop(top);
    players[currentPlayer].pannelElem.scrollIntoView({behavior: "smooth", block: "center"});

    updatePlayers();
}



function makeBid() {
    //TODO : vérifier si on peut faire l'enchère par rapport à l'ancienne enchère sinon mettre en message d'avertissement

    let lastPlayer = currentPlayer - 1;
    if(lastPlayer < 0) lastPlayer = NUMBER_OF_PLAYERS - 1;
    if(players[currentPlayer].checkBidValidityAgainst(players[lastPlayer])) changeCurrentPlayer();
}

function dudo() {
    //TODO : vérifier si l'ancienne enchère est correct, enlever un dé en fonction
    let lastPlayer = currentPlayer - 1;
    if(lastPlayer < 0) lastPlayer = NUMBER_OF_PLAYERS - 1;
    if(players[lastPlayer].checkPlayerBidValidity(players) == true) {
        alert("L'enchère est valide, le joueur qui a douté perd un dé ! Les dés sont à nouveau mélangés.");
        players[currentPlayer].dices.pop();
    }else if(players[lastPlayer].checkPlayerBidValidity(players) == false) {
        alert("l'enchère n'est pas valide, le joueur qui a fait l'enchère perd un dé ! Les dés sont à nouveau mélangés.");
        players[lastPlayer].dices.pop();
    }
    resetPlayers();
}


function mainProgram() {
    initializeGame();
}



mainProgram();









function setPlayerAttributeToUser(player) {
    user.dices = player.dices;
    // user.bidCount = player.bidCount;
    // user.bidDice = player.bidDice;
    // Pas nécessaire du passer bidDice et bidCount, cela permet de repartir de la dernière enchère.
}

function setUserAttributeToPlayer(player) {
    // player.dices = user.dices;
    player.bidCount = user.bidCount;
    player.bidDice = user.bidDice;
}

function countTotalPlayersDices() {
    totalPlayersDices = 0;
    for(let player of players){
        totalPlayersDices += player.dices.length;
    }
}



USER_PANNEL.addEventListener('mouseover', function() {
    user.showPlayerDicesElem();
});
USER_PANNEL.addEventListener('mouseout', function() {
    user.updatePlayerDicesElem();
});


// for(let nPlayer = 0; nPlayer < NUMBER_OF_PLAYERS; nPlayer++) {
//     PLAYER_PANNELS[nPlayer].addEventListener('mouseover', function() {
//         players[nPlayer].showPlayerDicesElem();
//     });
//     PLAYER_PANNELS[nPlayer].addEventListener('mouseout', function() {
//         players[nPlayer].updatePlayerDicesElem();
//     });
// }






function addBidCount() {
    if(isNaN(user.bidCount)) user.bidCount = 1;
    else if(user.bidCount + 1 <= totalPlayersDices) user.bidCount++;
    setUserAttributeToPlayer(players[currentPlayer]);
    updatePlayers();
}

function substractBidCount() {
    if(isNaN(user.bidCount)) user.bidCount = 1;
    else if(user.bidCount - 1 >= 1) user.bidCount--;
    setUserAttributeToPlayer(players[currentPlayer]);
    updatePlayers();
}

function addBidDice() {
    if(isNaN(user.bidDice)) user.bidDice = 1;
    else if(user.bidDice + 1 <= 6) user.bidDice++;
    setUserAttributeToPlayer(players[currentPlayer]);
    updatePlayers();
}

function substractBidDice() {
    if(isNaN(user.bidDice)) user.bidDice = 1;
    else if(user.bidDice - 1 >= 1) user.bidDice--;
    setUserAttributeToPlayer(players[currentPlayer]);
    updatePlayers();
}

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
        default:
            console.log(event.key);
            return; 
        }
});

console.log('hello');
