const { error } = require("console");
const ModbusRTU = require("modbus-serial");
const { ppid } = require("process");

const activePLCs = {}; //list of ModbusRTU clients.

async function establishConnection(ipAddress, id) 
{
    if(!activePLCs[id])
    {
    try
        {
        const modbusClient = new ModbusRTU(); //connect if not already an active PLC at this connection

        await modbusClient.connectTCP(ipAddress);
        
        modbusClient.setID(id);
        activePLCs[id] = modbusClient;
        }
    catch(err)
        {
        console.log("Error in establishConnection function. Could not connect to: ", ipAddress," error msg: ", err);
        }
    }
    else
    {
        console.warn("Warning - you tried to connect to PLC ${id} despite a connection already being present");
    }
}

function getClient(id)
{
    const client = activePLCs[id];
    if (!client) throw new error('No client for PLC $(id). Please be careful!');
    return client;
}

async function disconnectPLC(id)
{
    const modbusClient = getClient(id);
    if(modbusClient)
    {
        modbusClient.close(() => {console.log('Disconnected from PLC ${id}');});
        delete activePLCs[id]
    }
}

async function setTag(modbusTag, state, id)
{
    const modbusClient = getClient(id);
    try
    {
        modbusClient.writeCoil(modbusTag, state);
    }
    catch(err)
    {
        console.log("Error in setTag function: PLC id ${id} ", err);
    }
}

async function readTag(modbusTag, id)
{
    const modbusClient = getClient(id);
    try
    {
        const resultingRead = await modbusClient.readCoils(modbusTag, 1);
    }
    catch(err)
    {
        console.log("Error in readTag function: PLC id ${id} ", err);
    }

    return resultingRead.data[0];


}


module.exports
{
    establishConnection, disconnectPLC, readTag, setTag
};

