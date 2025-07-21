"use client";

import { usePLC } from "../Context/PLCContext"
import {useEffect, useState} from "react";

interface ToggleButtonProps
{
    modbusTag: number;
    label?: string;
}

function ToggleButton({modbusTag = 1, label = "Default Label"}: ToggleButtonProps)
{
    const {plcId} = usePLC();
    //starts false
    const [toggled, setToggled] = useState(false);

    const handleClick = async () => {

        //record a new state which is the opposite of toggled
        const newState = !toggled;
        
        try
        {
            await fetch(`/api/plc/${plcId}/write`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ tag: modbusTag, value: newState}),
            });

            setToggled(newState);
        }
        catch(err)
        {
            console.error(`Failed to write coil (PLC ${plcId}):`, err);
        }
    };

    const bgColor = toggled ? "red" : "grey";


    return <button style={{padding:'10px 20px', backgroundColor: bgColor, color: 'greenyellow'}}onClick={handleClick}>{label}</button>;

};

export default ToggleButton;