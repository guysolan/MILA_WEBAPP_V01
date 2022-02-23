import CCTV from "./CCTV.js"
import Clock from "./clock.js"
import Person from "./person.js"
import * as maths from './maths.js'
import * as diseases from './disease-graph.js'
import sensorFn from "./sensorFn.js"


//FROM_RESEARCH_HOW_MUCH_DATA_NEEDED_TO_GET_VITALS
const dataRequirement = 3e6

//SETUP//SETUP//SETUP//SETUP//SETUP//SETUP//SETUP//SETUP//SETUP//SETUP//
const terminal = document.getElementById('terminal')
const ellipse1 = document.getElementById("ellipse1")
const ellipse2 = document.getElementById("ellipse2")
const ellipse3 = document.getElementById("ellipse3")
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

// Track Console
let old_video_call_class = me.personElement.classList.contains('video-call')
let old_phone_call_class = me.personElement.classList.contains('phone-call')
let old_CCTV_class = me.personElement.classList.contains('CCTV')


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
  if (message) {
    console.log(message)
  }
  message.classList.remove('hidden')
  message.classList.remove('hidden')

  continueBtn.classList.remove('hidden')
}

//MAIN FUNCTION//MAIN FUNCTION//MAIN FUNCTION//MAIN FUNCTION//MAIN FUNCTION//MAIN FUNCTION//MAIN FUNCTION//
function update(time) {

  const delta = time - lastTime

  let audio_memory = document.getElementById('audio-memory')
  let video_memory = document.getElementById('video-memory')
  // let total_memory = document.getElementById('total-memory')

  if (lastTime != null && pause !== true) {
    if (introCount % 500 == 0) {
      clock.passTime()
    }

    introCount++;

    if (introCount == startIntro) {
      showMessage(introWords1);

    } else if (introCount == startIntro + 1) {
      showMessage(introWords2)

    } else if (introCount === startLearning && processMessageShown == 0) {
      showMessage(startLearning1)

    } else if (introCount == startLearning + 1 && processMessageShown == 1) {
      showMessage(startLearning2)
      me.phone.PROCESS_DATA()
      me.phone.showVitals()
      console.log(me.phone.drive.vitals)

    } else if (introCount == startLearning + 2 && processMessageShown == 2) {
      showMessage(startLearning4)

    } else if (introCount == startLearning + 3 && processMessageShown == 3) {
      showMessage(startLearning5)

    } else if (introCount == startLearning + 4 && processMessageShown == 4) {
      showMessage(startLearning6)

    } else if (introCount == startAddingPeople) {
      showMessage(introMorePeople)

    } else if (introCount === startAddingPeople + 1) {
      morePeople(18)
    }

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




    diseases.updateGraph()

    people.forEach((person) => {
      person.updatePosition(delta)
    })



    showData('video-call', [video_memory, audio_memory], ['video', 'audio'], ['Video', 'Audio'], ['video-memory', 'audio-memory'], old_video_call_class, 'video', true)
    // showData('video-call',audio_memory,'audio','Audio','audio-memory',old_video_call_class,'video',true)
    old_video_call_class = me.personElement.classList.contains('video-call')

    showData('phone-call', [audio_memory], ['audio'], ['Audio'], ['audio-memory'], old_phone_call_class, 'phone', true)
    old_phone_call_class = me.personElement.classList.contains('phone-call')

    showData('CCTV', [video_memory], ['video'], ['Video'], ['video-memory'], old_CCTV_class, 'CCTV', false)
    old_CCTV_class = me.personElement.classList.contains('CCTV')




    useCCTV(allCCTV, people)
    onVideoCall(people)
    onPhoneCall(people)

    people.forEach((person) => {
      if (person.phone.space('total') > dataRequirement) {
        // if (processMessageShown == 0 && person == me) {
        //   showMessage(startLearning11)
        // }
        person.phone.PROCESS_DATA()
        if (person==me){
          // startVitalsSequence()
        }
        person.phone.showVitals()
        cloneBottomOfTerminal('vitals-wrap')
        console.log(person.phone.drive.vitals)
      }
    })

    lightIcon(me, 'blue-spot', 'video-call')
    lightIcon(me, 'red-spot', 'CCTV')
    lightIcon(me, 'green-spot', 'phone-call')

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

function cloneBottomOfTerminal(element_id) {
  let element = document.getElementById(element_id);
  const clone_e = element.cloneNode(true)
  element.removeAttribute('id', element_id)
  clone_e.setAttribute('id', element_id)
  terminal.prepend(clone_e);
}

function moveBottomOfTerminal(element_id) {
  let element = document.getElementById(element_id);
  terminal.prepend(element);
}

function convertToBits(dataType) {
  let dataInMemory = me.phone.space(dataType)
  const prefix = ['bytes', 'Kb', 'Mb', 'Gb']
  let data_e = Math.max(0, Math.trunc((Math.log(dataInMemory + 0.001)) / (Math.log(1000))))
  dataInMemory = maths.twoDP(dataInMemory)
  let formatted = `${dataInMemory/(1000**data_e)} ${prefix[data_e]}`
  return {
    prefix,
    data_e,
    dataInMemory,
    formatted
  }
}

function showMemory(dataType, dataElem, dataName) {

  const data = convertToBits(dataType)
  dataElem.innerHTML = `Saving ${dataName} Data = <span class='green'>True</span>
  <br><br>
  ${dataName} Data Stored: ${data.formatted}
  <br><br>
  <div class='bar-chart' style='width:${data.dataInMemory/dataRequirement*90}%; max-width: 90%'></div>`
}

function showTotal() {
  let totalMemoryElem = document.getElementById('total-memory')
  let data = convertToBits('total')
  totalMemoryElem.innerHTML = `
  Data Requirement: ${maths.twoDP(data.dataInMemory/dataRequirement*100)}% 
  <br><br>
  <div class='bar-chart' style='width:${data.dataInMemory/dataRequirement*90}%; max-width: 90%'></div>`
}

function stopStreaming(dataElem, dataName) {
  let stoppedStreaming = document.createElement('p')
  stoppedStreaming.innerHTML = `Saving ${dataName} Data = <span class='red'>False</span>`
  dataElem.appendChild(stoppedStreaming)
}

function showAction(dataElem, name, call = true) {
  console.log('here')
  let newAction = document.createElement('p')
  if (call) {
    newAction.innerHTML = `<br>
    ---------------------------
    <br>
    | New ${name} call detected |
    <br>
    ---------------------------
    `
  } else if (call == false) {
    newAction.innerHTML = `<br>
    ---------------------------
    <br>
    | Detected in ${name} area |
    <br>
    ---------------------------`
  }
  dataElem.appendChild(newAction)
}

function startVitalsSequence() {
  me.stop()
  messageAfterDelay('Starting User Identification...',10)
  messageAfterDelay('User Identified',1000)
}

function messageAfterDelay(words,time){
  setTimeout(() => {
    let message = document.createElement('p')
    message.innerHTML = `
  <br>
  ${words}
  <br>`
    terminal.prepend(message)
  }, time);
}

function showData(data_className = 'video-call', memory_type, dataType = 'video', dataName = 'Video', element_id = 'video-memory', old_data_class, name, call = true) {

  let dataClass = me.personElement.classList.contains(data_className)

  if (old_data_class == true) {

    showTotal()
    for (let i = 0; i < dataType.length; i++) {
      showMemory(dataType[i], memory_type[i], dataName[i])
    }
  }

  if (old_data_class == false && dataClass == true) {
    cloneBottomOfTerminal('total-memory')

    for (let i = 0; i < dataType.length; i++) {
      cloneBottomOfTerminal(element_id[i])
    }
    showAction(memory_type[0], name, call)

  } else if (old_data_class == true && dataClass == false) {
    for (let i = 0; i < dataType.length; i++) {
      stopStreaming(memory_type[i], dataName[i])

    }
  }
}

window.requestAnimationFrame(update)