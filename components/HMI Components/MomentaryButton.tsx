"use client";

import { usePLC } from "../Context/PLCContext"

interface MomentaryButtonProps{
    modbusTag: number;
    label?: string;
    timeActive?: number;
}


function MomentaryButton({modbusTag=210, label="Default Label", timeActive = 1000}: MomentaryButtonProps)
{
    const { plcId } = usePLC();

    const handleClick = async () => {

        try{

        console.log("Sending write request:", {
        tag: modbusTag,
        value: true,
        plcId
        });

        // Write TRUE to the tag
        await fetch(`/api/plc/${plcId}/write`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tag: modbusTag, value: true }),
        });


        // Wait for the configured duration
        await new Promise((res) => setTimeout(res, timeActive));

        // Write FALSE to the tag
        await fetch(`/api/plc/${plcId}/write`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tag: modbusTag, value: false }),
        });

        }
        catch(err)
        {
            console.error(`Failed to write coil (PLC ${plcId}):`, err);
        }

    };



    return <button style={{padding:'10px 20px', backgroundColor: 'grey', color: 'greenyellow'}}onClick={handleClick}>{label}</button>;

    

};

export default MomentaryButton;
