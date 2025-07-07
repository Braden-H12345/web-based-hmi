const ModbusRTU = require("modbus-serial");

const activePLCs = {}; // Map of ID -> ModbusRTU client


//CONNECT TO PLC
async function establishConnection(ipAddress,portToUse, id) {
    if (!activePLCs[id]) {
        try {
            console.log('Connection established');
            const modbusClient = new ModbusRTU();
            await modbusClient.connectTCP(ipAddress,{port: portToUse});
            modbusClient.setID(id);
            modbusClient.setTimeout(1000);
            activePLCs[id] = modbusClient;
            console.log('ipAddress: ', ipAddress);
            console.log('port: ', portToUse);
            console.log('id: ', id);

        } catch (err) {
            console.log(`Error in establishConnection for ${ipAddress}:`, err);
        }
    } else {
        console.warn(`Warning - already connected to PLC ${id}`);
    }
}

function getClient(id) {
    const client = activePLCs[id];
    if (!client) throw new Error(`No client for PLC ${id}. Please be careful!`);
    return client;
}


//DISCONNECT FROM PLC
async function disconnectPLC(id) {
    const modbusClient = getClient(id);
    if (modbusClient) {
        modbusClient.close(() => {
            console.log(`Disconnected from PLC ${id}`);
        });
        delete activePLCs[id];
    }
}


//SET PLC TAG
async function setTag(modbusTag, state, id) {
    const modbusClient = getClient(id);
    try {
        console.log('Writing coil');
        console.log('data: ', modbusTag, " for id: ", id, " to: ", state);
        await modbusClient.writeCoil(modbusTag, state);
        console.log('data after writeCoil method: ', modbusTag, " for id: ", id, " to: ", state);
    } catch (err) {
        console.log(`Error in setTag: PLC ${id}`, err);
    }
}


//READ PLC TAG VALUE
async function readTag(modbusTag, id) {
    const modbusClient = getClient(id);
    try {
        console.log('Reading coil');
        const result = await modbusClient.readCoils(modbusTag, 1);
        console.log('Read result:', result);

        const value = result.data?.[0] ?? false;
        console.log('Returning coil value:', value);
        return value;
    } catch (err) {
        console.log(`Error in readTag: PLC ${id}`, err);
        return false; // Fail-safe default
    }
}

module.exports = {
    establishConnection,
    disconnectPLC,
    readTag,
    setTag
};

