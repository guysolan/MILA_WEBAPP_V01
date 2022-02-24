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
                [112, 20], //BP
                [80, 30], //HR
                [12, 5]] //RR

MILA.STANDARDISE = function(vitals, MEAN_SD) {  
    for (let i = 0; i < 4; i++) {
        vitals[i] = (vitals[i] - MEAN_SD[i][0]) / MEAN_SD[i][1]
    }
    return vitals
}

MILA.MODEL = function(x, age, param) {
    const output = new Object()
    age = age/10
    for (const model in param) {
        const w = param[model].weight
        const p = param[model].power
        output[model] = w[0]*(x[0]**p[0]) + w[1]*(x[1]**p[1]) + w[2]*(x[2]**p[2]) + w[3]*(x[3]**p[3]) + w[4]*age + w[5]
    }
    return output
}

MILA.TRUE_PARAM = {CARDIOVASCULAR:   {weight: [ 0,  4,  1, -1,  1, -100], power: [1, 1, 1, 1]}, //BT, BP, HR, RR, Age, C
                   DERMATOLOGY:      {weight: [ 5,  0, -1,  2,  1, -100], power: [2, 1, 1, 1]},
                   INFECTION:        {weight: [ 5,  0,  0,  2,  1, -150], power: [1, 1, 1, 2]},
                   RESPIRATORY:      {weight: [ 0, -1,  0,  5,  1, -350], power: [1, 1, 1, 2]},
                   METABOLIC:        {weight: [ 1,  2,  2,  5,  1, -150], power: [1, 1, 2, 1]},
                   GASTROINTESTINAL: {weight: [-1, -1,  1,  2,  1, -300], power: [2, 1, 1, 2]}}

MILA.PARAM = {CARDIOVASCULAR:   {weight: [ 0.1,  3.9,  0, -1.5,  0.9, -110], power: [1, 1, 1, 1]}, //BT, BP, HR, RR, Age, C
              SKIN:             {weight: [ 5.2,  0.1, -1,  2,  .9, -110], power: [2, 1, 1, 1]},
              INFECTION:        {weight: [ 4,  0,  0,  2,  1, -190], power: [1, 1, 1, 2]},
              RESPIRATORY:      {weight: [ -.1, -1,  0,  4.9,  1.1, -370], power: [1, 1, 1, 2]},
              METABOLIC:        {weight: [ 1.5,  2,  2,  4,  1, -150], power: [1, 1, 2, 1]},
              GASTROINTESTINAL: {weight: [-1, -1.3,  1,  2,  1.1, -330], power: [2, 1, 1, 2]}}

export default Object.freeze(MILA)