class Player {
    playerDomElement;
    playerHeightPercentage;
    playerWidthPercentage;
    playerBounding;
    normalSpeed = 4;
    direction;
    directionClasses = {
        left: "player-to-left",
        right: "player-to-right"
    }

    init() {
        this.player = document.getElementById("player");
        this.player.style.bottom = playerBottom + "%"
        this.playerBounding = player.getBoundingClientRect();
        this.player.setAttribute("top", playerBounding.top);
        this.playerHeightPercentage = playerBounding.height/gameScreenHeight*100
        this.playerWidthPercentage = playerBounding.width/gameScreenWidth*100
    }

    moveRight() {

    }

    moveLeft() {

    }

    setDirection(direction) {
        if(this.direction == direction) {
            this.increaseSpeed()
            return;
        }

        this.direction = direction
        this.player.classList.add(this.directionClasses[direction])
        // todo: remove the other class, and make sure app.js sending valid value for this method
    }

    increaseSpeed() {
        this.currentSpeed = this.normalSpeed + 3

        // todo: just change tranistion-duration
        // document.getElementById("player").style["-webkit-animation-duration"] = newSpeedNumeric + "s";
    }
}