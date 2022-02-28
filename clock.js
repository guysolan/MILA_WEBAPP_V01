export default class Clock{
    constructor(dateElem) {
        this.dateElem = dateElem;
    }

    passTime(){
        let currentDay = parseInt(this.dateElem.innerHTML)
        this.dateElem.innerHTML = String(currentDay + 1);
    }
}