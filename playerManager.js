class Player {
    player; // DOM element
    playerHeightPercentage;
    playerWidthPercentage;
    playerBounding;
    bottom = 22;
    normalSpeed = 4;
    direction;
    directionClasses = {
        left: "player-to-left",
        right: "player-to-right"
    }

    init(gameScreenHeight, gameScreenWidth) {
        this.player = document.getElementById("player");
        this.player.style.bottom = this.bottom + "%"
        this.playerBounding = this.player.getBoundingClientRect();
        this.player.setAttribute("top", this.playerBounding.top);
        this.playerHeightPercentage = this.playerBounding.height/gameScreenHeight*100
        this.playerWidthPercentage = this.playerBounding.width/gameScreenWidth*100
    }

    setDirection(direction) {
        if(this.direction == direction) {
            this.increaseSpeed()
            return;
        }

        this.direction = direction
        this.player.className = ""
        this.player.classList.add(this.directionClasses[direction])
    }

    increaseSpeed() {
        this.currentSpeed = this.normalSpeed + 3

        // todo: just change tranistion-duration
        // document.getElementById("player").style["-webkit-animation-duration"] = newSpeedNumeric + "s";
    }
}