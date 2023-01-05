// TODO: change "50" to be not hardcoded and think about
// how to implement it better in terms of now the game is
// from number X to 0, so the target num will always be 0
// but maybe we should have instead a var for "startingFrom" which is 50
const gestureManagerInstance = new gestureManager()
var dynamicItemsManagerInstance;
var progressBarInstance = new ProgressBarManager();

var gameLoopInterval;
var generateItemsTimeout;

const pathNum = 4;
const numInPathPositionLeftRange = [11,25];
const playerBottom = 22;
const GAME_OVER_INTERVAL_VALUE = 31000;

var gameOverCountDown = GAME_OVER_INTERVAL_VALUE / 1000
var playerDirection = ""
var animationAllowed = true;
var aggregatedValue = 50;
var moves = 0;
var coins = 0;
var speedOfFallingFactor = 1;
var gameScreenWidth;
var playerHeightPercentage;
var playerWidthPercentage;
var currentPath = 0;
var gameOverTimeout;

var player;
var playerBounding;
var targetNumber;
var gameScreenHeight; 

function gameLoop() {
    if(!animationAllowed || !player)
        return;
    
    var currentPlayerLeft = parseFloat(player.style.left);
    if(playerDirection && player) {
        const toRight = playerDirection == "right";
        if((!toRight && currentPlayerLeft > -20) || (toRight && currentPlayerLeft < 84)) 
        {
            const newLeftValue = toRight ? currentPlayerLeft + 7 : currentPlayerLeft - 7
            player.style.left = `${newLeftValue}%`;
            currentPlayerLeft = newLeftValue;
        }
    }

    playerBounding = player.getBoundingClientRect();

    dynamicItemsManagerInstance.getAllItems().forEach(function(currentDynamicItem) {

        const itemBoundries = currentDynamicItem.htmlElement.getBoundingClientRect()
        var itemTop = itemBoundries.top / gameScreenHeight * 100; 

        // if item overlap screen, remove it
        if(itemTop > 100) {
            dynamicItemsManagerInstance.removeItemById(currentDynamicItem)
            return;
        }
        if(isCollide(currentDynamicItem.htmlElement, player)) {        
            moves++;
            // if(currentDynamicItem.type == "OBSTACLE") {
            //     return;
            // }

            const isReachedTargetNum = calculateAggreatedValue(currentDynamicItem);
            dynamicItemsManagerInstance.removeItemById(currentDynamicItem)

            // animation
            if(isReachedTargetNum) {
                gestureManagerInstance.showCoinsGesture(itemBoundries.top, itemBoundries.left);
                return;
            }
            const gestureText = currentDynamicItem.type == "OBSTACLE" ? `+${currentDynamicItem.numericValue}` : null,
                  gestureCustomClass = currentDynamicItem.type == "OBSTACLE" ? `red-text` : null

            gestureManagerInstance.showCollidionGesture(currentDynamicItem.htmlElement, 
                    itemBoundries.top, 
                    itemBoundries.left, 
                    gestureText, 
                    gestureCustomClass)
        }
    });
}

function isCollide(a, b) {
    var aRect = a.getBoundingClientRect();
    var bRect = b.getBoundingClientRect();

    return !(
        ((aRect.top + aRect.height) < (bRect.top)) ||
        (aRect.top > (bRect.top + bRect.height)) ||
        ((aRect.left + aRect.width) < bRect.left) ||
        (aRect.left > (bRect.left + bRect.width))
    );
}

function calculateAggreatedValue(item) {
    const operator = item.operator,
          numericValue = item.numericValue;

    if(operator === "plus")
        aggregatedValue += numericValue
    else
        aggregatedValue -= numericValue
        
    return calcAndPrintAggreatedValue();    
}

function calcAndPrintAggreatedValue(animationValue) {
    var isReachedTheTargetNumber = false;
    if(aggregatedValue == targetNumber) {
        gestureManagerInstance.showGestureAnimation();
        increaseCoins();
        reset();
        isReachedTheTargetNumber = true;
    }

    // updateIndicationLabels(aggregatedValue)
    progressBarInstance.updateProgress(aggregatedValue)
    // showAddedAnimation(animationValue)
    return isReachedTheTargetNumber;
}

function updateIndicationLabels(aggregatedValue) {
    document.getElementById("currentCount").innerHTML = aggregatedValue
    document.getElementById("currentVal").innerHTML = aggregatedValue
}

function showAddedAnimation(value) {
    document.getElementById("indication").innerHTML = value
    setTimeout(() => {
        document.getElementById("indication").innerHTML = ""
    }, 1000)

}

function increaseCoins() {
    coins++;
    const coinsElement = document.getElementById("cointCounter")
    coinsElement.innerHTML = coins;

    if(coinsElement.classList.contains("hidden"))
        coinsElement.classList.remove("hidden")
}

function stopAnimation() {
    animationAllowed = false;
}

function keepAnimation() {
    animationAllowed = true;
}

function generateNewTargetNumber() {
    targetNumber = randomIntFromInterval(10, 14);
    targetNumber = 0;
    aggregatedValue = 50;
    document.getElementById('target-num').innerHTML = targetNumber;
}


function checkKey(e) {

    e = e || window.event;

    if (e.keyCode == '38') {
        // up arrow
    }
    else if (e.keyCode == '40') {
        // down arrow
    }
    else if (e.keyCode == '37') {
        movePlayer("left");
       // left arrow
    }
    else if (e.keyCode == '39') {
        movePlayer("right");
       // right arrow
    }

}

function movePlayer(direction) {
    player.setAttribute("path", direction);
    // const left = (((pathIdx + 1) * pathSize) + ((pathIdx) * pathSize)) / 2
    // player.style.left = `${left - 5}%`;
    playerDirection = direction
}

function startup() {
    generateNewTargetNumber();
    calcAndPrintAggreatedValue(0)
    player = document.getElementById("player");
    player.style.bottom = playerBottom + "%"

    playerBounding = player.getBoundingClientRect();
    player.setAttribute("top", playerBounding.top);
    gameScreenHeight = parseInt(document.getElementById('gameScreen').getBoundingClientRect().height);
    gameScreenWidth = parseInt(document.getElementById('container').getBoundingClientRect().width);
    playerHeightPercentage = playerBounding.height/gameScreenHeight*100
    playerWidthPercentage = playerBounding.width/gameScreenWidth*100
    coins = 0;
    progressBarInstance.init(targetNumber);

    const gameScreenXCenter = gameScreenWidth / 2;

    document.onkeydown = checkKey;
    document.addEventListener("visibilitychange", function() {
        animationAllowed = !document.hidden;
    });
    document.addEventListener("touchstart", function(e) {
        if(e.touches[0].clientX > gameScreenXCenter) {
            checkKey({keyCode: '39'}) // right
        }
        else {
            checkKey({keyCode: '37'}) // left
        }
    });
}

function reset() {
    generateNewTargetNumber();
    moves = 0;
    aggregatedValue = 50;
    clearTimeout(gameOverTimeout);
    gameOverTimeout = setTimeout(gameOver, GAME_OVER_INTERVAL_VALUE);
    gameOverCountDown = GAME_OVER_INTERVAL_VALUE / 1000;
    dynamicItemsManagerInstance.removeAll();
    progressBarInstance.reset(targetNumber)
}

function stop() {
    animationAllowed = false
    clearInterval(gameLoopInterval);
    clearInterval(generateItemsInterval)
}

function startGame() {
    setTimeout(startup, 200)
    document.getElementById("welcome").classList.add("hidden");
    gameLoopInterval = setInterval(gameLoop, 50);
    //generateItemsTimeout = setTimeout(generateNewNumberItem, 400);
    dynamicItemsManagerInstance = new dynamicItemsManager(pathNum, numInPathPositionLeftRange)
    dynamicItemsManagerInstance.initTimeout();
    //gameOverTimeout = setTimeout(gameOver, GAME_OVER_INTERVAL_VALUE);
    gameOverInterval = setInterval(countDownToGameOver, 1000)
}

function gameOver() {
    dynamicItemsManagerInstance.stopTimeout();
    clearInterval(gameLoopInterval);
    clearInterval(gameOverInterval)
    const gameOverElement = document.getElementById("gameOver");
    gameOverElement.classList.remove("hidden")
}

function tryAgain() {
    const gameOverElement = document.getElementById("gameOver");
    gameOverElement.classList.add("hidden")
    startGame();
}

function countDownToGameOver() {
    const clockElement = document.getElementById("clock");
    clockElement.innerHTML = adjustGameOverCounterText(--gameOverCountDown);
    if(gameOverCountDown === 0) {
        gameOver()
        clockElement.classList.add("blink")
    }
}

function adjustGameOverCounterText(countValue) {
    var text = "00:"
    if(countValue >= 10)
        return text + countValue
    
    return text + "0" + countValue;
}