class dynamicItemsManager {
    currentDynamicItems = {}
    numInPathPositionLeftRange;
    generateItemsTimeout;
    pathsCount;
    currentInstance;

    prepareItemByType = {
        "REGULAR_NUM": this.prepateRegularNum,
        "OBSTACLE": this.prepateObstacle,
        "GOLD": this.prepareGoldNum
    }

    constructor(pathsCount, numInPathPositionLeftRange) {
        this.pathsCount = pathsCount;
        this.numInPathPositionLeftRange = numInPathPositionLeftRange
        this.currentInstance = this;
        this.generateNewNumberItem = this.generateNewNumberItem.bind(this); 
    }

    initTimeout() {
       this.generateItemsTimeout = setTimeout(this.generateNewNumberItem, 400);
    }

    stopTimeout() {
        clearTimeout(this.generateItemsTimeout);
    }

    randomizeItemType() {
        var d = Math.random();
        if (d < 0.5)
            // 50% chance of being here
            return "REGULAR_NUM"
        else if (d < 0.7)
            // 20% chance of being here
            return "OBSTACLE"
        else
            // 30% chance of being here
            return "GOLD"
    }

    generateNewNumberItem() {
        if(!animationAllowed)
            return;
    
      const newDynamicItem = {
        path: randomIntFromInterval(1, this.pathsCount),
        type: this.currentInstance.randomizeItemType(),
        id: uuidv4()
      }
      
      this.prepareItemByType[newDynamicItem.type](newDynamicItem);
      this.currentDynamicItems[newDynamicItem.id] = newDynamicItem;

      const htmlItem = `<div style="left: ${randomIntFromInterval(numInPathPositionLeftRange[0], numInPathPositionLeftRange[1])}%"
                            item-id="${newDynamicItem.id}" 
                            id="${newDynamicItem.id}"
                            class='fallingNumber noselect ${newDynamicItem.class}'>${newDynamicItem.displayValue}<div>`
      
      // print to screen
      document.getElementsByClassName('path')[newDynamicItem.path - 1].insertAdjacentHTML( 'beforeend', htmlItem );
      this.currentDynamicItems[newDynamicItem.id].htmlElement = document.getElementById(newDynamicItem.id);
      this.generateItemsTimeout = setTimeout(this.generateNewNumberItem.bind(this), 1000);
    }

    prepateRegularNum(item) {
        const isPlus = randomIntFromInterval(1, 2) == 1
        item.operator = isPlus ? "plus" : "minus";
        item.numericValue = randomIntFromInterval(1, 10)
        item.displayValue = `${isPlus ? "+" : "-"}${item.numericValue}`
    }

    prepareGoldNum(item) {
        item.numericValue = targetNumber - aggregatedValue
        const isPlus = item.numericValue > 0
        item.operator = isPlus ? "plus" : "minus";
        item.numericValue = Math.abs(item.numericValue)
        item.displayValue = `${isPlus ? "+" : "-"}${item.numericValue}`
        // TODO: emit event
        //moves++;
        item.class = "gold";
    }

    prepateObstacle(item) {
        item.numericValue = 0
        item.displayValue = ``
        // TODO: emit event
        //moves++;
        item.class = "obstacle";
    }

    removeItemById(item) {
        if(item.htmlElement)
            item.htmlElement.remove()
        
        delete this.currentDynamicItems[item.id]
    }

    removeAll() {
        document.querySelectorAll('.fallingNumber').forEach(i => i.remove()); 
        this.currentDynamicItems = {}
    }

    getIdFromHtmlElement(htmlElement) {
        return htmlElement.getAttribute("item-id")
    }

    getDynamicItemById(id) {
        return this.currentDynamicItems[id]
    }

    getAllItems() {
        return Object.values(this.currentDynamicItems)
    }
}