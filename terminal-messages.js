const terminal_message = new Object(null)

terminal_message.vitals1 = `--------------------------<br>
<span class="blue">Vital</span> Extraction Initiated
<br>--------------------------`
terminal_message.vitals2 = 'Identifying users with local key...'
terminal_message.vitals3 = 'Extracting <span class="blue">Vitals</span> from Biomarkers...'
terminal_message.vitals4 = '<span class="blue">Vitals</span> Logged and Historical Data Cleared'

terminal_message.risk1 =  `--------------------------<br>
<span class="blue">Risk</span> Calculation Initiated
<br>--------------------------`
terminal_message.risk2 = 'Running Machine Learning from new <span class="blue">Vitals</span>...<br>'

terminal_message.dashedLines = '<br>--------------------------<br>'

terminal_message.seeDoctor1 = 'Risk threshold breached - send user notification'

terminal_message.training1 = 'MILA.HEALTH Initiating Local <span class="yellow">Training</span>.'

terminal_message.localTrainingOver = 'Local <span class="yellow">Training</span> complete.'

terminal_message.globalTraining1 = 'MILA.HEALTH Initiating Global <span class="yellow">Training</span>'

terminal_message.globalTraining2 = 'Sending local parameters to NHS server.'

terminal_message.globalTraining3 = 'Global <span class="yellow">Training</span> in process = <span class="green">true</span>.'

terminal_message.globalTraining4 = 'Global <span class="yellow">Training</span> complete.'

export default Object.freeze(terminal_message)