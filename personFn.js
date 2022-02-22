const personFn = new Object(null);

personFn.videoAppearance = function(alpha, vitals) {
    const key = [36, 16, 17, 27, 18, 23,  9,  7,  6, 24,
           34, 22, 30, 12, 29, 15, 38,  3,  8, 37,
           39, 40,  1, 32, 33, 25,  2, 31, 10,  5,
           11, 35,  0, 28, 20, 19, 14, 26, 13,  4,
           21, 41]

    let BT_temp = vitals[0]
    let BP_temp = vitals[1]
    let HR_temp = vitals[2]
    let RR_temp = vitals[3]
    let hash = new Array(42)
    let vital_string = new Array(20)

    for (let i = 0; i < 5; i++){
        vital_string[i] = parseInt(BT_temp/(10**(1-i)))
        vital_string[i+5] = parseInt(BP_temp/(10**(2-i)))
        vital_string[i+10] = parseInt(HR_temp/(10**(2-i)))
        vital_string[i+15] = parseInt(RR_temp/(10**(1-i)))

        BT_temp -= parseInt(BT_temp/(10**(1-i))) * (10**(1-i))
        BP_temp -= parseInt(BP_temp/(10**(2-i))) * (10**(2-i))
        HR_temp -= parseInt(HR_temp/(10**(2-i))) * (10**(2-i))
        RR_temp -= parseInt(RR_temp/(10**(1-i))) * (10**(1-i))
    }

    for (let i = 0; i < vital_string.length; i++) {
        vital_string[i] += 2 * key[i]
    }

    let noise = Array.from({length: 22}, () => Math.floor(Math.random() * 94))
    vital_string.push(noise)
    vital_string = vital_string.flat()

    for (let i = 0; i < vital_string.length; i++) {
        hash[i] = String.fromCharCode(vital_string[key[i]] + 32)
    }

    return alpha + hash.join('')
}

personFn.audioAppearance = function(alpha, vitals) {
    const key = [13, 9, 0, 14, 1,  5, 7,  6, 8,
           2, 11, 3, 10, 4, 12]

    let HR_temp = vitals[2]
    let RR_temp = vitals[3]
    let hash = new Array(15)
    let vital_string = new Array(10)

    for (let i = 0; i < 5; i++){
        vital_string[i] = parseInt(HR_temp/(10**(2-i)))
        vital_string[i+5] = parseInt(RR_temp/(10**(1-i)))

        HR_temp -= parseInt(HR_temp/(10**(2-i))) * (10**(2-i))
        RR_temp -= parseInt(RR_temp/(10**(1-i))) * (10**(1-i))
    }

    for (let i = 0; i < vital_string.length; i++) {
        vital_string[i] += 2 * key[i]
    }

    let noise = Array.from({length: 5}, () => Math.floor(Math.random() * 94))
    vital_string.push(noise)
    vital_string = vital_string.flat()

    for (let i = 0; i < vital_string.length; i++) {
        hash[i] = String.fromCharCode(vital_string[key[i]] + 32)
    }

    return alpha + hash.join('')
}

export default Object.freeze(personFn);