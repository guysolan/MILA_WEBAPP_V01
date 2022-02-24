const MILA = new Object(null)

MILA.TRAIN = function(x, age, diagnoses, param) {
    const output = new Object()

    const lr = 0.000001
    
    for (const model in param) {
        const w = param[model].weight
        const p = param[model].power

        const predicted = w[0]*(x[0]**p[0]) + w[1]*(x[1]**p[1]) + w[2]*(x[2]**p[2]) + w[3]*(x[3]**p[3]) + w[4]*age + w[5]
        const result = diagnoses[model]
        const error = predicted - result

        for( let i = 0; i < 4; i++) {
            param[model].weight[1] = w[i] - lr*(x[i]**p[i])*error
        }
        param[model].weight[4] = w[4] - lr*age*error
        param[model].weight[4] = w[5] - lr*error
    }

    return param
}

MILA.MEAN_SD = [[37, 1], //BT
                [112, 30], //BP
                [80, 30], //HR
                [14, 10]] //RR

const STANDARDISE = function(vitals, MEAN_SD) {  
    const output = new Array(4)
    for (let i = 0; i < 4; i++) {
        output[i] = (vitals[i] - MEAN_SD[i][0]) / MEAN_SD[i][1]
    }
    return output
}

MILA.MODEL = function(vitals, age, param) {
    const x = STANDARDISE(vitals, MILA.MEAN_SD)
    const output = new Object()
    age = age/100
    for (const model in param) {
        const w = param[model].weight
        const p = param[model].power
        output[model] = w[0]*(x[0]**p[0]) + w[1]*(x[1]**p[1]) + w[2]*(x[2]**p[2]) + w[3]*(x[3]**p[3]) + w[4]*age + w[5]
    }
    return output
}

MILA.TRUE_PARAM = {CARDIOVASCULAR:   {weight: [ 0,  1,  1,  0,    1, -2], power: [1, 1, 1, 1]}, //BT, BP, HR, RR, Age, C
                   DERMATOLOGY:      {weight: [ 1,  0,  0,  0,    1, -2], power: [2, 1, 1, 1]},
                   INFECTION:        {weight: [ 1,  0,  0,  1,    1, -2], power: [1, 1, 1, 1]},
                   RESPIRATORY:      {weight: [ 0,  0,  0,  1,    1, -2], power: [1, 1, 1, 2]},
                   METABOLIC:        {weight: [ 1,  0,  1,  0,    1, -2], power: [1, 1, 1, 1]},
                   GASTROINTESTINAL: {weight: [-1,  0,  0,  1,    1, -2], power: [1, 1, 1, 1]}}


export default Object.freeze(MILA)