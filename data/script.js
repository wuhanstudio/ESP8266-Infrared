
var power = 1;
var mode = 4;   // 0 Auto 1 Fan 2 Dehumid 3 Dry 4 Heat
var temperature = 25;
var speed = 1;
var dir = 2;

function setPower(_power) {
    this.power = _power;
}

function setMode(_mode) {
    this.mode = _mode;
}

function setTemp(_temperature) {
    this.temperature = _temperature;
}

function setSpeed(_speed) {
    this.speed = _speed;
}

function setDir(_dir) {
    this.dir = _dir;
}

function getPower(){
    return this.power;
}

function getMode() {
    return this.mode;
}

function getTemp() {
    return this.temperature;
}

function getSpeed() {
    return this.speed;
}

function getDir() {
    return this.dir;
}

function swing(){
    setDir(0);
    updateUI();
}

function send() {
    var url = "http://192.168.4.1/ir?";
    url += "power=" + this.power + '&'
               + "temp=" + this.temperature + '&'
               + "fan=" + this.speed + '&'
               + "mode=" + this.mode + '&'
               + "swing=" + this.dir;
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText);
    }
    xmlHttp.open("GET", url, true); // true for asynchronous 
    xmlHttp.send(null);
}

function combo() {
    var t1 = window.setTimeout(send(),6000);
    window.clearTimeout(t1);
    var t2 = window.setTimeout(send(),12000);
    window.clearTimeout(t2);
    var t3 = window.setTimeout(send(),18000);
    window.clearTimeout(t3);
}

function togglePower() {
    if(getPower() == 1){
        setPower(0);
    }
    else{
        setPower(1);
    }
    updateUI();
}

function toggleMode() {
    if(getMode() == 4){
        setMode(0);
    }
    else {
        setMode(getMode() + 1);
    }
    updateUI();
}

function toggleSpeed() {
    if(getSpeed() == 3){
        setSpeed(0);
    }
    else {
        setSpeed(getSpeed()+1);
    }
    updateUI();
}

function incTemp() {
    if (getTemp() >= 30) 
    {
        setTemp(30);
    }
    else
    {
        setTemp(getTemp() + 1);
    }
    updateUI();
}

function decTemp() {
    if(getTemp() <= 15)
    {
        setTemp(15);
    }
    else {
        setTemp(getTemp() - 1);
    }
    updateUI();
}

function toggleDir() {
    if(getDir() == 3){
        setDir(0);
    }
    else {
        setDir(getDir()+1);
    }
    updateUI();
}

function updateUI() {
    var str = 'Power: ' + getPower() + '\n';
    str += 'Mode: ' + getMode() + '\n';
    str += 'Temp: ' + getTemp() + '\n';
    str += 'Speed: ' + getSpeed() + '\n';
    str += 'Direction: ' + getDir() + '\n';
    // alert(str);

    // Power on/off
    if(getPower() == 1){
        document.getElementById('mode').style.visibility="visible";
        document.getElementById('med').style.visibility="visible";
        document.getElementById('bot').style.visibility="visible";        
    } 
    else {
        document.getElementById('mode').style.visibility ="hidden";
        document.getElementById('med').style.visibility ="hidden";
        document.getElementById('bot').style.visibility ="hidden";
    }

    // Chane Mode
    // 0 Auto, 1 Cool, 2 Dry, 3 Fan, 4 Heat
    document.getElementById('cool').classList.add('text-muted');
    document.getElementById('dry').classList.add('text-muted');
    document.getElementById('fan').classList.add('text-muted');
    document.getElementById('heat').classList.add('text-muted');

    if(getMode() == 1) document.getElementById('cool').classList.remove('text-muted');
    if(getMode() == 2) document.getElementById('dry').classList.remove('text-muted');
    if(getMode() == 3) document.getElementById('fan').classList.remove('text-muted');
    if(getMode() == 4) document.getElementById('heat').classList.remove('text-muted');
    
    //Change Temperature
    if(mode == 0)
    {
        document.getElementById('temp').innerHTML = 'Auto';
        document.getElementById('celcius').style.display="none";
    }
    else
    {
        document.getElementById('temp').innerHTML = getTemp();
        document.getElementById('celcius').style.display="inline";
    }

    // Change Speed
    if(getSpeed() == 0)
    {
        document.getElementById('speed').innerHTML = 'Auto';
    }
    else if(getSpeed() == 1)
    {

        document.getElementById('speed').innerHTML = 'Low';
    }
    else if(getSpeed() == 2)
    {
        document.getElementById('speed').innerHTML = 'Medium';
    }
    else if(getSpeed() == 3)
    {
        document.getElementById('speed').innerHTML = 'High';
    }
    else
    {
        document.getElementById('speed').innerHTML = 'Auto';
    }

    // Change Direction
    if(getDir() == 0)
    {
        document.getElementById('dir').innerHTML = 'Swing';
    }
    else if(getDir() == 1)
    {
        document.getElementById('dir').innerHTML = '↗';
    }
    else if(getDir() == 2)
    {
        document.getElementById('dir').innerHTML = '→';
    }
    else if(getDir() == 3)
    {
        document.getElementById('dir').innerHTML = '↘';
    }
    else
    {
        document.getElementById('dir').innerHTML = 'Swing';
    }

    send();
}

window.onload = function() {
    updateUI();
}