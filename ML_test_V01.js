const MILA = new Object(null)

MILA.STANDARDISE = function(vitals) {
    const MEAN_SD = [[36.8, 0.2], //BT
                     [112, 2],    //BP
                     [80, 10],   //HR
                     [12, 1]]     //RR
    
    for (let i = 0; i < 4; i++) {
        vitals[i] = (vitals[i] - MEAN_SD[i][0]) / MEAN_SD[i][1]
    }
    return vitals
}

MILA.MODEL = function(x, age, param) {
    const output = new Object()
    age = age/10
    for (const model in param) {
        w = param[model]
        output[model] = w[0][0]*x[0]**w[0][1] + w[1][0]*x[1]**w[1][1] + w[2][0]*x[2]**w[2][1] + w[3][0]*x[3]**w[3][1] + w[4]*age + w[5]
    }
    return output
}

MILA.PARAM = {HEART: [[ 0,1], [ 5,1], [ 1,1], [-1,1], 0, -2],
              SKIN:  [[ 0,1], [ 5,1], [-1,1], [ 0,1], 0, -5],
              CANCER:[[ 1,2], [ 1,2], [ 1,2], [ 1,1], 0, -50],
              FLU:   [[ 1,2], [ 1,2], [ 1,2], [ 1,1], 0, -2],}

let vitals = [37.8, 113, 90, 12]
let age = 30

console.log(MILA.MODEL(MILA.STANDARDISE(vitals), age, MILA.PARAM))