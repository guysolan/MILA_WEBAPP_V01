import CCTV from "./CCTV.js"
import Clock from "./clock.js"
import Person from "./person.js"
import * as maths from './maths.js'
import * as diseases from './disease-graph.js'
import sensorFn from "./sensorFn.js"

//SETUP//SETUP//SETUP//SETUP//SETUP//SETUP//SETUP//SETUP//SETUP//SETUP//
const ellipse1 = document.getElementById("ellipse1")
const ellipse2 = document.getElementById("ellipse2")
const ellipse3 = document.getElementById("ellipse3")
const audio_memory = document.getElementById('audio-memory')
const video_memory = document.getElementById('video-memory')
const total_memory = document.getElementById('total-memory')
const CCTV_1 = new CCTV(ellipse1)
const CCTV_2 = new CCTV(ellipse2)
const CCTV_3 = new CCTV(ellipse3)
const allCCTV = [CCTV_1, CCTV_2, CCTV_3]
const dateElem = document.getElementById('day')
const sunMoonElem = document.getElementById('sun-and-moon')
const continueBtn = document.getElementById('continue-btn')
const introWords1 = document.getElementById('intro-words-1')
const introWords2 = document.getElementById('intro-words-2')
const videoCallMessage = document.getElementById('video-call-message')
const phoneCallMessage = document.getElementById('phone-call-message')
const CCTVMessage = document.getElementById('CCTV-message')
const startLearning1 = document.getElementById('start-learning-1')
const startLearning11 = document.getElementById('start-learning-1.1')
const startLearning2 = document.getElementById('start-learning-2')
const startLearning4 = document.getElementById('start-learning-4')
const startLearning5 = document.getElementById('start-learning-5')
const startLearning6 = document.getElementById('start-learning-6')
const dataStoredMessage = document.getElementById('data-stored-message')
const introMorePeople = document.getElementById('intro-more-people')
let clock = new Clock(dateElem, sunMoonElem)
let lastTime

//ADAPATBLE SETUP//ADAPATBLE SETUP//ADAPATBLE SETUP//ADAPATBLE SETUP//ADAPATBLE SETUP//
let startIntro = 15;
let startLearning = 1500;
let startAddingPeople = 7500;

//INITIALISE//INITIALISE//INITIALISE//INITIALISE//INITIALISE//INITIALISE//INITIALISE//
const me = new Person(document.getElementById("ball"))
let people = [me]

let pause = false;
let introCount = 1

me.phone.showVitals()
console.log(`PersonKey: ${me.personKey}`)
console.log(`Female? ${me.female}`)
console.log(`Age ${me.getAge()} year old`)
console.log(`HR ${me.heartRate} per minute`)
console.log(`Temp ${me.bodyTemp} degrees C`)

// Track which messages have popped up
let videoMessageShown = false;
let phoneMessageShown = false;
let CCTVMessageShown = false;
let processMessageShown = 0;
let dataStoredMessageShow = false

//FUNCTIONS//FUNCTIONS//FUNCTIONS//FUNCTIONS//FUNCTIONS//FUNCTIONS//FUNCTIONS//FUNCTIONS//
function morePeople(numberPeople) {
  for (let i = 1; i < numberPeople; i++) {
    people.push(new Person(document.getElementById(`ball-${i}`)))
  }
}

function onVideoCall(people) {
  people.forEach((person) => {
    if (person.personElement.classList.contains('video-call')) {
      person.phone.drive.video.push(sensorFn.FRAME([person.appearance('video')]))
      person.phone.drive.audio.push(sensorFn.FRAME([person.appearance('audio')]))
    }
  })
}

function onPhoneCall(people) {
  people.forEach((person) => {
    if (person.personElement.classList.contains('phone-call')) {
      person.phone.drive.audio.push(sensorFn.FRAME([person.appearance('audio')]))
    }
  })
}

function useCCTV(CCTV_cameras, people) {
  let CCTV_active = false

  CCTV_cameras.forEach((CCTV) => {
    let indivVideoFrames = new Array()
    let CCTV_rect = CCTV.rect()
    let local_phones = new Array()

    people.forEach((person) => {
      let person_rect = person.rect()
      if (CCTV_rect.right >= person_rect.left && CCTV_rect.left <= person_rect.right && CCTV_rect.top <= person_rect.bottom && CCTV_rect.bottom >= person_rect.top) {
        indivVideoFrames.push(person.appearance('video'))
        local_phones.push(person.phone)

        if (person === me) {
          CCTV_active = true
          person.personElement.classList.add('CCTV')
        }
      }
    })

    local_phones.forEach((phone) => {
      phone.drive.video.push(sensorFn.FRAME(indivVideoFrames))
    })
  })

  if (!CCTV_active) {
    me.personElement.classList.remove('CCTV')
  }
}

//DISPLAY FUNCTIONS//DISPLAY FUNCTIONS//DISPLAY FUNCTIONS//DISPLAY FUNCTIONS//DISPLAY FUNCTIONS//DISPLAY FUNCTIONS//
function lightIcon(person, icon_id, sensor_classname) {
  const spot = document.getElementById(icon_id)
  if (person.personElement.classList.contains(sensor_classname)) {
    spot.classList.add('active')
  } else {
    spot.classList.remove('active')
  }
}

function showMessage(message) {
  pause = true;
  if (message){
    console.log(message)
  }
  message.classList.remove('hidden')
  message.classList.remove('hidden')

  continueBtn.classList.remove('hidden')
}

//MAIN FUNCTION//MAIN FUNCTION//MAIN FUNCTION//MAIN FUNCTION//MAIN FUNCTION//MAIN FUNCTION//MAIN FUNCTION//
function update(time) {

  if (lastTime != null && pause !== true) {
    if (introCount % 500 == 0){
      clock.passTime()
    }

    introCount++;

    if (introCount == startIntro) {
      showMessage(introWords1);

    } else if (introCount == startIntro + 1) {
      showMessage(introWords2)

    }  else if (introCount === startLearning && processMessageShown == 0) {
      showMessage(startLearning1)

    } else if (introCount == startLearning+1 && processMessageShown == 1){
      showMessage(startLearning2)
      me.phone.PROCESS_DATA()
      me.phone.showVitals()
      console.log(me.phone.drive.vitals)

    } else if (introCount == startLearning+2 && processMessageShown == 2){
      showMessage(startLearning4)

    } else if (introCount == startLearning+3 && processMessageShown == 3){
      showMessage(startLearning5)

    } else if (introCount == startLearning+4 && processMessageShown == 4){
      showMessage(startLearning6)
      
    } else if (introCount == startAddingPeople) {
      showMessage(introMorePeople)

    } else if (introCount === startAddingPeople + 1) {
      morePeople(18)

    }
    // if (videoMessageShown == false || phoneMessageShown == true || CCTVMessageShown == true) {
    //   if(dataStoredMessageShow = true){
    //     showMessage(dataStoredMessage)
    //   }
    // }

    if (videoMessageShown == false && me.personElement.classList.contains('video-call')) {
      showMessage(videoCallMessage)
      videoMessageShown = true
    }
    if (phoneMessageShown == false && me.personElement.classList.contains('phone-call')) {
      showMessage(phoneCallMessage)
      phoneMessageShown = true

    }
    if (CCTVMessageShown == false && me.personElement.classList.contains('CCTV')) {
      showMessage(CCTVMessage)
      CCTVMessageShown = true

    }

    const delta = time - lastTime

    // Change Background
    const hue = parseFloat(
      getComputedStyle(document.documentElement).getPropertyValue("--hue")
    )

    diseases.updateGraph()

    people.forEach((person) => {
      person.updatePosition(delta)
    })

    const prefix = ['bytes', 'Kb', 'Mb', 'Gb']

    let videoInMemory = me.phone.space('video')
    let audioInMemory = me.phone.space('audio')
    let totalInMemory = me.phone.space('total')

    const video_e = Math.max(0, Math.trunc((Math.log(videoInMemory+0.001))/(Math.log(1000))))
    const audio_e = Math.max(0, Math.trunc((Math.log(audioInMemory+0.001))/(Math.log(1000))))
    const total_e = Math.max(0, Math.trunc((Math.log(totalInMemory+0.001))/(Math.log(1000))))

    videoInMemory = maths.twoDP(videoInMemory)
    audioInMemory = maths.twoDP(audioInMemory)
    totalInMemory = maths.twoDP(totalInMemory)
    total_memory.innerText = `Total Data Stored: ${totalInMemory/(1000**total_e)} ${prefix[total_e]}`
    video_memory.innerText = `Video Data Stored: ${videoInMemory/(1000**video_e)} ${prefix[video_e]}`
    audio_memory.innerText = `Audio Data Stored: ${audioInMemory/(1000**audio_e)} ${prefix[audio_e]}`


    useCCTV(allCCTV, people)
    //onVideoCall(people)
    //onPhoneCall(people)

    people.forEach((person) => {
      if (person.phone.space('total') > 1e6) {
        // if (processMessageShown == 0 && person == me) {
        //   showMessage(startLearning11)
        // }
        person.phone.PROCESS_DATA()
        person.phone.showVitals()
        console.log(person.phone.drive.vitals)
      }
    })

    lightIcon(me, 'blue-spot', 'video-call')
    lightIcon(me, 'red-spot', 'CCTV')
    lightIcon(me, 'green-spot', 'phone-call')


    document.documentElement.style.setProperty("--hue", hue + delta * 0.01)


  }

  lastTime = time
  window.requestAnimationFrame(update)
}

let allMessages = Array.from(document.querySelector('#all-messages').children);

continueBtn.addEventListener('click', function unPause() {
  pause = false;
  continueBtn.classList.add('hidden')
  allMessages.forEach((message) => {
    if (!(message.classList.contains('hidden'))) {
      message.classList.add('hidden')
    }
  })
})

window.requestAnimationFrame(update)