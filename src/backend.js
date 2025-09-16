const SerialPort = require('serialport');

let portInstance = null;
let parser = null;

function listPorts() {
  return SerialPort.SerialPort.list().then(ports => ports.map(p => p.path));
}

function startListening(portPath, onData, onError) {
  if (portInstance) {
    portInstance.close();
    portInstance = null;
  }
  portInstance = new SerialPort.SerialPort({ path: portPath, baudRate: 250000 });
  parser = portInstance.pipe(new SerialPort.ReadlineParser({ delimiter: '\n' }));
  parser.on('data', onData);
  portInstance.on('error', onError);
}

function stopListening() {
  if (portInstance) {
    portInstance.close();
    portInstance = null;
  }
}

module.exports = { listPorts, startListening, stopListening };
