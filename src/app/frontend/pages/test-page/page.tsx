"use client";

import {useEffect} from "react";
import Image from "next/image";
import { PLCProvider } from "../../../components/Context/PLCContext";
import MomentaryButton from "../../../components/HMI-Components/MomentaryButton"
import TestPage from "../../../components/HMI Pages/Test Page";

export default function Home() {

  return (
    <TestPage></TestPage>
  );
}
