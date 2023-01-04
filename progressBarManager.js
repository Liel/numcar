class ProgressBarManager {
    bar;
    targetNumber;
    currentValue = 0;

    constructor() {
        this.updateProgress = this.updateProgress.bind(this)
    }

    init(targetNumber) {
        this.targetNumber = targetNumber;
        this.bar = new ProgressBar.SemiCircle(progress, {
            strokeWidth: 6,
            color: '#FFEA82',
            trailColor: '#eee',
            trailWidth: 1,
            easing: 'easeInOut',
            duration: 1400,
            svgStyle: null,
            text: {
              value: '',
              alignToBottom: false
            },
            from: {color: '#FFEA82'},
            to: {color: '#ED6A5A'},
            // Set default step function for all animate calls
            step: (state, bar) => {
              bar.path.setAttribute('stroke', state.color);
              var value = Math.round(bar.value() * 100);
              if (value === 0) {
                bar.setText(``);
              } else {
                const whatLeft = this.targetNumber - this.currentValue
                bar.setText(this.currentValue + "<br /><div id='counter-label'>to make it ZERO!</div>");
              }
          
              bar.text.style.color = state.color;
            }
          });
          this.bar.text.style.fontFamily = '"Raleway", Helvetica, sans-serif';
          this.bar.text.style.fontSize = '2rem';

          this.updateProgress(50)
    }

    generateMessage(leftValue) {
        if(leftValue < 0)
            return "Reduce " + leftValue
        if(leftValue < this.targetNumber)    
            return `${leftValue} more!`

        return 'Let\'s go!'    
    }

    updateProgress(value) {
        if(!this.bar)
            return;
        
        this.currentValue = value;
        this.bar.animate(value / 50);
    }

    reset(targetNumber) {
        this.bar.animate(0);
        this.currentValue = 0;
        this.targetNumber = 50;    
    }
}