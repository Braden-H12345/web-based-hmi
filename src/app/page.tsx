"use client";

import {useEffect} from "react";
import Image from "next/image";
import { PLCProvider } from "../../components/Context/PLCContext";
import MomentaryButton from "../../components/HMI Components/MomentaryButton"
import HMIPage from "../../components/HMI Pages/HMITestPage";

export default function Home() {

  return (
    <HMIPage></HMIPage>
  );
}
