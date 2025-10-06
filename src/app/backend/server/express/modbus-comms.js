import ModbusRTU from "modbus-serial";

const activePLCs = {}; // Map of ID -> ModbusRTU client


//internal function to resolve tags into the proper format for modbus addresses. DO NOT EXPORT. DO NOT WANT THIS ACCESSIBLE TO ANYTHING OUTSIDE COMMS
function resolveTag(tag) {
  const num = parseInt(tag);

  if (num >= 1 && num <= 99999) {
    return { func: 'readCoils', address: num - 1 };
  }
  if (num >= 100001 && num <= 199999) {
    return { func: 'readDiscreteInputs', address: num - 100001 };
  }
  if (num >= 300001 && num <= 399999) {
    return { func: 'readInputRegisters', address: num - 300001 };
  }
  if (num >= 400001 && num <= 499999) {
    return { func: 'readHoldingRegisters', address: num - 400001 };
  }
  throw new Error(`Unsupported Modbus tag format: ${tag}`);
}


//CONNECT TO PLC
export async function establishConnection(ipAddress,portToUse, id) {
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
export async function disconnectPLC(id) {
    const modbusClient = getClient(id);
    if (modbusClient) {
        modbusClient.close(() => {
            console.log(`Disconnected from PLC ${id}`);
        });
        delete activePLCs[id];
    }
}


//SET PLC TAG
export async function setTag(modbusTag, state, id) {
  const address = modbusTag - 1;

  if (address < 0) {
    console.error("Address out of range:", address);
    throw new RangeError(`Actual tag must be >= 0. Got ${address}`);
  }

  const modbusClient = getClient(id);

  if (!modbusClient) {
    throw new Error(`No client for PLC ${id}`);
  }

  if (!modbusClient.isOpen) {
    throw new Error(`Client for PLC ${id} is not open`);
  }

  try {
    await modbusClient.writeCoil(address, state);
  } catch (err) {
    console.log(`Error in setTag: PLC ${id}`, err);
  }
}


//READ PLC TAG VALUE
export async function readTag(modbusTag, id) {
    const modbusClient = getClient(id);
    const { func, address } = resolveTag(modbusTag);

  try {
    const result = await modbusClient[func](address, 1);
    return result.data?.[0] ?? false;
  } catch (err) {
    console.error(`Error in readTag: PLC ${id}`, err);
    return false;
  }
}

