import CCTV from "./CCTV.js"
import Clock from "./clock.js"
import Person from "./person.js"
import * as maths from './maths.js'
import * as diseases from './disease-graph.js'
import sensorFn from "./sensorFn.js"
import CLOUD from "./CLOUD.js"
import terminal_message from './terminal-messages.js'
import chart_data from './chart-data.js'
// import Chart from 'chart.js/auto';

//FROM_RESEARCH_HOW_MUCH_DATA_NEEDED_TO_GET_VITALS
const dataRequirement = 1e6 / 1

//SETUP//SETUP//SETUP//SETUP//SETUP//SETUP//SETUP//SETUP//SETUP//SETUP//

const terminal = document.getElementById('terminal')

const terminalSelector = document.getElementById('terminal-selector');
const UISelector = document.getElementById('UI-selector');

const risks = document.querySelectorAll('.risk')

const time_buttons = document.querySelectorAll('.time')

const ellipse1 = document.getElementById("ellipse1")
const ellipse2 = document.getElementById("ellipse2")
const ellipse3 = document.getElementById("ellipse3")

const CCTV_1 = new CCTV(ellipse1)
const CCTV_2 = new CCTV(ellipse2)
const CCTV_3 = new CCTV(ellipse3)

const allCCTV = [CCTV_1, CCTV_2, CCTV_3]

const dateElem = document.getElementById('day')

const continueBtn = document.getElementById('continue-btn')
const feedbackBtn = document.getElementById('feedback-btn')

const introWords0 = document.getElementById('intro-words-0');
const introWords1 = document.getElementById('intro-words-1')
const introWords2 = document.getElementById('intro-words-2')
const introWords3 = document.getElementById('intro-words-3')

const videoCallMessage = document.getElementById('video-call-message')
const phoneCallMessage = document.getElementById('phone-call-message')
const CCTVMessage = document.getElementById('CCTV-message')

const vitalsMessage1 = document.getElementById('vitals-message-1')
const vitalsMessage2 = document.getElementById('vitals-message-2')
const vitalsMessage3 = document.getElementById('vitals-message-3')
const vitalsMessage4 = document.getElementById('vitals-message-4')

const seeDoctorMessage1 = document.getElementById('see-doctor-message-1')
const seeDoctorMessage2 = document.getElementById('see-doctor-message-2')

const riskMessage1 = document.getElementById('risk-message-1')

const doctorFeedback1 = document.getElementById('doctor-feedback-1')
const doctorFeedback2 = document.getElementById('doctor-feedback-2')

const localTrainingOverMessage = document.getElementById('training-over-1')
const globalTrainingStart = document.getElementById('global-training-start')
const watchGlobalTraining = document.getElementById('watch-global-training')
const globalBeingTrained = document.getElementById('global-being-trained')

const globalTrainingComplete = document.getElementById('global-training-complete')
const globalModel = document.getElementById('global-model')

const trainingProgressBar = document.getElementById('training-progress-bar')

const introMorePeople = document.getElementById('intro-more-people')

const otherGlobalTraining = document.getElementById('other-global-training')
let anotherGlobalTraining = document.getElementById('another-global-training')

const simulationOver = document.getElementById('simulaton-over')
const maxBarWidth = 85;



let clock = new Clock(dateElem)

let myChart = new Chart(
  document.getElementById('myChart').getContext('2d'),
  chart_data.config
);

let lastTime

//ADAPATBLE SETUP//ADAPATBLE SETUP//ADAPATBLE SETUP//ADAPATBLE SETUP//ADAPATBLE SETUP//
let startIntro = 15;
let doctorFeedbackTime = 500;
let startAddingPeople = doctorFeedbackTime + 5000;

//INITIALISE//INITIALISE//INITIALISE//INITIALISE//INITIALISE//INITIALISE//INITIALISE//
const me = new Person(document.getElementById("ball"))
let people = [me]
let alreadyTrained = [me]

let pause = false;
let introCount = 0

messageAfterDelay(terminal_message.dashedLines, 0)
messageAfterDelay(`PersonKey: ${me.personKey}`, 1)
messageAfterDelay(`Age: ${me.getAge()} year old`, 2)
if (me.female) {
  messageAfterDelay(`Female = <span class="green">${me.female}</span>`, 3)
} else {
  messageAfterDelay(`Female = <span class="red">${me.female}</span>`, 3)
}
messageAfterDelay(terminal_message.dashedLines, 4)

// Track which messages have popped up
let videoMessageShown = false;
let phoneMessageShown = false;
let CCTVMessageShown = false;

let vitalsMessagesCount = 0
let showVitalsMessages = false

let doctorMessagesCount = 0
let showDoctorMessages = false;
let startTraining = false;
let trainingProgress = 0;
let trainingMessagesShown = 0
let trainGlobal = false;

let globalTrainingCount = 0
let globalTrainingDuration = 250;

let addMorePeople = false;
let morePeopleCount = 0
let morePeopleDelay = 500;

let moreTrainGlobal = false;
let moreGlobalTrainingCount = 0;
let moreGlobalTrainingDuration = 50;
let ballBeingTrained;

let otherGlobalShown = false;

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

function stopSensors() {
  me.personElement.classList.remove('CCTV')
  me.personElement.classList.remove('video-call')
  me.personElement.classList.remove('phone-call')
}

//DISPLAY FUNCTIONS//DISPLAY FUNCTIONS//DISPLAY FUNCTIONS//DISPLAY FUNCTIONS//DISPLAY FUNCTIONS//DISPLAY FUNCTIONS//
function lightIcon(person, icon_ids, sensor_classname) {


  if (person.personElement.classList.contains(sensor_classname)) {
    icon_ids.forEach((id) => {
      const icon = document.getElementById(id)
      icon.classList.add('active')
    })
  } else {
    icon_ids.forEach((id) => {
      const icon = document.getElementById(id)
      icon.classList.remove('active')
    })

  }
}

function showMessage(message, showButton = true) {
  pause = true;
  if (message) {
    // console.log(message)
  }
  message.classList.remove('hidden')
  message.classList.remove('hidden')
  if (showButton) {
    continueBtn.classList.remove('hidden')
  }
}

function showFeedbackMessage(message) {
  pause = true;
  message.classList.remove('hidden')
  message.classList.remove('hidden')
  feedbackBtn.classList.remove('hidden')
}



let allMessages = Array.from(document.querySelector('#all-messages').children);

function unPause() {
  // console.log('unPause')
  pause = false;
  continueBtn.classList.add('hidden')
  allMessages.forEach((message) => {
    if (!(message.classList.contains('hidden'))) {
      message.classList.add('hidden')
    }
  })
}

time_buttons.forEach((button) => {
  button.onclick = unPause;
})

continueBtn.onclick = unPause

document.body.onkeydown = function (e) {
  if (e.keyCode == 32 || 13 || 39) {
    unPause();
  }
}

function cloneBottomOfTerminalbyID(element_id) {
  let element = document.getElementById(element_id);
  const clone_e = element.cloneNode(true)
  element.removeAttribute('id', element_id)
  clone_e.setAttribute('id', element_id)
  terminal.prepend(clone_e);
}

function cloneBottomOfTerminalByElem(element) {
  const clone_e = element.cloneNode(true)
  terminal.prepend(clone_e);
}

function moveBottomOfTerminal(element_id) {
  let element = document.getElementById(element_id);
  terminal.prepend(element);
}

function changeGlobalModelSequence() {
  for (let person of people) {
    person.stop()
  }
  globalModel.classList.add('active')
  console.log('Start Loop')

  console.log('End Loop')

  globalModel.classList.remove('active')
  for (let person of people) {
    person.start()
  }
}

function changeGlobalModel(changeAmount) {
  let chartDataPoints = chart_data.config.data.datasets['0'].data
  // console.log(chartDataPoints)
  for (let i = 0; i < chartDataPoints.length; i++) {
    if (Math.round(maths.randomNumberBetween(1, 5)) == i) {
      let point = chartDataPoints[i]
      let newPoint
      if (point > 30) {
        newPoint = point + maths.randomNumberBetween(-changeAmount, 0)

      } else if (point < 10) {
        newPoint = point + maths.randomNumberBetween(0, changeAmount)

      } else {
        newPoint = point + maths.randomNumberBetween(-changeAmount, changeAmount)
      }
      chartDataPoints.splice(i, 1, newPoint)
      myChart.update()

    }
  }
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
  ${dataName} Data: ${data.formatted}
  <br><br>
  <div class='bar-chart' style='width:${data.dataInMemory/dataRequirement*maxBarWidth}%; max-width: ${maxBarWidth}%'></div>`
}

function showRisk(conditionElem, condition, risk, noRisk) {
  if (risk == NaN || risk < noRisk) {
    risk = noRisk
  }
  let riskPercent = (noRisk - risk) / noRisk * maxBarWidth
  if (risk > 0) {
    conditionElem.innerHTML = `<p>${condition}</p>
    <div class='risk-bar red' style='margin: 0 1rem; width:${riskPercent}%; max-width: ${maxBarWidth}%'></div>`
  } else {
    conditionElem.innerHTML = `<p>${condition}</p>
  <div class='risk-bar' style='margin: 0 1rem; width:${riskPercent}%; max-width: ${maxBarWidth}%'></div>`
  }

}

function showAllRisks() {
  for (let i = 0; i < risks.length; i++) {
    let diseases = Object.keys(me.phone.drive.conditions)
    let disease_risks = Object.values(me.phone.drive.conditions)
    // console.log(`${diseases[i]} risk: ${disease_risks[i]}`)
    showRisk(risks[i], diseases[i], disease_risks[i], CLOUD.NO_RISK)
    cloneBottomOfTerminalByElem(risks[i])
  }
  messageAfterDelay(terminal_message.dashedLines, 10)

}

function showTotal() {
  let totalMemoryElem = document.getElementById('total-memory')
  let data = convertToBits('total')
  totalMemoryElem.innerHTML = `
  Data Requirement: ${maths.twoDP(data.dataInMemory/dataRequirement*100)}% 
  <br><br>
  <div class='bar-chart total' style='width:${data.dataInMemory/dataRequirement*maxBarWidth}%; max-width: ${maxBarWidth}%'></div>`
}

function showTrainingProgress(percentComplete) {
  stopSensors();
  trainingProgressBar.innerHTML = `
  Training Complete: ${maths.twoDP(percentComplete)}% 
  <br><br>
  <div class='bar-chart training' style='width:${percentComplete/100*maxBarWidth}%; max-width: ${maxBarWidth}%'></div>`
  terminal.prepend(trainingProgressBar)
}

function stopStreaming(dataElem, name) {
  let stoppedStreaming = document.createElement('p')
  stoppedStreaming.innerHTML = `${name} recording <span class='red'>over</span>.`
  dataElem.appendChild(stoppedStreaming)
}

function showAction(name) {
  let newAction = document.createElement('p')
  newAction.innerHTML = `<br>
    ---------------------------
    <br>
    Detected by ${name} device
    <br>
    ---------------------------
    `
  terminal.prepend(newAction)
}

function swapTerminalUI() {
  if (terminalSelector.classList.contains('hidden')) {
    terminalSelector.classList.remove('hidden')
    UISelector.classList.add('hidden')
  } else {
    terminalSelector.classList.add('hidden')
    UISelector.classList.remove('hidden')
  }
}



function alterRisk1() {
  me.phone.drive.conditions['CARDIOVASCULAR'] = -0.7
  me.phone.drive.conditions['INFECTION'] = -1
  me.phone.drive.conditions['DERMATOLOGY'] = -0.001
  me.phone.drive.conditions['RESPIRATORY'] = -1.3
  me.phone.drive.conditions['METABOLIC'] = -1.5
  me.phone.drive.conditions['GASTROINTESTINAL'] = -1.9
}

function alterRisk2() {
  me.phone.drive.conditions['CARDIOVASCULAR'] = -0.7
  me.phone.drive.conditions['INFECTION'] = -0.6
  me.phone.drive.conditions['DERMATOLOGY'] = 0.001
  me.phone.drive.conditions['RESPIRATORY'] = -1.6
  me.phone.drive.conditions['METABOLIC'] = -2.2
  me.phone.drive.conditions['GASTROINTESTINAL'] = -2.1
}

function messageAfterDelay(words, time) {
  setTimeout(() => {
    let message = document.createElement('p')
    message.innerHTML = `
  <br>
  ${words}
  <br>`
    terminal.prepend(message)
  }, time);
}

function showData(data_className = 'video-call', memory_type, dataType = 'video', dataName = 'Video', element_id = 'video-memory', old_data_class, name) {

  let dataClass = me.personElement.classList.contains(data_className)

  if (old_data_class == true) {
    showTotal()
    for (let i = 0; i < dataType.length; i++) {
      showMemory(dataType[i], memory_type[i], dataName[i])
    }
  }

  if (old_data_class == false && dataClass == true) {

    if (data_className == 'video-call') {
      showAction('Personal')
    } else if (data_className == 'phone-call') {
      showAction('Personal')
    } else if (data_className == 'CCTV') {
      showAction('Public')
    }

    cloneBottomOfTerminalbyID('total-memory')

    for (let i = 0; i < dataType.length; i++) {
      cloneBottomOfTerminalbyID(element_id[i])
    }

  } else if (old_data_class == true && dataClass == false) {
    for (let i = 0; i < dataType.length; i++) {
      stopStreaming(memory_type[i], name)

    }
  }
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

    // ------------------INTRO SEQUENCE------------------
    introCount++;

    if (introCount == startIntro-1) {
      showMessage(introWords0);
    } else if (introCount == startIntro) {
      showMessage(introWords1)
    } else if (introCount == startIntro + 1) {
      showMessage(introWords2)
    } else if (introCount == startIntro + 2) {
      showMessage(introWords3)
    } else if (introCount == startIntro + 3) {
      showMessage(introWords3)
    }


    // -----------------SENSOR SEQUENCE------------------
    if (introCount > startIntro + 3) {
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
    }


    // ------------------VITALS SEQUENCE------------------

    if (showVitalsMessages == true) {
      if (vitalsMessagesCount == 0) {
        stopSensors()
        showMessage(vitalsMessage1)
        messageAfterDelay(terminal_message.vitals1, 10)
        vitalsMessagesCount++
      } else if (vitalsMessagesCount == 1) {
        stopSensors()
        showMessage(vitalsMessage2)
        messageAfterDelay(terminal_message.vitals2, 10)

        vitalsMessagesCount++
      } else if (showVitalsMessages == true && vitalsMessagesCount == 2) {
        stopSensors()
        showMessage(vitalsMessage3)
        messageAfterDelay(terminal_message.vitals3, 10)

        vitalsMessagesCount++
      } else if (showVitalsMessages == true && vitalsMessagesCount == 3) {
        stopSensors()
        showMessage(vitalsMessage4)
        messageAfterDelay(terminal_message.vitals4, 10)
        vitalsMessagesCount++

      } else if (showVitalsMessages == true && vitalsMessagesCount == 4) {
        stopSensors()
        cloneBottomOfTerminalbyID('vitals-wrap')
        vitalsMessagesCount++

      } else if (showVitalsMessages == true && vitalsMessagesCount == 5) {
        stopSensors()

        //Change Vitals to demonstrate doctors process
        alterRisk1();

        showMessage(riskMessage1)
        messageAfterDelay(terminal_message.risk1, 1)
        messageAfterDelay(terminal_message.risk2, 2)
        setTimeout(() => showAllRisks(), 5)
        vitalsMessagesCount++
        me.start()
      }
    }

    // -------------------RISK SEQUENCE-------------------

    if (showDoctorMessages == true) {
      // Message 6 within data processing loop
      if (doctorMessagesCount == 0) {
        stopSensors()
        swapTerminalUI()
        showMessage(seeDoctorMessage2, false)
        me.start()
        doctorMessagesCount++
      } else if (doctorMessagesCount == 1) {
        swapTerminalUI()
        doctorMessagesCount++
      } else if (doctorMessagesCount < doctorFeedbackTime) {
        doctorMessagesCount++
      } else if (doctorMessagesCount == doctorFeedbackTime) {
        stopSensors()
        showMessage(doctorFeedback1)
        doctorMessagesCount++
      } else if (doctorMessagesCount == doctorFeedbackTime + 1) {
        me.personElement.classList.remove('red')
        stopSensors()
        showMessage(doctorFeedback2)
        messageAfterDelay(terminal_message.training1, 0)
        doctorMessagesCount++
        startTraining = true
      }
    }
    if (startTraining == true) {
      stopSensors()
      if (trainingProgress < 100) {
        showTrainingProgress(trainingProgress)
        trainingProgress += maths.randomNumberBetween(0, 1)
      } else {
        trainingMessagesShown = 1
        startTraining = false
        trainGlobal = true
      }
    }
    if (trainGlobal == true) {

      if (globalTrainingCount == 0) {
        showMessage(localTrainingOverMessage)
        messageAfterDelay(terminal_message.localTrainingOver)
      } else if (globalTrainingCount == 1) {
        showMessage(globalTrainingStart)

      } else if (globalTrainingCount == 2) {
        showMessage(watchGlobalTraining)
        messageAfterDelay(terminal_message.globalTraining1, 10)
        messageAfterDelay(terminal_message.globalTraining2, 260)
        messageAfterDelay(terminal_message.globalTraining3, 500)

        // ---------------TRAIN GLOBAL MODEL-----------------
      } else if (globalTrainingCount < globalTrainingDuration) {
        // console.log('globalTrainingInProgress')
        globalModel.classList.add('active')
        changeGlobalModel(0.4)
        me.stop()

      } else if (globalTrainingCount == globalTrainingDuration) {
        globalModel.classList.remove('active')
        me.start()
        showMessage(globalTrainingComplete)
        messageAfterDelay(terminal_message.globalTraining4, 10)
        trainGlobal = false
        addMorePeople = true
      }
      if (trainGlobal) {
        globalTrainingCount++
        stopSensors()
      }
    }

    // -------------------MORE PEOPLE SEQUENCE-------------------

    if (addMorePeople) {
      morePeopleCount++
      if (morePeopleCount == morePeopleDelay) {
        showMessage(introMorePeople)
      } else if (morePeopleCount == morePeopleDelay + 1) {
        morePeople(20)
      }
    }

    // -----------------END SIMULATION MOVED FORWARD FOR BETTER FLOW----------------

    if (otherGlobalShown == 3) {
      console.log('End Simulation')
      showFeedbackMessage(simulationOver)
    }

    // -----------------MORE PEOPLE GLOBAL TRAINING----------------

    if (moreTrainGlobal && addMorePeople) {

      if (moreGlobalTrainingCount == 0) {
        messageAfterDelay(terminal_message.globalTraining3, 200)

        // ---------------TRAIN GLOBAL MODEL-----------------
      } else if (moreGlobalTrainingCount < moreGlobalTrainingDuration) {
        // console.log('globalTrainingInProgress')

        globalModel.classList.add('active')
        changeGlobalModel(0.4)
        me.stop()

      } else if (moreGlobalTrainingCount == moreGlobalTrainingDuration) {
        globalModel.classList.remove('active')
        me.start()
        if (otherGlobalShown == 0) {
          showMessage(otherGlobalTraining)
        }
        if (otherGlobalShown > 0 && otherGlobalShown < 3) {
          showMessage(anotherGlobalTraining)
        }
        otherGlobalShown++
        messageAfterDelay(terminal_message.globalTraining4, 10)
        moreTrainGlobal = false
        ballBeingTrained.personElement.classList.remove('red')
      }

      stopSensors();
      moreGlobalTrainingCount++;
    }



    people.forEach((person) => {
      person.updatePosition(delta)
    })

    showData('video-call', [video_memory, audio_memory], ['video', 'audio'], ['Video', 'Audio'], ['video-memory', 'audio-memory'], old_video_call_class, 'Personal', true)
    old_video_call_class = me.personElement.classList.contains('video-call')

    showData('phone-call', [audio_memory], ['audio'], ['Audio'], ['audio-memory'], old_phone_call_class, 'Personal', true)
    old_phone_call_class = me.personElement.classList.contains('phone-call')

    showData('CCTV', [video_memory], ['video'], ['Video'], ['video-memory'], old_CCTV_class, 'Public', false)
    old_CCTV_class = me.personElement.classList.contains('CCTV')

    onVideoCall(people)
    onPhoneCall(people)
    useCCTV(allCCTV, people)

    people.forEach((person) => {

      if (person.phone.space('total') > dataRequirement) {

        // FIND VITALS
        let whichBall = person.personElement.id
        console.log(`Processing ${whichBall}'s Vitals`)
        person.phone.PROCESS_DATA()
        person.phone.showVitals()
        // FIND RISKS
        person.phone.PROCESS_VITALS()

        if (person == me) {
          console.log('ME')
          alterRisk1();
        }
        console.log(`Processing ${whichBall}'s Risk`)
        console.log("CONDITIONS: ")
        console.log(person.phone.drive.conditions)

        for (let model in person.phone.drive.conditions) {
          if (moreTrainGlobal == false) {
            if (!(alreadyTrained.includes(person))) {
              if (person.phone.drive.conditions[model] > 0) {
                console.log('ALERT: ' + model)
                person.personElement.classList.add('red')
                ballBeingTrained = person
                alreadyTrained.push(ballBeingTrained)
                moreTrainGlobal = true
                moreGlobalTrainingCount = 0
              }
            }
          }
        }

        if (person == me && vitalsMessagesCount < 3) {
          showVitalsMessages = true
        } else if (person == me && vitalsMessagesCount >= 3) {
          stopSensors()
          // VITALS SEQUENCE
          messageAfterDelay(terminal_message.vitals1, 0)
          messageAfterDelay(terminal_message.vitals2, 100)
          messageAfterDelay(terminal_message.vitals3, 200)
          messageAfterDelay(terminal_message.vitals4, 300)
          setTimeout(() => cloneBottomOfTerminalbyID('vitals-wrap'), 500)
          setTimeout(() => me.start(), 600)
          // RISK SEQUENCE
          messageAfterDelay(terminal_message.risk1, 1000)
          messageAfterDelay(terminal_message.risk2, 1100)

          if (showVitalsMessages == true && vitalsMessagesCount == 6) {
            alterRisk2();
            stopSensors();
            setTimeout(me.personElement.classList.add('red'), 5000)
            setTimeout(showMessage(seeDoctorMessage1), 10000)
            messageAfterDelay(terminal_message.seeDoctor1, 10)
            showDoctorMessages = true
            vitalsMessagesCount += 1
          }
          setTimeout(() => showAllRisks(), 1500)
        }
      }

    })

    lightIcon(me, ['public', 'public-video'], 'CCTV')

    const personal = document.getElementById('personal')
    const personalAudio = document.getElementById('personal-audio')
    const personalVideo = document.getElementById('personal-video')

    if (me.personElement.classList.contains('phone-call')) {
      let icons = [personal, personalAudio]
      icons.forEach((icon) => {
        icon.classList.add('active')
      })
    } else if (me.personElement.classList.contains('video-call')) {
      let icons = [personal, personalAudio, personalVideo]
      icons.forEach((icon) => {
        icon.classList.add('active')
      })
    } else {
      let icons = [personal, personalAudio, personalVideo]
      icons.forEach((icon) => {
        icon.classList.remove('active')
      })
    }
  }

  lastTime = time
  window.requestAnimationFrame(update)
}

window.requestAnimationFrame(update)