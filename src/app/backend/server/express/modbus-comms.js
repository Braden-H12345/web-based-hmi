import ModbusRTU from "modbus-serial";

/**
 * Registry of active PLC connections keyed by id.
 * We store metadata so we can tell if a new connect request changes target.
 * Shape: id -> { client: ModbusRTU, host, port, unitId }
 */
const activePLCs = {}; // Map of ID -> { client, host, port, unitId }

const isClientOpen = (c) =>
  typeof c?.isOpen === "function" ? c.isOpen() : !!c?.isOpen;

function resolveTag(tag) {
  const num = parseInt(tag);

  if (num >= 1 && num <= 99999) {
    // Coils 000001–099999 (1-based) -> readCoils at zero-based
    return { func: "readCoils", address: num - 1 };
  }
  if (num >= 100001 && num <= 199999) {
    // Discrete Inputs 100001–199999
    return { func: "readDiscreteInputs", address: num - 100001 };
  }
  if (num >= 300001 && num <= 399999) {
    // Input Registers 300001–399999
    return { func: "readInputRegisters", address: num - 300001 };
  }
  if (num >= 400001 && num <= 499999) {
    // Holding Registers 400001–499999
    return { func: "readHoldingRegisters", address: num - 400001 };
  }
  throw new Error(`Unsupported Modbus tag format: ${tag}`);
}

function getEntry(id) {
  const entry = activePLCs[id];
  if (!entry) throw new Error(`No client for PLC ${id}. Please be careful!`);
  return entry;
}

async function safeClose(client) {
  try {
    if (isClientOpen(client)) {
      await new Promise((resolve) => client.close(() => resolve()));
    }
  } catch {
    // ignore
  }
}

// CONNECT TO PLC
export async function establishConnection(ipAddress, portToUse, id, unitId) {
  if (!ipAddress || !portToUse) {
    throw new Error("Missing ip or port");
  }

  const resolvedUnit = typeof unitId === "number" ? unitId : Number(id) || 1;

  const existing = activePLCs[id];

  // If we already have a client open to the same target, reuse it
  if (
    existing &&
    isClientOpen(existing.client) &&
    existing.host === ipAddress &&
    existing.port === portToUse &&
    existing.unitId === resolvedUnit
  ) {
    console.warn(`Warning - already connected to PLC ${id}`);
    return;
  }

  // If we have a client but it's to a different target, or it's closed—close it first.
  if (existing?.client) {
    await safeClose(existing.client);
    delete activePLCs[id];
  }

  // Create and connect a fresh client
  const modbusClient = new ModbusRTU();
  await modbusClient.connectTCP(ipAddress, { port: portToUse });
  modbusClient.setID(resolvedUnit);
  modbusClient.setTimeout(1000);

  activePLCs[id] = {
    client: modbusClient,
    host: ipAddress,
    port: portToUse,
    unitId: resolvedUnit,
  };

  console.log("Connection established");
  console.log("ipAddress: ", ipAddress);
  console.log("port: ", portToUse);
  console.log("id (plcId): ", id, "unitId: ", resolvedUnit);
  console.log("[modbus] isOpen type:", typeof modbusClient.isOpen, "value:", modbusClient.isOpen);
}

// DISCONNECT FROM PLC
export async function disconnectPLC(id) {
  const entry = getEntry(id);
  if (entry?.client) {
    await safeClose(entry.client);
    console.log(`Disconnected from PLC ${id}`);
  }
  delete activePLCs[id];
}

// SET PLC TAG (writes a coil)
export async function setTag(modbusTag, state, id) {
  if (modbusTag == null) throw new Error("Missing tag");
  const address = Number(modbusTag) - 1;

  if (!Number.isInteger(address) || address < 0) {
    console.error("Address out of range:", address);
    throw new RangeError(`Actual tag must be >= 0. Got ${address}`);
  }

  const entry = getEntry(id);
  const modbusClient = entry.client;

  if (!isClientOpen(modbusClient)) {
    throw new Error(`Client for PLC ${id} is not open`);
  }

  try {
    await modbusClient.writeCoil(address, !!state);
  } catch (err) {
    console.log(`Error in setTag: PLC ${id}`, err);
    throw err;
  }
}

// READ PLC TAG VALUE (uses resolveTag mapping)
export async function readTag(modbusTag, id) {
  const entry = getEntry(id);
  const modbusClient = entry.client;

  if (!isClientOpen(modbusClient)) {
    throw new Error(`Client for PLC ${id} is not open`);
  }

  const { func, address } = resolveTag(modbusTag);

  try {
    const result = await modbusClient[func](address, 1);
    return result.data?.[0] ?? false;
  } catch (err) {
    console.error(`Error in readTag: PLC ${id}`, err);
    return false;
  }
}

// Optional: cleanup on process exit to free sockets
process.on("SIGINT", async () => {
  const ids = Object.keys(activePLCs);
  for (const id of ids) {
    try {
      await disconnectPLC(id);
    } catch {}
  }
  process.exit(0);
});