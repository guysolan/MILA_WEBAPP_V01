export default class CCTVs {
  constructor(sensorElem) {
    this.sensorElem = sensorElem
    this.sendingData = false
  }

  rect() {
    return this.sensorElem.getBoundingClientRect()
  }

  // input is an array of one or many peoples appearance/sounds
  sendData(input) {
    this.sendingData = true

    let outout = input

    return outout
  }
}