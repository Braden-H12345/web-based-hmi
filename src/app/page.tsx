"use client";

import {useEffect} from "react";
import Image from "next/image";
import { PLCProvider } from "./components/Context/PLCContext";
import MomentaryButton from "./components/HMI-Components/MomentaryButton"
import TestPage from "./components/HMI Pages/TestPage";

export default function Home() {

  return (
    <div>
      <TestPage/>
    </div>
  );
}
