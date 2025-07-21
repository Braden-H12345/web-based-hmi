"use client";

import { PLCProvider } from "../Context/PLCContext";
import { MomentaryButton, Indicator } from "@/app/components/HMI-Components/import-index";

export default function TestPage() {
const pagePLCId = 44;
const ip =  "192.168.100.20";
const port = 502;

return (
    <PLCProvider plcId={pagePLCId}>
      <div className="hmi-page">
        <MomentaryButton modbusTag={333} label="Testing" />
        <Indicator modbusTag={555} label="Testing 2" shape="circle" />
      </div>
    </PLCProvider>
  );
}