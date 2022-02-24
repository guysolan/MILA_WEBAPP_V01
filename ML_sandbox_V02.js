import MILA from './ML_test_V02.js'

let local_param = {CARDIOVASCULAR:   {weight: [ 0,  0,  0,  0,    0, -1], power: [1, 1, 1, 1]}, //BT, BP, HR, RR, Age, C
                   DERMATOLOGY:      {weight: [ 0,  0,  0,  0,    0, -1], power: [2, 1, 1, 1]},
                   INFECTION:        {weight: [ 0,  0,  0,  0,    0, -1], power: [1, 1, 1, 1]},
                   RESPIRATORY:      {weight: [ 0,  0,  0,  0,    0, -1], power: [1, 1, 1, 2]},
                   METABOLIC:        {weight: [ 0,  0,  0,  0,    0, -1], power: [1, 1, 1, 1]},
                   GASTROINTESTINAL: {weight: [ 0,  0,  0,  0,    0, -1], power: [1, 1, 1, 1]}}

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

function generate_vitals() {
    const modify = 1
    return [gaussian(MILA.MEAN_SD[0][0], MILA.MEAN_SD[0][1]/modify),
            gaussian(MILA.MEAN_SD[1][0], MILA.MEAN_SD[1][1]/modify),
            gaussian(MILA.MEAN_SD[2][0], MILA.MEAN_SD[2][1]/modify),
            gaussian(MILA.MEAN_SD[3][0], MILA.MEAN_SD[3][1]/modify)] 
}

const age = gaussian(40, 10)
const vitals = generate_vitals()
const diagnoses = MILA.MODEL(vitals, age, MILA.TRUE_PARAM)

for (const model in diagnoses) {diagnoses[model] = Math.max(diagnoses[model], 0)}

console.log(diagnoses)