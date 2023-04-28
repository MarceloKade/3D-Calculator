class CalcController {

    constructor() {

        this._audio = new Audio('click.mp3');
        this._audioOnOff = false;
        this._lastOperator = '';
        this._lastNumber = '';
        this._operation = [];
        this._displayCalcEl = document.querySelector(".value")
        this.initialize();
        this.initButtonsEvents();
        this.initKeyboard();

    }

    initialize() {

        this.setLastNumberToDisplay();
        document.querySelectorAll('div > h3').forEach(btn => {
            btn.addEventListener('dblclick', e => {

                this.toggleAudio();

            });
        });

    }

    toggleAudio() {

        this._audioOnOff = !this._audioOnOff

    }

    playAudio() {

        if (this._audioOnOff) {

            this._audio.currentTime = 0;
            this._audio.play();

        }

    }

    initKeyboard() {

        document.addEventListener('keyup', e => {

            this.playAudio();

            switch (e.key) {

                case 'Escape':
                    this.clearAll();
                    break;

                case 'Backspace':
                    this.clearEntry();
                    break;

                case '+':
                case '-':
                case '÷':
                case 'x':
                case '%':
                    this.addOperation(e.key);
                    break;

                case '.':
                case ',':
                    this.addDot();
                    break;

                case 'Enter':
                case '=':
                    this.calc();
                    break;

                case '0':
                case '1':
                case '2':
                case '3':
                case '4':
                case '5':
                case '6':
                case '7':
                case '8':
                case '9':
                    this.addOperation(parseInt(e.key));
                    break;

            }


        })

    }

    addEventListenerAll(element, events, fn) {
        events.split(' ').forEach(event => {
            element.addEventListener(event, fn, false);
        });
    }

    clearAll() {

        this._operation = [];
        this._lastNumber = '';
        this._lastOperator = '';

        this.setLastNumberToDisplay();

    }

    clearEntry() {

        this._operation.pop();
        this.setLastNumberToDisplay();

    }

    getLastOperation() {

        return this._operation[this._operation.length - 1];

    }

    setLastOperation(value) {

        this._operation[this._operation.length - 1] = value;

    }

    isOperator(value) {

        return (['+', '-', '*', '%', '/'].indexOf(value) > -1);

    }

    pushOperation(value) {

        this._operation.push(value);

        if (this._operation.length > 3) {

            this.calc();

        }

    }

    getResult() {

        try {
            return eval(this._operation.join(""));
        } catch (e) {

            setTimeout(() => {
                this.setError();
            }, 1)

        }
    }

    calc() {

        let last = '';

        this._lastOperator = this.getLastItem();

        if (this._operation.length < 3) {

            let firstItem = this._operation[0];
            this._operation = [firstItem, this._lastOperator, this._lastNumber];

        }

        if (this._operation.length > 3) {
            last = this._operation.pop();

            this._lastNumber = this.getResult();
        } else if (this._operation.length == 3) {
            this._lastNumber = this.getLastItem(false);
        }

        let result = this.getResult();


        if (last == '%') {

            result /= 100;

            this._operation = [result];

        } else {

            this._operation = [result];

            if (last) {
                this._operation.push(last);
            }


        }



        this.setLastNumberToDisplay();


    }

    getLastItem(isOperator = true) {

        let lastItem;

        for (let i = this._operation.length - 1; i >= 0; i--) {

            if (this.isOperator(this._operation[i]) == isOperator) {
                lastItem = this._operation[i];
                break;
            }
        }

        if (!lastItem) {

            lastItem = (isOperator) ? this._lastOperator : this._lastNumber;

        }

        return lastItem;
    }

    setLastNumberToDisplay() {

        let lastNumber = this.getLastItem(false);

        if (!lastNumber) lastNumber = 0;

        this.displayCalc = lastNumber;

    }

    addOperation(value) {

        if (isNaN(this.getLastOperation())) {

            if (this.isOperator(value)) {

                this.setLastOperation(value);


            } else if (isNaN(value)) {


            } else {

                this.pushOperation(value);

                this.setLastNumberToDisplay();

            }

        } else {

            if (this.isOperator(value)) {

                this.pushOperation(value);

            } else {

                let newValue = this.getLastOperation().toString() + value.toString();
                this.setLastOperation(newValue);

                this.setLastNumberToDisplay();

            }

        }
    }

    setError() {

        this.displayCalc = "Error";
    }

    addDot() {

        let lastOperation = this.getLastOperation();

        if (typeof lastOperation === 'string' && lastOperation.split('').indexOf('.') > -1) return;

        if (this.isOperator(lastOperation) || !lastOperation) {

            this.pushOperation('0.');

        } else {

            this.setLastOperation(lastOperation.toString() + '.');

            this.setLastNumberToDisplay();

        }

    }

    execBtn(value) {

        this.playAudio();

        switch (value) {

            case 'AC':
                this.clearAll();
                break;

            case 'CE':
                this.clearEntry();
                break;

            case '+':
                this.addOperation('+');
                break;

            case '-':
                this.addOperation('-');
                break;

            case '÷':
                this.addOperation('/');
                break;

            case 'x':
                this.addOperation('*');
                break;

            case '%':
                this.addOperation('%');
                break;

            case '.':
                this.addDot();
                break;

            case '=':
                this.calc();
                break;

            case '0':
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':
                this.addOperation(parseInt(value));
                break;

            default:
                this.setError();
                break;

        }
    }

    initButtonsEvents() {
        let buttons = document.querySelectorAll("main > div > h3");

        buttons.forEach((btn, index) => {
            this.addEventListenerAll(btn, 'click drag', e => {
                const textBtn = btn.textContent;
                this.execBtn(textBtn);
            })
        })
    }

    get displayCalc() {

        return this._displayCalcEl.innerHTML;
    }

    set displayCalc(value) {

        if (value.toString().length > 7) {
            this.setError();
            return false;
        }

        this._displayCalcEl.innerHTML = value;
    }
}