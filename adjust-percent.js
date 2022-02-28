const cctv = document.getElementById('cctv-box-custom')
const video = document.getElementById('video-call-box-custom')
const phone = document.getElementById('phone-call-box-custom')
const performance = document.getElementById('custom-performance')
const data = document.getElementById('custom-data')

for (let element of [cctv,video,phone]){
    element.onclick = changeValues
}