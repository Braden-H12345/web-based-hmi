"use client";

import React, {Children, createContext, useContext} from 'react';

interface PLCContextType
{
    plcId: number;
}

const PLCContext = createContext<PLCContextType | null>(null);

export const usePLC = () => {
    const context = useContext(PLCContext);
    if (!context) throw new Error("usePLC must be used inside a PLCProvider");
    return context
};

export const PLCProvider = ({
    plcId,
    children
}: {
    plcId: number;
    children: React.ReactNode;
}) => {
    return (
        <PLCContext.Provider value= {{plcId}}>
            {children}
        </PLCContext.Provider>
    );
};
