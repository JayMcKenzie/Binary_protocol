// Load the TCP Library
net = require('net');
var BitArray = require('node-bitarray');
const fs = require('fs');
eval(fs.readFileSync('common.js')+''); 

var clients = [];                                                            
var lastid = 10;                                                             

function onData(socket, buffer) {                                              
    var data = BitArray.fromBuffer(buffer);
    console.log(data.join(''));
    var operation_code = readInt(data, OPCODE_INDEX, OPCODE_LEN);                                
    var liczba1 = readInt(data, LICZBA1_INDEX, LICZBA1_LEN);
    var liczba2 = readInt(data, LICZBA2_INDEX, LICZBA2_LEN);
    var liczba3 = readInt(data, LICZBA3_INDEX, LICZBA3_LEN);
    var liczba3 = readInt(data, LICZBA3_INDEX, LICZBA3_LEN);
    var mode = readInt(data, MODE_INDEX, MODE_LEN);
    var status = readInt(data, STATUS_INDEX, STATUS_LEN);
    var session_id = readInt(data, SESSIONID_INDEX, SESSIONID_LEN);                                 
    console.log("OPCODE: "+operation_code+", liczba1: "+liczba1+", liczba2: "+liczba2+", liczba3: "+liczba3+", status: "+status+", session id: "+session_id);
    switch(operation_code) {
        case SUBTRACT: {
            var wynik = liczba1-liczba2-liczba3;
            var ujemna = wynik < 0;
            var bits = BitArray.factory(0, 112, false); 
            if(ujemna)
            bits = putInt(bits, OPCODE_INDEX, OPCODE_LEN, SUBTRACT);
            bits = putInt(bits, LICZBA3_INDEX, LICZBA3_LEN, wynik);
            bits = putInt(bits, STATUS_INDEX, STATUS_LEN, (ujemna ? 3 : 0));
            bits = putInt(bits, SESSIONID_INDEX, SESSIONID_LEN, socket.identyfikator);
            bits = putInt(bits, MODE_INDEX, MODE_LEN, 1);
            sendData(socket, bits);

            var arr = [];
            arr['Operacja'] = 'odejmowanie';
            arr['czas'] = Math.floor(new Date() / 1000);
            sendData(arrToStr(arr));
            break;
        }
        case DIVIDE: { 
            var wynik = Math.floor(liczba1/liczba2/liczba3);
            var dividebyzero = false;
            var bits = BitArray.factory(0, 112, false); 
            if(liczba2 == 0 || liczba3 == 0) {
                dividebyzero = true;
            }
            bits = putInt(bits, OPCODE_INDEX, OPCODE_LEN, DIVIDE);
            bits = putInt(bits, LICZBA3_INDEX, LICZBA3_LEN, wynik);
            bits = putInt(bits, STATUS_INDEX, STATUS_LEN, (dividebyzero ? 2 : 0));
            bits = putInt(bits, SESSIONID_INDEX, SESSIONID_LEN, socket.identyfikator);
            bits = putInt(bits, MODE_INDEX, MODE_LEN, 1);
            sendData(socket, bits);
            break;
        }
        case MULTIPLY: {
            var wynik = Math.floor(liczba1*liczba2*liczba3);
            var bits = BitArray.factory(0, 112, false); 
            var overflow = dec2bin(wynik).length > 31;
            bits = putInt(bits, OPCODE_INDEX, OPCODE_LEN, DIVIDE);
            bits = putInt(bits, LICZBA3_INDEX, LICZBA3_LEN, wynik);
            bits = putInt(bits, STATUS_INDEX, STATUS_LEN, (overflow ? 1 : 0));
            bits = putInt(bits, SESSIONID_INDEX, SESSIONID_LEN, socket.identyfikator);
            bits = putInt(bits, MODE_INDEX, MODE_LEN, 1);
            sendData(socket, bits);
            break;
        }
        case ADD: { 
            var wynik = liczba1+liczba2+liczba3;
            var overflow = dec2bin(wynik).length > 31;
            var bits = BitArray.factory(0, 112, false); 
            bits = putInt(bits, OPCODE_INDEX, OPCODE_LEN, ADD);
            bits = putInt(bits, LICZBA3_INDEX, LICZBA3_LEN, wynik);
            bits = putInt(bits, STATUS_INDEX, STATUS_LEN, (overflow ? 1 : 0));
            bits = putInt(bits, SESSIONID_INDEX, SESSIONID_LEN, socket.identyfikator);
            bits = putInt(bits, MODE_INDEX, MODE_LEN, 1);
            sendData(socket, bits);
            break;
        }
    }
}
function onConnect(socket) {                                               
    console.log("Klient sie podlaczyl");                         
    socket.identyfikator = lastid++;                                          
    var bits = BitArray.factory(0, 112, false);
    bits = putInt(bits, OPCODE_INDEX, OPCODE_LEN, ASSIGN_SESSION_ID);
    bits = putInt(bits, SESSIONID_INDEX, SESSIONID_LEN, socket.identyfikator);
    bits = putInt(bits, MODE_INDEX, MODE_LEN, 0);
    sendData(socket, bits);
}
function onClientLeave(socket) { 
    console.log("Klient wyszedl: "+socket.name);
}

net.createServer(function (socket) {

  // Identify this client
  socket.name = socket.remoteAddress + ":" + socket.remotePort;

  // Put this new client in the list
  clients.push(socket);
    onConnect(socket);
  // Handle incoming messages from clients.
  socket.on('data', function (data) {
    //broadcast(socket.name + "> " + data, socket);
    onData(socket, data);
  });

  // Remove the client from the list when it leaves
  socket.on('end', function () {
    clients.splice(clients.indexOf(socket), 1);
    onClientLeave(socket);
  });
  socket.on('error', function () {
    console.log("Polaczenie klienta zresetowane");
  });
  // Send a message to all clients
  function broadcast(message, sender) {
    clients.forEach(function (client) {
      // Don't want to send it to sender
      if (client === sender) return;
      client.write(message);
    });
    // Log it to the server output too
    console.log("Wysylanie: "+message);
  }

}).listen(1203);

// Put a friendly message on the terminal of the server.
console.log("Serwer działa i oczekuje na dane\n");