const presets = {
    "Sweet Treats": "Lollipop|Pocky|PEZ|Macaron|Gummy Bears|Ferro Rocher|Toblerone|Aero|Bounty|Crunchie|Kit Kat|Mars|Maltesers|Polo|Skittles|Smarties|Starburst|Wine Gummies|Rock Candy|Fudge|Reese's Pieces|Jaffa Cake|Hershey's Kisses|Milky Way|Reese's Peanut Butter Cup|Rolo|Snickers|Twix|Cotton Candy|Gumdrop|M&M's|Toffee|Candy Canes|Jawbreakers|Strawberry Laces|Licorice|Chupa Chups|Chocolate|Double Decker|Freddo|Kinder Bueno|Milky Bar|Wispa|Laffy Taffy|Cake|Red Velvet Cake|Chocolate Cake|Apple Pie|Brownie|Carrot Cake|Custard|Doughnut|Chocolate Chip Cookie|Cookie|Cupcake|Cheesecake|Fruitcake|Ice Cream|Gelato|Gingerbread|Key Lime Pie|Milkshake|Banana Split|Muffin|Blueberry Muffin|Pancakes|Waffles|Rice Pudding|Sorbet|Galaxy|Lemon Drizzle Cake|Ice Cream Cake|Haribos|Jelly Babies|Maoam|Minstrels",
    Sports: "Dancing|Figure Skating|Paragliding|Gliding|Hang Gliding|Parachuting|Jousting|Triple Jump|Long Jump|High Jump|Pole Vault|Javelin Throwing|Shot Put Throwing|Running|Marathon|Sprint|Decathalon|Baseball|Cricket|Billiards|Pool|Snooker|Croquet|Curling|Bowling|Dodgeball|Golf|Basketball|Netball|Football|Rugby|Water Polo|Hockey|Ice Hockey|Badminton|Pickleball|Tennis|Table Tennis|Ping-pong|Volleyball|Four Square|Hoverboarding|Skateboarding|Longboarding|Snowboarding|Surfing|Climbing|Wrestling|Sumo|Boxing|Kickboxing|Airsoft|Lazer Tag|Paintball|Fencing|Ultimate Frisbee|Gymnastics|Slacklining|Cycling|BMX|Skating|Archery|Bullseye Shooting|Ice Skating|Skiing|Weightlifting|Racewalking|Swimming|Diving|Arm Wrestling",
    Birds: "Parrot|Chicken|Owl|Pidgeon|Penguin|Hummingbird|Toucan|Finch|Falcon|Crow|Sparrow|Woodpecker|Heron|Ostrich|Robin|Crane|Tit|Swan|Emu|Magpie|Pelican|Stork|Goose|Gull|Jay|Duck|Puffin|Quail|Raven|Partridge|Parakeet",
    //Test: "1|2|3|4|5|6|7|8|9|10",
};

let deck = [];
let deckHistory = [];
let finishedDeck = false;
let seenBlue = false;
let currentCard = 0;
let countdown = 0;
let timeRemaining = 0;
let gameStarted = false;
let timerInterval;

let body = document.querySelector("body");

let setupContainer = document.getElementById("setupcontainer");
let presetSelection = document.getElementById("presetselection");
let deckTextInput = document.getElementById("decktextinput");
let timerInput = document.getElementById("timerinput");
let startButton = document.getElementById("startbutton");

let gameContainer = document.getElementById("gamecontainer");
let text = document.getElementById("text");
let controls = document.getElementById("controls");
let timer = document.getElementById("timer");

let endContainer = document.getElementById("endcontainer");
let results = document.getElementById("results");
let deckDone = document.getElementById("deckdone");
let correct = document.getElementById("correct");
let playAgain = document.getElementById("playagain");
let mainMenu = document.getElementById("mainmenu");

function moveOn(type) {
    deckHistory.push({
        text: deck.splice(currentCard, 1)[0],
        moveOnType: type
    });
    currentCard = rand(0, deck.length);
    text.textContent = deck[currentCard];

    if (deck.length == 0) {
        finishedDeck = true;
        end();
    }
}

function handleOrientation(event) {
    if (!gameStarted) {
        return;
    }

    if ((50 <= event.gamma && event.gamma <= 90) || (-90 <= event.gamma && event.gamma <= -75)) {
        gameContainer.className = "blue";
        seenBlue = true;
    } else if ((0 <= event.gamma && event.gamma <= 50) || (-15 <= event.gamma && event.gamma <= 0)) {
        if (seenBlue) {
            gameContainer.className = "green";
            seenBlue = false;
            moveOn("correct");
        }
    } else {
        if (seenBlue) {
            gameContainer.className = "red";
            seenBlue = false;
            moveOn("skip");
        }
    }
}

function timeLeftString(time) {
    let mins = String(Math.floor(time / 60)).padStart(2, "0");
    let secs = String(time % 60).padStart(2, "0");

    return `${mins}:${secs}`
}

function start() {
    if (deckTextInput.value == "") {
        return;
    }

    body.requestFullscreen();

    countdown = 3;

    setupContainer.className = "hide";

    gameContainer.className = "blue";
    text.textContent = countdown;
    timer.textContent = "";

    endContainer.className = "hide";
    deckDone.className = "hide";
    results.innerHTML = "";

    let interval = setInterval(() => {
        if (countdown > 1) {
            countdown -= 1;
            text.textContent = countdown;
        } else {
            startGame();
            clearInterval(interval);
        }
    }, 1000);
}

function startGame() {
    seenBlue = false;
    finishedDeck = false;
    gameStarted = true;
    timeRemaining = timerInput.value;
    deckHistory = [];
    deck = deckTextInput.value.split("|").map(x => x.trim()).filter(e => e != "");
    currentCard = rand(0, deck.length);

    text.textContent = deck[currentCard];
    timer.textContent = timeLeftString(timeRemaining);

    timerInterval = setInterval(function () {
        timeRemaining -= 1;
        timer.textContent = timeLeftString(timeRemaining);
        if (timeRemaining == 0) {
            end();
        }
    }, 1000);
}

function end() {
    document.exitFullscreen();
    gameStarted = false;
    clearInterval(timerInterval);

    gameContainer.className = "blue hide";

    endContainer.className = "";
    deckDone.className = finishedDeck ? "" : "hide";
    let numCorrect = 0;
    for (card of deckHistory) {
        if (card.moveOnType == "correct") {
            let elem = results.appendChild(document.createElement("div"));
            elem.appendChild(document.createTextNode(card.text));
            elem.className = "greentext";
            numCorrect += 1;
        } else {
            let elem = results.appendChild(document.createElement("div"));
            elem.appendChild(document.createTextNode(card.text));
            elem.className = "redtext";
        }
    }
    correct.textContent = `Correct: ${numCorrect}`;
}

function rand(min, max) {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled);
}

for (presetName of Object.keys(presets)) {
    let option = presetSelection.appendChild(document.createElement("option"));
    option.value = presetName;
    option.appendChild(document.createTextNode(presetName));
}
presetSelection.value = "Sweet Treats";
deckTextInput.value = presets[presetSelection.value];

presetSelection.addEventListener("change", function (s) {
    deckTextInput.value = presets[presetSelection.value];
})

startButton.addEventListener("click", start);

mainMenu.addEventListener("click", function () {
    gameContainer.className = "blue hide";
    endContainer.className = "hide";
    setupContainer.className = "";
});

playAgain.addEventListener("click", start);

window.addEventListener("deviceorientation", handleOrientation, true);
document.addEventListener("keydown", function (e) {
    if (!gameStarted) {
        return;
    }

    if (e.code === "KeyX") {
        gameContainer.className = "red"
        setTimeout(function () {
            gameContainer.className = "blue"
        }, 300);
        moveOn("skip")
    } else if (e.code === "KeyC") {
        gameContainer.className = "green"
        setTimeout(function () {
            gameContainer.className = "blue"
        }, 300);
        moveOn("correct")
    }
}, false);

