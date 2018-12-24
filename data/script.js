
var power = 1;
var mode = 4;   // 0 Auto 1 Fan 2 Dehumid 3 Dry 4 Heat
var temperature = 22;
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
    if(getPower() == 1) $('.status').show();
    else $('.status').hide();
    // Chane Mode
    // 0 Auto, 1 Cool, 2 Dry, 3 Fan, 4 Heat
    $("#cool").addClass('text-muted');
    $("#dry").addClass('text-muted');
    $("#fan").addClass('text-muted');
    $("#heat").addClass('text-muted');
    if(getMode() == 1) $("#cool").removeClass('text-muted');
    if(getMode() == 2) $("#dry").removeClass('text-muted');
    if(getMode() == 3) $("#fan").removeClass('text-muted');
    if(getMode() == 4) $("#heat").removeClass('text-muted');
    
    //Change Temperature
    if(mode == 0)
    {
        $("#temp").text('Auto');
        $("#celcius").hide();
    }
    else
    {
        $("#temp").text(getTemp());
        $("#celcius").show();
    }

    // Change Speed
    if(getSpeed() == 0)
    {
        $('#speed').text('自动')
    }
    else if(getSpeed() == 1)
    {
        $('#speed').text('低')
    }
    else if(getSpeed() == 2)
    {
        $('#speed').text('中')
    }
    else if(getSpeed() == 3)
    {
        $('#speed').text('高')
    }
    else
    {
        $('#speed').text('自动')
    }

    // Change Direction
    if(getDir() == 0)
    {
        $('#dir').text('扫风')
    }
    else if(getDir() == 1)
    {
        $('#dir').text('↗')
    }
    else if(getDir() == 2)
    {
        $('#dir').text('→')
    }
    else if(getDir() == 3)
    {
        $('#dir').text('↘')
    }
    else
    {
        $('#dir').text('扫风')
    }

    send();
}