/*
    0: production
    1: thresholds
    2: details
    3: all
*/
var requestWarningsShowRows = 100
var loggingLevel = 1
function localLogger(message, level) {
    if(!loggingLevel) {
        loggingLevel = 0
    }
    if(loggingLevel >= level) {
        var now = new Date();
        console.log(now.toISOString().substring(0, 19), message)
    }
}

function getSessionId() {
    var cookieName = 'healthMonitoringSession'
    var currentSession = getCookie(cookieName)

    if(!currentSession || currentSession == '') {
        currentSession = makeid(15)
        setCookie(cookieName, currentSession, 1)
    }

    return currentSession
}

function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
 }

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
        c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
        }
    }
    return "";
}

function isNullOrEmpty(value) {
    return !value || value == ''
}

function replaceAll(string, search, replace) {
    return string.split(search).join(replace);
}

function getSafeName(name) {
    if(!name) {
        return name
    }
    var outString = name.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '');
    return outString
}

function getNestedValue(base, names) {
    return names.reduce((prev, curr) => prev && prev[curr], base)
}

function createNestedObject( base, names, value ) {
    // If a value is given, remove the last name and keep it for later:
    var lastName = arguments.length === 3 ? names.pop() : false;

    // Walk the hierarchy, creating new objects where needed.
    // If the lastName was removed, then the last object is not set yet:
    for( var i = 0; i < names.length; i++ ) {
        base = base[ names[i] ] = base[ names[i] ] || {};
    }

    // If a value was given, set it to the last name:
    if( lastName ) base = base[ lastName ] = value;

    // Return the last object in the hierarchy:
    return base;
}

function isobject (x){
    return Object.prototype.toString.call(x) === '[object Object]';
};

function getObjectPropertyPaths(obj, prefix, separator){
    var keys = Object.keys(obj);
    separator = separator ? separator : '.';
    prefix = prefix ? prefix + separator : '';
    return keys.reduce(function(result, key){
        if(isobject(obj[key])){
            result = result.concat(getObjectPropertyPaths(obj[key], prefix + key, separator));
        }else{
            result.push(prefix + key);
        }
        return result;
    }, []);
};

function initializeBrowserNotifications() {
    if (!("Notification" in window)) {
        console.warn('This browser does not handle notifications')    
        return
    } else if (Notification.permission === "granted") {
        // all good ...
    } else if (Notification.permission !== 'denied') {
        Notification.requestPermission(function (permission) {
            if (permission === "granted") {
                // all good ...
            }
        });
    }
}

function postJson(data) {
    data = JSON.stringify(data)
    $.post( "./", data,  function( responseData ) {
        if(responseData.status == 'FAIL') {
            alert(responseData.message)
        } else {
            
        }
    }, "json");
}

function getDJICommand(key) {
    var returnVal = null
    var distance = 20
    var angle = 20
    var height = 20
    switch(key) {
        case 'Space':
            if(flightMode == 'landed') {
                returnVal = 'takeoff'
                flightMode = 'inFlight'
            } else {
                returnVal = 'land'
                flightMode = 'landed'
            }
            break
        case 'ArrowLeft':
            returnVal = 'left ' + distance
            break
        case 'ArrowRight':
            returnVal = 'right ' + distance
            break
        case 'ArrowUp':
            returnVal = 'forward ' + distance
            break
        case 'ArrowDown':
            returnVal = 'back ' + distance
            break
        case 'KeyW':
            returnVal = 'up ' + height
            break
        case 'KeyS':
            returnVal = 'down ' + height
            break
        case 'KeyA':
            returnVal = 'ccw ' + angle
            break
        case 'KeyD':
            returnVal = 'cw ' + angle
            break
        case 'KeyY':
            returnVal = 'flip f'
            break
        case 'KeyH':
            returnVal = 'flip b'
            break
        case 'KeyG':
            returnVal = 'flip l'
            break
        case 'KeyJ':
            returnVal = 'flip r'
            break
    }
    return returnVal
}

var djiCommandHandles = {}
function runDJICommand(key) {
    if(djiCommandHandles[key]) {
        return
    }
    djiCommandHandles[key] = setTimeout(function() {
        djiCommandHandles[key] = null
    }, 500)

    var djiCommand = getDJICommand(key)
    if(!djiCommand) {
        return
    }

    postJson({action: djiCommand})
    $("#log").prepend(djiCommand + '<br>')
}


var keyHandles = {}
function handleKeyPressed(e) {
    console.log(` ${e.code}`)

    var usedClass = e.code
    $(".steerNode").removeClass('usingNodeNow')

    switch(e.code) {
        case 'Space':
            if(flightMode == 'landed') {
                $( "#SpaceLand" ).show()
                $( "#SpaceStart" ).hide()
                usedClass += 'Land' 
            } else {
                $( "#SpaceLand" ).hide()
                $( "#SpaceStart" ).show()            
                usedClass += 'Start' 
            }
            break
    }

    if(keyHandles[usedClass]) {
        clearTimeout(keyHandles[usedClass])
        keyHandles[usedClass] = null
    }

    keyHandles[usedClass] = setTimeout(function() {
        $("#" + usedClass).removeClass('usingNodeNow')
    }, 500)

    $("#" + usedClass).addClass('usingNodeNow')
    runDJICommand(e.code)
}

var flightMode = 'landed'
$(document).ready(function() {
    // globalGroupBy = $('#requestWarningsModal .groupWarningsBy').val()
    // $( "body" ).on( "click", ".submitFilterButton", function() {
    //     $("#chartCriteriaForm").submit()
    // });

    flightMode = 'landed'
    $( "#SpaceLand" ).hide()
    const log = document.getElementById('log');

    document.addEventListener('keydown', handleKeyPressed);
})


