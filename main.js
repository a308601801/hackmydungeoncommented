'use strict';

// In order to have the console.log() and console.error() displayed in our own console:
// We use an IIFE (Immediately Invoked Function Expression)
// an IIFE is a JavaScript function that runs as soon as it is defined.
// syntax in like this: (function(){...code...})()
(function() {
    // here we'll stock the console.log and console.error,
    // to keep the original version of them safe.
    let _log = console.log;
    let _error = console.error;

    // now we can change the global console.error...
    console.error = function(errMessage) {
        // we insert our own console, and display the error Message
        document.getElementById('console').innerHTML = 'Error: ' + errMessage;
        // the we re-connect the normal console (since we kept it safe)
        // with the arguments that are destined for it
        // (arguments are the arguments of the function, console is the CONTEXT of the function)
        _error.apply(console, arguments);
        // now the normal console still work as intended for errors.
    };

    // now we can change the global console.log...
    console.log = function(logMessage) {
        // we insert our own console, and display the log Message
        document.getElementById('console').innerHTML = logMessage;
        // the we re-connect the normal console (since we kept it safe)
        // with the arguments that are destined for it
        _log.apply(console, arguments);
        // now the normal console still work as intended for logs.
    };
})();

//
// We like to keep our files organized.
// first, the variables,
// then, the event-listeners,
// then, the functions.
//

// The variables.
//
// time to stock our buttons in lighter and manipulable variables
const sourceBtn = document.getElementById('viewSource');
const runBtn = document.getElementById('runCode');
// then do the same with our own console
const cons = document.getElementById('console');
// We'll need a XHR object
// We declare it in the global scope, for it to be accessible by two different functions.
let xhr;

// The event-listeners.
//
// for the two buttons.
sourceBtn.addEventListener('click', displaySourceCode);
runBtn.addEventListener('click', runCode);

// this event listener will call the runCode function when the player press the 'enter' key (13)
document.onkeypress = function(e) {
    // the key press fire an event e.
    // We assure ourselves to get the right event 
    // depending on the browser, the event might be stocked into window.event
    e = e || window.event;
    // use e.keyCode.
    // if e.keycode is 13, it means that enter was pressed.
    // else, it's another key. We're not interrested.
    if (e.keyCode === 13) runCode();
};

// the functions.
//
function displaySourceCode() {
    // create a new request.
    xhr = new XMLHttpRequest();
    // Open the request, to 'get' the file room.js. asynchronously.
    xhr.open("GET", './room.js', true);
    // We set the type of the response to 'text'. We'll just display the content of the file
    xhr.responseType = 'text';
    // Send the request.
    xhr.send();
    // event-listener: when the request change state, we'll check the state in preocessRequest()
    xhr.onreadystatechange = processRequest;
}

function processRequest(e) {
    // processRequest is called everytime the xhr changes status
    if (xhr.readyState == 4 && xhr.status == 200) {
        // State 4 and code 200, we're ok to go.
        // load the reponseText into our console.
        cons.innerHTML = xhr.responseText.toString();
    }
}

function runCode() {
    // get and stock the input element.
    let inpt = document.getElementsByTagName('input')[0];
    // what the player typed is inside the value of the input.
    // we'll try to evaluate what the player has written, as Javascript
    // if there's an error, we'll catch it, and display it in Our console.
    try {
        // eval is a native method.
        eval(inpt.value);
    } catch (error) {
        console.log(error)
    }
    // then erase the content of the input.
    inpt.value = '';
}