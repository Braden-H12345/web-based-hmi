//test-plc-server.js

// create an empty modbus client
const ModbusRTU = require("modbus-serial");

const vector = {
  readCoils: function (addr, unitID) {
    console.log(`readCoils called with addr=${addr}, unitID=${unitID}`);
    return Promise.resolve({ data: [(addr % 2) === 0] });
  },
  writeCoil: function (addr, value, unitID) {
    console.log(`writeCoil called with addr=${addr}, value=${value}, unitID=${unitID}`);
    return Promise.resolve();
  }
};

const serverTCP = new ModbusRTU.ServerTCP(vector, {
  host: '0.0.0.0'
});