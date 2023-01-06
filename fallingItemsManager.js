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

    randomizePath() {
        var d = Math.random();
        if (d < 0.5)
            // 50% chance of being here
            return 1

         return 2    
        // else if (d < 0.8)
        //     return 2
        // else if (d < 0.9)
        //     return 3
        // else {
        //     return 4
        // }
    }

    randomizeItemType() {
        var d = Math.random();
        if (d < 0.5)
            // 50% chance of being here
            return "REGULAR_NUM"
        else if (d < 0.9)
            return "OBSTACLE"
        else {
            return "GOLD"
        }
    }

    createDynamicItems() {
        var items = []
        for (let path = 1; path <= this.pathsCount; path++) {
            const item = {
                path,
                type: this.currentInstance.randomizeItemType(),
                id: uuidv4()
            }

            this.prepareItemByType[item.type](item);
            
            items.push(item)
        }

        return items;
    }

    generateNewNumberItem() {
        if(!animationAllowed)
            return;
    
        const newItemsPerPath = shuffle(this.createDynamicItems());
        const numOfItemsToPrint = this.randomizePath() - 1;
        for (let itemIdx = 0; itemIdx < newItemsPerPath.length; itemIdx++) {
            if(itemIdx > numOfItemsToPrint) {
                delete newItemsPerPath[itemIdx];
                continue;
            }
            const newDynamicItem = newItemsPerPath[itemIdx]
            const htmlItem = `<div style="left: ${randomIntFromInterval(numInPathPositionLeftRange[0], numInPathPositionLeftRange[1])}%"
                                    item-id="${newDynamicItem.id}" 
                                    id="${newDynamicItem.id}"
                                    class='fallingNumber noselect ${newDynamicItem.class}'>${newDynamicItem.displayValue}<div>`

            // print to screen
            document.getElementsByClassName('path')[newDynamicItem.path - 1].insertAdjacentHTML( 'beforeend', htmlItem );

            // Save in local cache
            newDynamicItem.htmlElement = document.getElementById(newDynamicItem.id);
            this.currentDynamicItems[newDynamicItem.id] = newDynamicItem;
        }
      
      this.generateItemsTimeout = setTimeout(this.generateNewNumberItem.bind(this), 800);
    }

    prepateRegularNum(item) {
        const isPlus = false // randomIntFromInterval(1, 2) == 1
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
        item.numericValue = 5
        item.operator = "plus"
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