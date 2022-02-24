import MILA from './ML_test.js'

function gaussian(mean, stdev) {
    let y2;
    let use_last = false;
    let y1;
    if (use_last) {
        y1 = y2;
        use_last = false;
    } else {
        let x1, x2, w;
        do {
            x1 = 2.0 * Math.random() - 1.0;
            x2 = 2.0 * Math.random() - 1.0;
            w = x1 * x1 + x2 * x2;
        } while (w >= 1.0);
        w = Math.sqrt((-2.0 * Math.log(w)) / w);
        y1 = x1 * w;
        y2 = x2 * w;
        use_last = true;
    }

    let retval = mean + stdev * y1;
    if (retval > 0)
        return retval;
    return -retval;
}

let local_param = {CARDIOVASCULAR:   {weight: [ 0.1,  3.9,  0, -1.5,  0.9, -110], power: [1, 1, 1, 1]}, //BT, BP, HR, RR, Age, C
                   SKIN:             {weight: [ 5.2,  0.1, -1,  2,  .9, -110], power: [2, 1, 1, 1]},
                   INFECTION:        {weight: [ 4,  0,  0,  2,  1, -190], power: [1, 1, 1, 2]},
                   RESPIRATORY:      {weight: [ -.1, -1,  0,  4.9,  1.1, -370], power: [1, 1, 1, 2]},
                   METABOLIC:        {weight: [ 1.5,  2,  2,  4,  1, -150], power: [1, 1, 2, 1]},
                   GASTROINTESTINAL: {weight: [-1, -1.3,  1,  2,  1.1, -330], power: [2, 1, 1, 2]}}          

function generate_vitals() { 
    return [gaussian(MILA.MEAN_SD[0][0], MILA.MEAN_SD[0][1]/5),
            gaussian(MILA.MEAN_SD[1][0], MILA.MEAN_SD[1][1]/5),
            gaussian(MILA.MEAN_SD[2][0], MILA.MEAN_SD[2][1]/5),
            gaussian(MILA.MEAN_SD[3][0], MILA.MEAN_SD[3][1]/5)] 
}

local_param = MILA.TRUE_PARAM

const data_length = 1000
const age = new Array(data_length)
const vitals = new Array(data_length)
const diagnoses = new Array(data_length)

for (let i = 0; i < data_length; i++) {
    vitals[i] = generate_vitals()
    age[i] = gaussian(40, 10)
    diagnoses[i] = MILA.MODEL(vitals[i], age[i], MILA.TRUE_PARAM)
}

// console.log(vitals)
// console.log(age)
// console.log(diagnoses)

for (let j = 0; j < 1000; j++) {
    for (let i = 0; i < data_length; i++) {
        local_param = MILA.TRAIN(vitals[i], age[i], diagnoses[i], local_param)
    }
}

console.log(local_param)