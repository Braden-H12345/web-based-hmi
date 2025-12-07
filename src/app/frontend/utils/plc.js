/*
THIS PAGE IS REDUNDANT. BUT I WILL KEEP IT HERE IN CASE IT IS EVER NEEDED. 
Original idea was to have classes that are just PLCs and React uses that to construct the pages with some defined indicators or buttons
Then the communication could happen based on the PLC that is defined in that page
Ended up going a different direction though
*/
class PLC {
    constructor(name, ipAddress, port, defaultModbusAddress) //defaultModbusAddress refers to the "always on bit" that denotes that the PLC is active
    {
        this.name = name;
        this.ipAddress = ipAddress;
        this.port = port
        this.defaultModbusAddress = defaultModbusAddress;
        this.status = false;
    }

}

export default PLC;