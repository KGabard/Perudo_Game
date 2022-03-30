//TODO : Implémenter le menu "Musique"
//TODO : régler le bug qui fait que le premier joueur à jouer peut faire "dudo" lorsqu'il a une enchère en cours.
//TODO : Faire jouer des joueurs gérés par l'orinateur
//TODO : Implémenter une IA pour l'ordinateur
//TODO : Ajouter une ambiance sonore ? "Hang Drum Music for Focus with Binaural Beats, Focus Music, Handpan Study Music"
//TODO : Gérer le responsive sur petit écran


const MAX_NUMBER_OF_DICES = 5;
const MAX_NUMBER_OF_PLAYER = 10;
let START_PLAYERS = [['Anaïs', 6], ['Kevin', 1], ['Zora', 3]];

const MINUS_BID_COUNT_BTN = document.getElementById('minusBidCount');
const PLUS_BID_COUNT_BTN = document.getElementById('plusBidCount');
const MINUS_BID_DICE_BTN = document.getElementById('minusBidDice');
const PLUS_BID_DICE_BTN = document.getElementById('plusBidDice');
const BID_BTN = document.getElementById('bidBtn');
const DUDO_BTN = document.getElementById('dudoBtn');
const SHOW_BTN = document.getElementById('showBtn');

const MENU_GAME_PANEL = document.querySelector("#navigationMenuGame > .sliderWrapper > .slider");
const MENU_GAME_LINK = document.querySelector("#navigationMenuGame > p");

MENU_GAME_PANEL.innerHTML = 
    '<div id="newGamePanel" class="gameSubMenu"><p>Nouvelle Partie ?</p></div>' +
    '<div id="playerNumberPanel" class="gameSubMenu">' +
        '<p>Nombre de joueurs ?</p>' +
        '<p id="playerNumber" class="disableTextSelection">' +
            '<span class="prevBtn">></span>' +
            '<span class="number">2</span>' +
            '<span class="nextBtn">></span>' +
        '</p>' +
        
        '<button class="menuOkBtn">OK</button>' +
    '</div>'
for(let playerIndex = 1; playerIndex <= MAX_NUMBER_OF_PLAYER; playerIndex++) {
    MENU_GAME_PANEL.innerHTML = MENU_GAME_PANEL.innerHTML +
    `<div id="addPlayerPanel${playerIndex}" class="gameSubMenu">` +
        `<p>Joueur n°${playerIndex} :</p>` +
        `<input type="text" id="playerName${playerIndex}" placeholder="Nom du joueur..." autocomplete="off">` +
        `<input type="submit" value="OK" id="submitPlayer${playerIndex}" class="menuOkBtn">` +
    '</div>'
}

const MENU_CONTROLS_PANEL = document.querySelector("#navigationMenuControls > .sliderWrapper > .slider");
const MENU_CONTROLS_LINK = document.querySelector("#navigationMenuControls > p");

const MENU_RULES_PANEL = document.querySelector("#navigationMenuRules > .sliderWrapper > .slider");
const MENU_RULES_LINK = document.querySelector("#navigationMenuRules > p");

const MENU_MUSIC_PANEL = document.querySelector("#navigationMenuMusic > .sliderWrapper > .slider");
const MENU_MUSIC_LINK = document.querySelector("#navigationMenuMusic > p");

const MENUS_SLIDERS = document.querySelectorAll("#navigationMenus .slider");
const MENUS_SLIDER_WRAPPERS = document.querySelectorAll("#navigationMenus .sliderWrapper");

const MENU_GAME_NEWGAME_PANEL = document.querySelector("#newGamePanel");

const MENU_GAME_NEWGAME_PLAYERNUMBER_PANEL = document.querySelector("#playerNumberPanel");
const MENU_GAME_NEWGAME_PLAYERNUMBER_NUMBER = document.querySelector('#playerNumberPanel > #playerNumber > .number');
const MENU_GAME_NEWGAME_PLAYERNUMBER_PLUSBTN = document.querySelector('#playerNumberPanel > #playerNumber > .nextBtn');
const MENU_GAME_NEWGAME_PLAYERNUMBER_MINUSBTN = document.querySelector('#playerNumberPanel > #playerNumber > .prevBtn');
const MENU_GAME_NEWGAME_PLAYERNUMBER_LINKBTN = document.querySelector('#playerNumberPanel > .menuOkBtn');

let MENU_GAME_NEWGAME_ADDPLAYER_PANEL = [];
let MENU_GAME_NEWGAME_ADDPLAYER_NAME = [];
let MENU_GAME_NEWGAME_ADDPLAYER_LINKBTN = [];

for(let playerIndex = 1; playerIndex <= MAX_NUMBER_OF_PLAYER; playerIndex++) {
    MENU_GAME_NEWGAME_ADDPLAYER_PANEL.push(document.querySelector(`#addPlayerPanel${playerIndex}`));
    MENU_GAME_NEWGAME_ADDPLAYER_NAME.push(document.querySelector(`#playerName${playerIndex}`));
    MENU_GAME_NEWGAME_ADDPLAYER_LINKBTN.push(document.querySelector(`#submitPlayer${playerIndex}`));
}

let MENUS = [];


const USER_BID_COUNT_ELEM = document.querySelector('#userBidCount > p');
const USER_BID_DICE_ELEM = document.querySelector("#userBidDice > img");
const USER_DICES_ELEM = document.getElementById("userDices");
const USER_PANEL = document.querySelector('#userPanel');
const PALIFICO_SIGN = document.querySelector('#palificoSign');

const MESSAGE_TITLE_ELEM = document.getElementById('messagePanelTitle');
const MESSAGE_TEXT_ELEM = document.getElementById('message');
const MESSAGE_OK_BTN = document.querySelector("#messagePanel > .okBtn");
const MESSAGE_PANEL_ELEM = document.getElementById('messagePanel');

const MAIN_SECTION_PANEL = document.getElementById('sectionPanel');

let currentPlayer = 1;
let isPalifico = false;
let isGamePause = true;
let hasToResetPlayers = false;


let PLAYER_BID_COUNT_ELEMS = [];
let PLAYER_BID_DICE_ELEMS = [];
let PLAYER_DICES_ELEMS = [];
let PLAYER_IMAGE_ELEMS = [];
let PLAYER_NAME_ELEMS = [];
let PLAYER_PANELS = [];

let players = [];
let eliminatedPlayers = [];
let user;

let totalPlayersDices = 0;

let slideAnimationTimer = 400;


class Menu {
    constructor(name, panelElem, linkElems = [],  openElems = [], closeElems = [], animation) {
        this.name = name;
        this.panelElem = panelElem;
        this.linkElems = linkElems;
        this.openElems = openElems;
        this.closeElems = closeElems;
        this.animation = animation;
        this.panelElem.isDisplay = false;
    }

    updateMenu() {
        if(this.animation === 'fromTop') {
            if(this.panelElem.isDisplay) {
                this.panelElem.style.animationName = 'slideInFromTop';
                this.panelElem.style.animationDuration = `${slideAnimationTimer/1000}s`;
                this.panelElem.style.transform = 'var(--panelPositionCenter)';
            }
            else if(!this.panelElem.isDisplay) {
                this.panelElem.style.animationName = 'slideOutToTop';
                this.panelElem.style.transform = 'var(--panelPositionTop)';
            }
        } else if(this.animation === 'fromRight') {
            if(this.panelElem.isDisplay) {
                this.panelElem.style.animationName = 'slideInFromRight';
                this.panelElem.style.animationDuration = `${slideAnimationTimer/1000}s`;
                this.panelElem.style.transform = 'var(--panelPositionCenter)';
                this.panelElem.style.display = 'flex';
            }
            else if(!this.panelElem.isDisplay) {
                this.panelElem.style.animationName = 'slideOutToLeft';
                this.panelElem.style.transform = 'var(--panelPositionLeft)';
                this.panelElem.style.display = 'none';
            }
        } else if(this.animation === 'none') {
            if(this.panelElem.isDisplay) {
                this.panelElem.style.transform = 'var(--panelPositionCenter)';
                this.panelElem.style.display = 'flex';
            }
            else if(!this.panelElem.isDisplay) {
                this.panelElem.style.transform = 'var(--panelPositionLeft)';
                this.panelElem.style.display = 'none';
            }
        }

        for(let link of this.linkElems) {
            if(link.isAvailable) link.style.opacity = 1;
            if(!link.isAvailable) link.style.opacity = 0.5;
        }
    }

}

MENUS.push(new Menu(
    "Game",
    MENU_GAME_PANEL,
    [MENU_GAME_LINK, MENU_GAME_LINK],
    [MENU_GAME_PANEL, MENU_GAME_NEWGAME_PANEL],
    [undefined, undefined],
    'fromTop'));
MENU_GAME_LINK.isAvailable = true;

MENUS.push(new Menu(
    "Controls",
    MENU_CONTROLS_PANEL,
    [MENU_CONTROLS_LINK],
    [MENU_CONTROLS_PANEL],
    [undefined],
    'fromTop'));
MENU_CONTROLS_LINK.isAvailable = true;

MENUS.push(new Menu(
    "Rules",
    MENU_RULES_PANEL,
    [MENU_RULES_LINK],
    [MENU_RULES_PANEL],
    [undefined],
    'fromTop'));
MENU_RULES_LINK.isAvailable = true;

MENUS.push(new Menu(
    "Music",
    MENU_MUSIC_PANEL,
    [MENU_MUSIC_LINK],
    [MENU_MUSIC_PANEL],
    [undefined],
    'fromTop'));
MENU_MUSIC_LINK.isAvailable = true;

MENUS.push(new Menu(
    "NewGame",
    MENU_GAME_NEWGAME_PANEL,
    [MENU_GAME_NEWGAME_PANEL],
    [MENU_GAME_NEWGAME_PLAYERNUMBER_PANEL],
    [MENU_GAME_NEWGAME_PANEL],
    'none'));
MENU_GAME_NEWGAME_PANEL.isAvailable = true;

MENUS.push(new Menu(
    "PlayerNumber",
    MENU_GAME_NEWGAME_PLAYERNUMBER_PANEL,
    [MENU_GAME_NEWGAME_PLAYERNUMBER_LINKBTN],
    [MENU_GAME_NEWGAME_ADDPLAYER_PANEL[0]],
    [MENU_GAME_NEWGAME_PLAYERNUMBER_PANEL],
    'fromRight'));
MENU_GAME_NEWGAME_PLAYERNUMBER_LINKBTN.isAvailable = true;


for(let playerIndex = 1; playerIndex <= MAX_NUMBER_OF_PLAYER; playerIndex++) {
    if(playerIndex < MAX_NUMBER_OF_PLAYER) {
        MENUS.push(new Menu(
            `AddPlayer${playerIndex}`,
            MENU_GAME_NEWGAME_ADDPLAYER_PANEL[playerIndex - 1],
            [MENU_GAME_NEWGAME_ADDPLAYER_LINKBTN[playerIndex - 1]],
            [MENU_GAME_NEWGAME_ADDPLAYER_PANEL[playerIndex]],
            [MENU_GAME_NEWGAME_ADDPLAYER_PANEL[playerIndex - 1]],
            'fromRight'));
        MENU_GAME_NEWGAME_ADDPLAYER_LINKBTN[playerIndex - 1].isAvailable = false;
    } else {
        MENUS.push(new Menu(
            `AddPlayer${playerIndex}`,
            MENU_GAME_NEWGAME_ADDPLAYER_PANEL[playerIndex - 1],
            [MENU_GAME_NEWGAME_ADDPLAYER_LINKBTN[playerIndex - 1]],
            [undefined],
            [MENU_GAME_PANEL],
            'fromRight'));
        MENU_GAME_NEWGAME_ADDPLAYER_LINKBTN[playerIndex - 1].isAvailable = false;
    }
}
    



class Player {
    constructor(name, imageIndex, dicesElem, bidCountElem, bidDiceElem, nameElem, imageElem, panelElem) {
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
        this.panelElem = panelElem;
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
        for(let nDice = 0; nDice < this.dices.length; nDice++){
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
        for(let nDice = 0; nDice < this.dices.length; nDice++){
            this.dices[nDice] = this.randomizeDice();
        }
    }

    updatePlayerHighLight() {
        if(this.panelElem === undefined) return;
        if(this.imageElem === undefined) return;

        if(this.isHighLighted) {
            this.panelElem.style.border = '2px solid var(--plusLightGreen)';
            this.imageElem.style.border = '2px solid var(--plusLightGreen)';
            this.panelElem.style.filter = 'drop-shadow(0px 0px 6px var(--lightGreen))';
            this.imageElem.style.filter = 'drop-shadow(0px 0px 6px var(--lightGreen))';
        }else if(this.isHighLighted == false) {
            this.panelElem.style.border = '2px solid var(--lightWhite)';
            this.imageElem.style.border = '2px solid var(--lightWhite)';
            this.panelElem.style.filter = 'drop-shadow(0px 0px 0px rgb(0,0,0,0))';
            this.imageElem.style.filter = 'drop-shadow(0px 0px 0px rgb(0,0,0,0))';
        }
    }
    
    highLightPlayerInRed() {
        if(this.panelElem === undefined) return;
        if(this.imageElem === undefined) return;

        this.panelElem.style.border = '2px solid var(--plusLightRed)';
        this.imageElem.style.border = '2px solid var(--plusLightRed)';
        this.panelElem.style.filter = 'drop-shadow(0px 0px 6px var(--lightRed))';
        this.imageElem.style.filter = 'drop-shadow(0px 0px 6px var(--lightRed))';
    }

    highLightPlayerInWhite() {
        if(this.panelElem === undefined) return;
        if(this.imageElem === undefined) return;

        this.panelElem.style.border = '2px solid var(--lightWhite)';
        this.imageElem.style.border = '2px solid var(--lightWhite)';
        this.panelElem.style.filter = 'drop-shadow(0px 0px 0px rgb(0,0,0,0))';
        this.imageElem.style.filter = 'drop-shadow(0px 0px 0px rgb(0,0,0,0))';
    }

    updatePlayerEliminated() {
        if(this.panelElem === undefined) return;
        if(this.isEliminated) this.panelElem.style.display = 'none';
    }

    checkBidValidityAgainst(player) {
        if(isNaN(this.bidCount) || isNaN(this.bidDice)) {
            displayMessage('Enchère invalide !', 'Votre enchère est incomplète.', 'error');
            return false;
        }
        if(this.bidCount > totalPlayersDices) {
            displayMessage('Enchère invalide !', 'Vous avez parié sur un nombre de dés plus élevé que le total présent sur la table !', 'error');
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
            displayMessage("Enchère invalide !", "L'enchère ne peut être la même que la précédente !", 'error');
        else if(isPalifico
            && this.bidDice !== player.bidDice)
            displayMessage("Enchère invalide !", "En situtation de Palifico la valeur du dé doit être la même que celle de l'enchère précédente !", 'error');
        else if(player.bidDice !== 1
            && this.bidDice === 1
            && this.bidCount < Math.ceil((player.bidCount) / 2))
            displayMessage("Enchère invalide !", "Le nombre de Paco doit être au moins égale à la moitié de l'enchère précédente.", 'error');
        else if(player.bidDice === 1
            && this.bidDice !== 1
            && this.bidCount <= player.bidCount * 2)
            displayMessage("Enchère invalide !", "Si l'enchère précédente porte sur des Paco le nombre de dés doit être au moins égale au double plus 1.", 'error');
        else if(this.bidDice < player.bidDice)
            displayMessage("Enchère invalide !", "La valeur du dé ne peut être inférieure à celle de l'enchère précédente.", 'error');
        else if(this.bidCount < player.bidCount)
            displayMessage("Enchère invalide !", "Le nombre de dés ne peut être inférieur à celui de l'enchère précédente.", 'error');
        else if(this.bidCount !== player.bidCount
            && this.bidDice !== player.bidDice)
            displayMessage("Enchère invalide !", "Vous ne pouvez faire évoluer que le nombre de dés ou la valeur du dé, pas les deux en même temps.", 'error');
        else displayMessage("Enchère invalide !", "Votre enchère est invalide.", 'error');
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
    MAIN_SECTION_PANEL.innerHTML = '';
    for(let nPlayer = 0; nPlayer < numberOfPlayers; nPlayer++){
        MAIN_SECTION_PANEL.innerHTML = MAIN_SECTION_PANEL.innerHTML + 
        `<div id="player${nPlayer + 1}" class="playerPanel">` +
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
    PLAYER_BID_COUNT_ELEMS = [];
    PLAYER_BID_DICE_ELEMS = [];
    PLAYER_DICES_ELEMS = [];
    PLAYER_IMAGE_ELEMS = [];
    PLAYER_NAME_ELEMS = [];
    PLAYER_PANELS = [];
    for(let nPlayer = 0; nPlayer < numberOfPlayers; nPlayer++) {
        PLAYER_BID_COUNT_ELEMS.push(document.querySelector(`#player${nPlayer + 1} > div.playerBid > p.playerBidCount`));
        PLAYER_BID_DICE_ELEMS.push(document.querySelector(`#player${nPlayer + 1} > div.playerBid > div.playerBidDice > img`));
        PLAYER_DICES_ELEMS.push(document.querySelector(`#player${nPlayer + 1} > ul.playerDices`));
        PLAYER_IMAGE_ELEMS.push(document.querySelector(`#player${nPlayer + 1} > div.playerImage > img`));
        PLAYER_NAME_ELEMS.push(document.querySelector(`#player${nPlayer + 1} > h1.playerName`));
        PLAYER_PANELS.push(document.querySelector(`#player${nPlayer + 1}`));
    }
}

function initializePlayers(startPlayers = []) {
    user = new Player(undefined, undefined, USER_DICES_ELEM, USER_BID_COUNT_ELEM, USER_BID_DICE_ELEM, undefined, undefined, USER_PANEL);
    players = [];
    for(let nPlayer = 0; nPlayer < startPlayers.length; nPlayer++) {
        players.push(new Player(startPlayers[nPlayer][0], startPlayers[nPlayer][1], PLAYER_DICES_ELEMS[nPlayer], PLAYER_BID_COUNT_ELEMS[nPlayer], PLAYER_BID_DICE_ELEMS[nPlayer], PLAYER_NAME_ELEMS[nPlayer], PLAYER_IMAGE_ELEMS[nPlayer], PLAYER_PANELS[nPlayer]));
    }
    randomizePlayersDices();
}

function initializeGame() {
    isGamePause = false;
    initializeTable(START_PLAYERS.length);
    initializePlayerElems(START_PLAYERS.length);
    initializePlayers(START_PLAYERS);
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
        messageBid += `<br><br>En tout il y a ${currentBidDiceCount} Paco.`
    }else if(isPalifico) {
        messageBid += `<br><br>En tout il y a ${currentBidDiceCount} dés de ${currentBidDice}. (Palifico : les Paco ne sont pas comptés)`
    }else {
        messageBid += `<br><br>En tout il y a ${currentBidDiceCount} dés de ${currentBidDice} et ${currentPacoDiceCount} Paco.`
        messageBid += `<br>Soit ${currentBidDiceCount + currentPacoDiceCount} dés de ${currentBidDice}.`
    }

    if(players[lastPlayer].checkPlayerBidValidity() === true) {
        messageBid += `<br><br>L'enchère est donc validée !`;
        messageBid += `<br>Le joueur qui a douté perd un dé et les dés sont à nouveau mélangés.`;
        players[currentPlayer].dices.pop();
        for(let player of players) {
            player.highLightPlayerInWhite();
        }
        players[currentPlayer].highLightPlayerInRed();
    }else if(players[lastPlayer].checkPlayerBidValidity() === false) {
        messageBid += `<br><br>L'enchère n'est donc pas validée !`;
        messageBid += `<br>Le joueur qui a fait l'enchère perd un dé ! Les dés sont à nouveau mélangés.`;
        players[lastPlayer].dices.pop();
        for(let player of players) {
            player.highLightPlayerInWhite();
        }
        players[lastPlayer].highLightPlayerInRed();
        currentPlayer = lastPlayer;
    }

    displayMessage("Vérification de l'enchère", messageBid, 'normal');
}


function eliminatePlayer(playerIndex) {
    players[playerIndex].isEliminated = true;
    players[playerIndex].updatePlayerElem();
    eliminatedPlayers.push(players[playerIndex]);
    players.splice(playerIndex,1);
    currentPlayer++;
    if(currentPlayer >= players.length) currentPlayer = 0;
}


function finishGame() {
    isGamePause = true;
    let finishMessage = `La partie est finie ! <br><br>Le gagnant est ${players[0].name} !`
    let place = 2;
    for(let playerIndex = eliminatedPlayers.length - 1; playerIndex >= 0; playerIndex--) {
        finishMessage += `<br>${place}ème place : ${eliminatedPlayers[playerIndex].name}`;
        place++;
    }
    displayMessage("Fin de partie", finishMessage, 'end');
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
    players[currentPlayer].panelElem.scrollIntoView({behavior: "smooth", block: "center"});

    updatePlayers();
}

function setPanelDisplaySettings(panelElement, titleElement, textElement, background, animationTiming, animationDuration, animationName, title, message) {
    if(panelElement == undefined) return;
    if(background != undefined) panelElement.style.background = background;
    if(animationTiming != undefined) panelElement.style.animationTimingFunction = animationTiming;
    if(animationDuration != undefined) panelElement.style.animationDuration = animationDuration;
    if(animationName != undefined) panelElement.style.animationName = animationName;
    if(titleElement != undefined && title != undefined) titleElement.innerHTML = title;
    if(textElement != undefined && message != undefined) textElement.innerHTML = message;
}

function displayMessage(title, message, type) {
    MESSAGE_PANEL_ELEM.messageType = type;
    switch (MESSAGE_PANEL_ELEM.messageType) {
        case "error":
            setPanelDisplaySettings(
                MESSAGE_PANEL_ELEM,
                MESSAGE_TITLE_ELEM,
                MESSAGE_TEXT_ELEM,
                'var(--errorMessageBgColor)',
                'ease-out',
                `${slideAnimationTimer/1000}s`,
                'slideInFromLeft',
                title,
                message);
            break;
        case "normal":
            setPanelDisplaySettings(
                MESSAGE_PANEL_ELEM,
                MESSAGE_TITLE_ELEM,
                MESSAGE_TEXT_ELEM,
                'var(--normalMessageBgColor)',
                'ease-out',
                `${slideAnimationTimer/1000}s`,
                'slideInFromLeft',
                title,
                message);
            break;
        case "end":
            setPanelDisplaySettings(
                MESSAGE_PANEL_ELEM,
                MESSAGE_TITLE_ELEM,
                MESSAGE_TEXT_ELEM,
                undefined,
                'ease-in',
                `${slideAnimationTimer/1000}s`,
                'slideOutToRight',
                undefined,
                undefined);
            setTimeout(function(){
                setPanelDisplaySettings(
                    MESSAGE_PANEL_ELEM,
                    MESSAGE_TITLE_ELEM,
                    MESSAGE_TEXT_ELEM,
                    'var(--endMessageBgColor)',
                    'ease-out',
                    `${slideAnimationTimer/1000}s`,
                    'slideInFromLeft',
                    title,
                    message);
            }, slideAnimationTimer);
            break;
        default:
            console.log('Type de message non reconnu');
            return; 
        }
    isGamePause = true;
    MESSAGE_PANEL_ELEM.isMessageDisplay = true;
    
    MESSAGE_PANEL_ELEM.style.transform = 'var(--panelPositionCenter)';
}

function stopDisplayMessage() {
    if(!MESSAGE_PANEL_ELEM.isMessageDisplay) return;
    if(MESSAGE_PANEL_ELEM.messageType === 'error' || MESSAGE_PANEL_ELEM.messageType === 'normal') isGamePause = false;
    MESSAGE_PANEL_ELEM.isMessageDisplay = false;
    setPanelDisplaySettings(
        MESSAGE_PANEL_ELEM,
        MESSAGE_TITLE_ELEM,
        MESSAGE_TEXT_ELEM,
        undefined,
        'ease-in',
        `${slideAnimationTimer/1000}s`,
        'slideOutToRight',
        undefined,
        undefined);
    MESSAGE_PANEL_ELEM.style.transform = 'var(--panelPositionLeft)';
    if(hasToResetPlayers) {
        hasToResetPlayers = false;
        resetPlayers();
    }
}



function addPlayerNumber() {
    let playerNumber = MENU_GAME_NEWGAME_PLAYERNUMBER_NUMBER.innerHTML;
    if(playerNumber < MAX_NUMBER_OF_PLAYER) playerNumber++;
    MENU_GAME_NEWGAME_PLAYERNUMBER_NUMBER.innerHTML = playerNumber;
}

function substractPlayerNumber() {
    let playerNumber = MENU_GAME_NEWGAME_PLAYERNUMBER_NUMBER.innerHTML;
    if(playerNumber > 2) playerNumber--;
    MENU_GAME_NEWGAME_PLAYERNUMBER_NUMBER.innerHTML = playerNumber;
}


function addBidCount() {
    if(isGamePause) return;
    if(isNaN(user.bidCount)) user.bidCount = 1;
    else if(user.bidCount + 1 <= totalPlayersDices) user.bidCount++;
    setUserAttributeToPlayer(players[currentPlayer]);
    updatePlayers();
}

function substractBidCount() {
    if(isGamePause) return;
    if(isNaN(user.bidCount)) user.bidCount = 1;
    else if(user.bidCount - 1 >= 1) user.bidCount--;
    setUserAttributeToPlayer(players[currentPlayer]);
    updatePlayers();
}

function addBidDice() {
    if(isGamePause) return;
    if(isNaN(user.bidDice)) user.bidDice = 1;
    else if(user.bidDice + 1 <= 6) user.bidDice++;
    setUserAttributeToPlayer(players[currentPlayer]);
    updatePlayers();
}

function substractBidDice() {
    if(isGamePause) return;
    if(isNaN(user.bidDice)) user.bidDice = 1;
    else if(user.bidDice - 1 >= 1) user.bidDice--;
    setUserAttributeToPlayer(players[currentPlayer]);
    updatePlayers();
}

function makeBid() {
    if(isGamePause) return;
    let lastPlayer = currentPlayer - 1;
    if(lastPlayer < 0) lastPlayer = players.length - 1;
    if(players[currentPlayer].checkBidValidityAgainst(players[lastPlayer])) changeCurrentPlayer();
}

function dudo() {
    if(isGamePause) return;
    if(isNaN(players[currentPlayer].bidCount) || isNaN(players[currentPlayer].bidDice)) {
        displayMessage("Dudo impossible !", "L'enchère en cours est incomplète.", 'error');
        return;
    }
    for(let player of players) {
        player.showPlayerDicesElem();
    }
    hasToResetPlayers = true;
    checkBid();
}


function initializeAddPlayerMenus() {
    for(let menuIndex = 0; menuIndex < MENUS.length; menuIndex++){
        if(MENUS[menuIndex].name.includes('AddPlayer')) {
            if(menuIndex < MENUS.length - 1) {
                MENUS[menuIndex].openElems = [MENUS[menuIndex + 1].panelElem];
                MENUS[menuIndex].closeElems = [MENUS[menuIndex].panelElem];
            } else {
                MENUS[menuIndex].openElems = [undefined];
                MENUS[menuIndex].closeElems = [MENUS[menuIndex].panelElem];
            }
        }
    }
}

function updateAddPlayerMenus() {
    initializeAddPlayerMenus();
    let playerNumber = parseInt(MENU_GAME_NEWGAME_PLAYERNUMBER_NUMBER.innerHTML);
    for(let menu of MENUS){
        if(menu.name === `AddPlayer${playerNumber}`) {
            menu.openElems = [undefined];
            menu.closeElems = [MENU_GAME_PANEL];
        }
    }
    for(let index = 0; index < MENU_GAME_NEWGAME_ADDPLAYER_PANEL.length; index++) {
        MENU_GAME_NEWGAME_ADDPLAYER_LINKBTN[index].removeEventListener('click',initializeGame);
        if(index + 1 === playerNumber) {
            MENU_GAME_NEWGAME_ADDPLAYER_LINKBTN[index].addEventListener('click',initializeGame);
        }
    }
}


SHOW_BTN.addEventListener('mousedown', function() {
    if(isGamePause) return;
    user.showPlayerDicesElem();
});
SHOW_BTN.addEventListener('click', function() {
    if(isGamePause) return;
     user.updatePlayerDicesElem();
});
SHOW_BTN.addEventListener('mouseout', function() {
    if(isGamePause) return;
     user.updatePlayerDicesElem();
});

PLUS_BID_COUNT_BTN.addEventListener('click',addBidCount);
MINUS_BID_COUNT_BTN.addEventListener('click',substractBidCount);
PLUS_BID_DICE_BTN.addEventListener('click',addBidDice);
MINUS_BID_DICE_BTN.addEventListener('click',substractBidDice);

BID_BTN.addEventListener('click',makeBid);
DUDO_BTN.addEventListener('click',dudo);

MESSAGE_OK_BTN.addEventListener('click',stopDisplayMessage);

MENU_GAME_NEWGAME_PLAYERNUMBER_PLUSBTN.addEventListener('click',addPlayerNumber);
MENU_GAME_NEWGAME_PLAYERNUMBER_MINUSBTN.addEventListener('click',substractPlayerNumber);
MENU_GAME_NEWGAME_PLAYERNUMBER_LINKBTN.addEventListener('click',updateAddPlayerMenus);


BID_BTN.addEventListener('click',function() {
    alert('enchere click');
});



function resetStartPlayers() {
    START_PLAYERS = [];
}

function addStartPlayer(playerIndex) {
    let playerName = MENU_GAME_NEWGAME_ADDPLAYER_NAME[playerIndex - 1].value;
    START_PLAYERS.push([playerName, playerIndex])
}


function checkNameValidity(playerIndex) {
    let name = MENU_GAME_NEWGAME_ADDPLAYER_NAME[playerIndex - 1].value;
    if(name.length >= 2 && name.length <= 10 ) {
        MENU_GAME_NEWGAME_ADDPLAYER_LINKBTN[playerIndex - 1].isAvailable = true;
    }
    if(name.length < 2 || name.length > 10 ) {
        MENU_GAME_NEWGAME_ADDPLAYER_LINKBTN[playerIndex - 1].isAvailable = false;
    }
}

function alertNameValidity(playerIndex) {
    let name = MENU_GAME_NEWGAME_ADDPLAYER_NAME[playerIndex - 1].value;
    if(name.length < 2 || name.length > 10 ) {
        alert('Erreur : Le nom du joueur doit avoir un nombre de caratères compris entre 2 et 10.')
    }
}

for(let index = 0; index < MENU_GAME_NEWGAME_ADDPLAYER_NAME.length; index++) {
    MENU_GAME_NEWGAME_ADDPLAYER_NAME[index].addEventListener('input',function(){
        checkNameValidity(index + 1);
        updateMenus();
    });
}

for(let index = 0; index < MENU_GAME_NEWGAME_ADDPLAYER_NAME.length; index++) {
    MENU_GAME_NEWGAME_ADDPLAYER_NAME[index].addEventListener('blur',function(){
        alertNameValidity(index + 1);
    });
}




for(let menu of MENUS) {
    menu.panelElem.isMouseOver = false;
    menu.panelElem.addEventListener('mouseover',function(){
        menu.panelElem.isMouseOver = true;
    });
    menu.panelElem.addEventListener('mouseout',function(){
        menu.panelElem.isMouseOver = false;
    });
    for(let linkElem of menu.linkElems) {
        linkElem.isMouseOver = false;
        linkElem.addEventListener('mouseover',function(){
            linkElem.isMouseOver = true;
        });
        linkElem.addEventListener('mouseout',function(){
            linkElem.isMouseOver = false;
        });
    }
}

function updateMenus() {
    for(let menu of MENUS) {
        menu.updateMenu();
    }
    for(let index = 0; index < MENUS_SLIDERS.length; index++) {
        if(MENUS_SLIDERS[index].isDisplay) MENUS_SLIDER_WRAPPERS[index].style.display = "block"
        if(!MENUS_SLIDERS[index].isDisplay) setTimeout(function(){MENUS_SLIDER_WRAPPERS[index].style.display = "none"}, slideAnimationTimer);
    }
}


document.body.addEventListener('click',function(){
    for(let menu of MENUS) {
        menu.panelElem.isDisplay = false;
    }

    for(let menu of MENUS) {
        if(menu.panelElem.isMouseOver) menu.panelElem.isDisplay = true;
        for(let index = 0; index < menu.linkElems.length; index++) {
            if(menu.linkElems[index].isMouseOver && menu.linkElems[index].isAvailable) {
                if(menu.openElems[index] !== undefined) menu.openElems[index].isDisplay = true;
                if(menu.closeElems[index] !== undefined) menu.closeElems[index].isDisplay = false;
            }
        }
    }

    updateMenus();
});


for(let index = 0; index < MENU_GAME_NEWGAME_ADDPLAYER_PANEL.length; index++) {
    MENU_GAME_NEWGAME_ADDPLAYER_LINKBTN[index].addEventListener('click',function(){
        if(!this.isAvailable) return;
        if(index === 0 ) resetStartPlayers();
        addStartPlayer(index + 1);
    });
};



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
            if(!isGamePause) makeBid();
            else if(MESSAGE_PANEL_ELEM.isMessageDisplay) stopDisplayMessage();
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
            //! Pourquoi le #showBtn:hover ne fonctionne plus après ça ? ==> les styles imposés en javascript restent et sont prédominant sur le CSS, il faut trouver une solution.
            event.preventDefault();
            break;
        default:
            return; 
        }
});


console.log('hello');
