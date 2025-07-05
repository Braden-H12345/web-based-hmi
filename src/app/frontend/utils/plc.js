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