class Player {
    playerDomElement;
    playerHeightPercentage;
    playerWidthPercentage;
    playerBounding;
    normalSpeed = 4;
    direction;

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
    }

    increaseSpeed() {
        this.currentSpeed = this.normalSpeed + 3
    }
}