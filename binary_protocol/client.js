net = require('net');
var BitArray = require('node-bitarray');
const fs = require('fs');
eval(fs.readFileSync('common.js')+'');
function onData(socket, buffer) {
    var data = BitArray.fromBuffer(buffer);
    console.log(data.join(''));
    var operation_code = readInt(data, OPCODE_INDEX, OPCODE_LEN);                                       
    var liczba1 = readInt(data, LICZBA1_INDEX, LICZBA1_LEN);
    var liczba2 = readInt(data, LICZBA2_INDEX, LICZBA2_LEN);
    var liczba3 = readInt(data, LICZBA3_INDEX, LICZBA3_LEN);
    var status = readInt(data, STATUS_INDEX, STATUS_LEN);
    var session_id = readInt(data, SESSIONID_INDEX, SESSIONID_LEN);                                  
    var mode = readInt(data, MODE_INDEX, MODE_LEN);
    console.log("OPCODE: "+operation_code+", liczba1: "+liczba1+", liczba2: "+liczba2+", liczba3:"+liczba3+", status: "+status+", session id: "+session_id+", mode: "+mode);
    if(mode == 0) { 
        switch(operation_code) {
            case (ASSIGN_SESSION_ID): {
                console.log("Ustawiono identyfikator "+session_id);
                socket.identyfikator = session_id;
                break;
            }
        }
    } else {
        switch(operation_code) {
            case ADD:
            case SUBTRACT:
            case DIVIDE:
            case MULTIPLY: {
                var wynik = readInt(data, LICZBA3_INDEX, LICZBA3_LEN);
                console.log("Otrzymano wynik: "+wynik);
                if(status == 1) {
                    console.log("Nastąpiło przepełnienie!");
                } else if(status == 2) {
                    console.log("Dzielenie przez zero!");
                }
                else if(status == 3) {
                    console.log("Liczba ujemna!");
                }
                break;
            }
        }
    }
}

var ip = "localhost";
var port = 1203;
process.argv.forEach(function (val, index, array) { 
    if(index == 2) {
        ip = val;
    }
    if(index == 3) {
        port = val;
    }
  });
var client = new net.Socket();
client.connect(port, ip, function() {
    console.log('Połączono');
});

client.on('data', function(data) {
    onData(client, data);
});

client.on('close', function() {
	console.log('Połączenie zamknięte');
});
client.on('error', function() {
	console.log('Połączenie zresetowane');
});


    var stdin = process.openStdin();

    stdin.addListener("data", function(d) {
        var str = d.toString().trim().split(' ');
        switch(str[0].toLowerCase()) {
            case('add'): {
                var liczba1 = Number(str[1]);
                var liczba2 = Number(str[2]);
                var liczba3 = Number(str[3]);
                var bits = BitArray.factory(0, 112, true); 
                bits = putInt(bits, OPCODE_INDEX, OPCODE_LEN, ADD);
                bits = putInt(bits, LICZBA1_INDEX, LICZBA1_LEN, liczba1);
                bits = putInt(bits, LICZBA2_INDEX, LICZBA2_LEN, liczba2);
                bits = putInt(bits, LICZBA3_INDEX, LICZBA3_LEN, liczba3);
                bits = putInt(bits, STATUS_INDEX, STATUS_LEN, 0);
                bits = putInt(bits, SESSIONID_INDEX, SESSIONID_LEN, client.identyfikator);
                sendData(client, bits);
                break;
            }
            case('subtract'):
            {
                var liczba1 = Number(str[1]);
                var liczba2 = Number(str[2]);
                var liczba3 = Number(str[3]);
                var bits = BitArray.factory(0, 112, true); 
                bits = putInt(bits, OPCODE_INDEX, OPCODE_LEN, SUBTRACT);
                bits = putInt(bits, LICZBA1_INDEX, LICZBA1_LEN, liczba1);
                bits = putInt(bits, LICZBA2_INDEX, LICZBA2_LEN, liczba2);
                bits = putInt(bits, LICZBA3_INDEX, LICZBA3_LEN, liczba3);
                bits = putInt(bits, STATUS_INDEX, STATUS_LEN, 0);
                bits = putInt(bits, SESSIONID_INDEX, SESSIONID_LEN, client.identyfikator);
                sendData(client, bits);
                break;
            }
            case('divide'): {
                var liczba1 = Number(str[1]);
                var liczba2 = Number(str[2]);
                var liczba3 = Number(str[3]);
                var bits = BitArray.factory(0, 112, true); 
                bits = putInt(bits, OPCODE_INDEX, OPCODE_LEN, DIVIDE);
                bits = putInt(bits, LICZBA1_INDEX, LICZBA1_LEN, liczba1);
                bits = putInt(bits, LICZBA2_INDEX, LICZBA2_LEN, liczba2);
                bits = putInt(bits, LICZBA3_INDEX, LICZBA3_LEN, liczba3);
                bits = putInt(bits, STATUS_INDEX, STATUS_LEN, 0);
                bits = putInt(bits, SESSIONID_INDEX, SESSIONID_LEN, client.identyfikator);
                sendData(client, bits);
                break;
            }
            case('multiply'): {
                var liczba1 = Number(str[1]);
                var liczba2 = Number(str[2]);
                var liczba3 = Number(str[3]);
                var bits = BitArray.factory(0, 112, true); 
                bits = putInt(bits, OPCODE_INDEX, OPCODE_LEN, MULTIPLY);
                bits = putInt(bits, LICZBA1_INDEX, LICZBA1_LEN, liczba1);
                bits = putInt(bits, LICZBA2_INDEX, LICZBA2_LEN, liczba2);
                bits = putInt(bits, LICZBA3_INDEX, LICZBA3_LEN, liczba3);
                bits = putInt(bits, STATUS_INDEX, STATUS_LEN, 0);
                bits = putInt(bits, SESSIONID_INDEX, SESSIONID_LEN, client.identyfikator);
                sendData(client, bits);
                break;
            }
            case('exit'): {
                client.destroy();
                process.exit(0);
            }
        }
    });
