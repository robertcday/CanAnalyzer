const { ipcRenderer } = require('electron');

const portSelect = document.getElementById('port-select');
const startBtn = document.getElementById('start-btn');
const stopBtn = document.getElementById('stop-btn');
const refreshBtn = document.getElementById('refresh-btn');
const dataTable = document.getElementById('data-table').getElementsByTagName('tbody')[0];

// Request available serial ports from backend
window.addEventListener('DOMContentLoaded', () => {
    ipcRenderer.send('refresh-ports');
});

startBtn.onclick = () => {
  const port = portSelect.value;
  localStorage.setItem('selectedPort', port);
  ipcRenderer.send('start-listen', port);
};

stopBtn.onclick = () => {
  ipcRenderer.send('stop-listen');
};

refreshBtn.onclick = () => {
  ipcRenderer.send('refresh-ports');
};

ipcRenderer.on('refresh-ports', (event, portsStr) => {
    const ports = portsStr.split('\n').filter(Boolean);
    portSelect.innerHTML = '';
    ports.forEach(port => {
      const opt = document.createElement('option');
      opt.value = port;
      opt.textContent = port;
      portSelect.appendChild(opt);
    });
    const selectedPort = localStorage.getItem('selectedPort');
    if (selectedPort) {
        const opt = Array.from(portSelect.options).find(o => o.value === selectedPort);
        if (opt) {
            portSelect.value = selectedPort;
        }
    }
});

ipcRenderer.on('serial-data', (event, line) => {
  const now = new Date().toLocaleTimeString();
  const row = dataTable.insertRow(0);
  row.insertCell(0).textContent = now;
  row.insertCell(1).textContent = line.trim();
});
