const phoneFn = new Object(null);

phoneFn.humanRecognition = function(frame) {
    let searchLength = 50
    if (frame.length < 1500) {
        searchLength = 23
    }
    let humans = new Array()
    for (let i = 0; i < frame.length; i++) {
        if (frame[i] == "~") {
            if (!((frame.slice(i+1, i+searchLength)).includes('~'))) {
                humans.push([frame.slice(i, i + 8), frame.slice(i + 8, i + searchLength)])
            }
        }
    }
    return humans
}

phoneFn.identify = function(alpha, recognisedHumans) {
    for (let i = 0; i < recognisedHumans.length; i++){
        if (recognisedHumans[i][0] == alpha) {
            let type = 'video'
            return recognisedHumans[i][1]
        }
    }
}

phoneFn.extractVitals = function(data, PARAM) {
    let vitals = new Array(4)
    let temp = new Array(data.length)

    if (data.length == 42) {
        const key = PARAM.video
        const modifier = [1000, 100, 100, 1000]

        for (let i = 0; i < data.length; i++) {
            temp[key[i]] = data.charCodeAt(i) - 2 * key[key[i]] - 32
        }
    
        for (let i = 0; i <= 15; i += 5) {
            vitals[i/5] = parseInt(temp.slice(i, 5 + i).join('')) / modifier[i/5]
        }
    } 

    else if (data.length == 15) {
        const key = PARAM.audio

        for (let i = 0; i < data.length; i++) {
            temp[key[i]] = data.charCodeAt(i) - 2 * key[key[i]] - 32
        }
    
        vitals[2] = parseInt(temp.slice(0, 5).join('')) / 100
        vitals[3] = parseInt(temp.slice(5, 10).join('')) / 1000
    }

    vitals[Math.floor(Math.random() * 4)] = undefined
    vitals[Math.floor(Math.random() * 4)] = undefined
    vitals[Math.floor(Math.random() * 4)] = undefined
    vitals[Math.floor(Math.random() * 4)] = undefined

    return vitals
}

export default Object.freeze(phoneFn);