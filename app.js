var gameLoopInterval;
var generateItemsTimeout;

const pathSize = 24;
const pathNum = 4;
const numInPathPositionLeftRange = [36,39];
const playerBottom = 35;
const gestures = ["Amazing", "Great", "Awesome", "Well Done", "WOW"];
const gesturesClasses = ["zoomIn", "zoomOutLeft", "zoomOutUp", "rotateOut"];

var playerDirection = ""
var animationAllowed = true;
var aggregatedValue = 0;
var moves = 0;
var speedOfFallingFactor = 1;
var gameScreenWidth;

var currentPath = 0;

var player;
var playerBounding;
var targetNumber;
var gameScreenHeight; 

function gameLoop() {
    if(!animationAllowed || !player)
        return;
    
    const currentPlayerLeft = parseFloat(player.style.left);
    if(playerDirection && player) {
        const toRight = playerDirection == "right";
        if((!toRight && currentPlayerLeft >= 0) || (toRight && currentPlayerLeft <= 100)) 
        {
            player.style.left = toRight ? `${currentPlayerLeft + 5}%` : `${currentPlayerLeft - 5}%`;
        }
    }

    document.querySelectorAll('.fallingNumber').forEach(function(button) {
        var itemTop = parseFloat(button.style.top.slice(0,-1)) || 0;
        itemTop = itemTop + speedOfFallingFactor + '%';
        button.style.top = itemTop;
        itemTop = parseFloat(button.style.top.slice(0,-1));

        // if item overlap screen, remove it
        if(itemTop > 100) {
            button.remove();
            return;
        }

        var itemLeft = (button.getBoundingClientRect().left * 100) / gameScreenWidth
        playerBounding = player.getBoundingClientRect();
        // todo: check collusion also when chaning path (left attr) !!!!
        //else if((itemTop <= 100 - playerBottom && itemTop >= 100 - playerBottom - 12) 
        if((itemTop <= 100 - playerBottom && itemTop >= 100 - playerBottom - 18)  && 
            (itemLeft <= currentPlayerLeft + 15 && itemLeft > currentPlayerLeft)) {
            console.log("hit!!! " + button.innerHTML)
            moves++;
            calculateAggreatedValue(button.textContent);
            button.remove();
        }
    });
}

function calculateAggreatedValue(value) {
    const operator = value[0];
    const numVal = parseInt(value.substring(1))
    if(operator === "+")
        aggregatedValue += numVal
    else
        aggregatedValue -= numVal
        
    calcAndPrintAggreatedValue(value);    
}

function calcAndPrintAggreatedValue(animationValue) {
    if(aggregatedValue == targetNumber) {
        // alert("Win!!!")
        // alert("took you just " + moves + " moves")
        showGestureAnimation();
        reset();
    }

    document.getElementById("currentCount").innerHTML = aggregatedValue
    document.getElementById("currentVal").innerHTML = aggregatedValue
    showAddedAnimation(animationValue)
}

function showAddedAnimation(value) {
    document.getElementById("added").innerHTML = value
    setTimeout(() => {
        document.getElementById("added").innerHTML = ""
    }, 1000)

}

function generateNewNumberItem() {
    if(!animationAllowed)
        return;

  const toPath = randomIntFromInterval(1, pathNum)
  var rndInt = randomIntFromInterval(1, 10)
  var isPlus = randomIntFromInterval(1, 2) == 1
  var isGold = false;
  if(moves > 0 && moves % 3 === 0) {
    rndInt = targetNumber - aggregatedValue
    isPlus = rndInt > 0
    rndInt = Math.abs(rndInt)
    isGold = true;
    moves++;
  }
  const htmlItem = `<div style="left: ${randomIntFromInterval(numInPathPositionLeftRange[0], numInPathPositionLeftRange[1])}%" 
                        operator="${isPlus ? "plus" : "minus"}" 
                        path="${toPath - 1}" 
                        class='fallingNumber ${isGold ? "gold" : ""}'>${isPlus ? "+" : "-"}${rndInt}<div>`
  
  // print to screen
  document.getElementsByClassName('path')[toPath - 1].insertAdjacentHTML( 'beforeend', htmlItem );
  const movesFactor = 0;
  
  generateItemsTimeout = setTimeout(generateNewNumberItem, randomIntFromInterval(600 - movesFactor, 1200 - movesFactor));
}

function randomIntFromInterval(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min)
}

function stopAnimation() {
    animationAllowed = false;
}

function keepAnimation() {
    animationAllowed = true;
}

function generateNewTargetNumber() {
    targetNumber = randomIntFromInterval(10, 14);
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
    player.setAttribute("top", player.getBoundingClientRect().top);
    playerBounding = player.getBoundingClientRect();
    gameScreenHeight = parseInt(document.getElementById('gameScreen').getBoundingClientRect().height);
    gameScreenWidth = parseInt(document.getElementById('container').getBoundingClientRect().width);
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
    aggregatedValue = 0;
    document.querySelectorAll('.fallingNumber').forEach(i => i.remove()); 
}

function stop() {
    animationAllowed = false
    clearInterval(gameLoopInterval);
    clearInterval(generateItemsInterval)
}

function showGestureAnimation() {
    const gestureElement = document.getElementById("gesture")
    gestureElement.innerHTML = gestures[randomIntFromInterval(0, gestures.length - 1)];
    const animationClass = gesturesClasses[randomIntFromInterval(0, gesturesClasses.length)]
    gestureElement.classList.add(animationClass)
    setTimeout(() => { 
        gestureElement.innerHTML = "";
        gestureElement.classList.remove(animationClass)
     }, 1200)
}

function startGame() {
    setTimeout(startup, 200)
    document.getElementById("welcome").classList.add("hidden");
    gameLoopInterval = setInterval(gameLoop, 50);
    generateItemsTimeout = setTimeout(generateNewNumberItem, 1000);
}