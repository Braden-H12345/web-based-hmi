"use client";

import {useEffect} from "react";
import Image from "next/image";
import { PLCProvider } from "./components/Context/PLCContext";
import MomentaryButton from "./components/HMI-Components/MomentaryButton"
import HMITestPage from "./components/HMI Pages/HMITestPage"

export default function Home() {

  return (
    <div>
      <HMITestPage></HMITestPage>
    </div>
  );
}
