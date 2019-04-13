String.prototype.replaceAt=function(index, replacement) {
    return this.substr(0, index) + replacement+ this.substr(index + replacement.length);
}
function arrToStr(arr) {
    var kluczowartosci = [];
    for(var i in arr) {
        kluczowartosci.push(i+"-)"+arr[i])
    }
    return kluczowartosci.join("(|");
}
function reverse(str) {
    var splitString = str.split("");
    var reverseArray = splitString.reverse(); 
    var joinArray = reverseArray.join(""); 
    return joinArray; 
}
function sendData(socket, str) {                                            
    socket.write(str);                                 
}

var ASSIGN_SESSION_ID = 0x03;                                                
var SUBTRACT = 0x00;                                                        
var DIVIDE = 0x01;                                                          
var ADD = 0x02;                                                             
var MULTIPLY = 0x03;                                                        

var OPCODE_INDEX = 0;
var OPCODE_LEN = 2;
var LICZBA1_INDEX = 2;
var LICZBA1_LEN = 32;
var LICZBA2_INDEX = 34;
var LICZBA2_LEN = 32;
var LICZBA3_INDEX = 66;
var LICZBA3_LEN = 32;
var STATUS_INDEX = 98;
var STATUS_LEN = 4;
var SESSIONID_INDEX = 102;
var SESSIONID_LEN = 6;
var MODE_INDEX = 108;
var MODE_LEN = 1;