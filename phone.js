import phoneFn from "./phoneFn.js"
import CLOUD from "./CLOUD.js"
import * as maths from './maths.js'

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

const BT_ID = document.getElementById('BT')
const BP_ID = document.getElementById('BP')
const HR_ID = document.getElementById('HR')
const RR_ID = document.getElementById('RR')

export default class Phone {
    constructor(personKey) {
        this.SPECS= {
            'storage':[.512,1,2,4][Math.floor(Math.random()*4)],
            'cores':[4,8,16,32][Math.floor(Math.random()*4)],
            'clockSpeed':Math.floor(Math.random()*500+300)/100
        }
        this.drive = {
            'personKey': personKey,
            'video': new Array(),
            'audio': new Array(),
            'vitals': new Array(4)
        }
        this.ALGORITHMS = {
            'humanRecognition': phoneFn.humanRecognition,
            'identify': phoneFn.identify,
            'extractVitals': phoneFn.extractVitals
        }
    }
    space(drive) {
        if (drive == 'video') {return new TextEncoder().encode(this.drive.video).length}
        if (drive == 'audio') {return new TextEncoder().encode(this.drive.audio).length}
        if (drive == 'total') {return new TextEncoder().encode(this.drive.audio).length + new TextEncoder().encode(this.drive.video).length}
    }
    PROCESS_DATA() {
        const find = document.getElementById('find')
        const indentify = document.getElementById('identify')
        const extract = document.getElementById('extract')

        const stdDev = [0.5, 3, 3, 1]
        const modifier = [1000, 100, 100, 1000]

        let recognisedHumans_TEMPSTORAGE = new Array()
        Array.prototype.forEach.call(this.drive.video, (frame, index) => {
            recognisedHumans_TEMPSTORAGE.push(this.ALGORITHMS.humanRecognition(frame))

            //console.log('Finding Faces: ' + Math.round((index/this.drive.video.length)*100) + '%')
            find.innerText = 'Finding Faces: ' + Math.round((index/this.drive.video.length)*100) + '%'
        })

        let data_TEMPSTORAGE = new Array()
        if (recognisedHumans_TEMPSTORAGE.length > 0) {
            recognisedHumans_TEMPSTORAGE.forEach((recognisedHumans, index) => {
                data_TEMPSTORAGE.push(this.ALGORITHMS.identify(this.drive.personKey, recognisedHumans))

                //console.log('Facial Recognition: ' + Math.round((index/recognisedHumans_TEMPSTORAGE.length)*100) + '%')
                indentify.innerText = 'Facial Recognition: ' + Math.round((index/recognisedHumans_TEMPSTORAGE.length)*100) + '%'
            })
        }
        let vitals_TEMPSTORAGE = new Array()
        data_TEMPSTORAGE.forEach((data, index) => {
            if (data) {
                let extractedVitals = this.ALGORITHMS.extractVitals(data, CLOUD.PARAM)
                extractedVitals.forEach((ele, i) => {extractedVitals[i] += (gaussian(100, 0.5)-100)})
                vitals_TEMPSTORAGE.push(extractedVitals)

                //vitals_TEMPSTORAGE.push(this.ALGORITHMS.extractVitals(data, CLOUD.PARAM))
                //console.log('Extracting Vitals: ' + Math.round((index/data_TEMPSTORAGE.length)*100) + '%')
                extract.innerText = 'Extracting Vitals: ' + Math.round((index/data_TEMPSTORAGE.length)*100) + '%'
            }
        })

        recognisedHumans_TEMPSTORAGE = new Array()
        Array.prototype.forEach.call(this.drive.audio, (frame, index) => {
            recognisedHumans_TEMPSTORAGE.push(this.ALGORITHMS.humanRecognition(frame))

            //console.log('Finding Voices: ' + Math.round((index/this.drive.audio.length)*100) + '%')
        })
        data_TEMPSTORAGE = new Array()
        if (recognisedHumans_TEMPSTORAGE.length > 0) {
            recognisedHumans_TEMPSTORAGE.forEach((recognisedHumans, index) => {
                data_TEMPSTORAGE.push(this.ALGORITHMS.identify(this.drive.personKey, recognisedHumans))

                //console.log('Voice Recognition: ' + Math.round((index/recognisedHumans_TEMPSTORAGE.length)*100) + '%')
            })
        }
        data_TEMPSTORAGE.forEach((data, index) => {
            if (data) {
                let extractedVitals = this.ALGORITHMS.extractVitals(data, CLOUD.PARAM)
                extractedVitals.forEach((ele, i) => {extractedVitals[i] += (gaussian(100, 0.5)-100)})
                vitals_TEMPSTORAGE.push(extractedVitals)

                //vitals_TEMPSTORAGE.push(this.ALGORITHMS.extractVitals(data, CLOUD.PARAM))
                //console.log('Extracting Vitals: ' + Math.round((index/data_TEMPSTORAGE.length)*100) + '%')
            }
        })

        this.drive.audio = new Array()
        this.drive.video = new Array()
        
        const vitals_TEMP = [[0,0],[0,0],[0,0],[0,0]]

        vitals_TEMPSTORAGE.forEach((vitals) => {
            vitals_TEMP.forEach((vital, index) => {
                if (vitals[index] > 0 && vitals[index] < 200) {
                    vital[0] += vitals[index]
                    vital[1]++
                }
            })
        })

        for (let i = 0; i < 4; i++) {
            this.drive.vitals[i] = Math.round((vitals_TEMP[i][0] / vitals_TEMP[i][1])*modifier[i])/modifier[i]
        }
        
        vitals_TEMPSTORAGE = undefined
        data_TEMPSTORAGE = undefined
        recognisedHumans_TEMPSTORAGE = undefined
        
    }
    showVitals(){
        const BT = maths.twoDP(this.drive.vitals[0])
        const BP = maths.twoDP(this.drive.vitals[1])
        const HR = maths.twoDP(this.drive.vitals[2])
        const RR = maths.twoDP(this.drive.vitals[3])
        BT_ID.innerText = `      | ${BT} |`
        BP_ID.innerText = `    | ${BP} |`
        HR_ID.innerText = `     | ${HR} |`
        RR_ID.innerText = ` | ${RR} |`
    }
}