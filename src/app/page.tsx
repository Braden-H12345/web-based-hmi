"use client";

import {useEffect} from "react";
import Image from "next/image";
import { PLCProvider } from "./components/Context/PLCContext";
import MomentaryButton from "./components/HMI-Components/MomentaryButton"
import HMITestPage from "./components/HMI Pages/HMITestPage"
import PageChanger from "./components/HMI-Components/PageChanger";

export default function Home() {

  return (
    <div>
      <PageChanger path = "/home" pageName="Home"></PageChanger>
      <br></br>

      <PageChanger path = "/Page2" pageName="Page 2"></PageChanger>

      <br></br>

      <PageChanger path = "/Page3" pageName="Page 3"></PageChanger>
      <br></br>
      <PageChanger path = "/demo" pageName="Demo"></PageChanger>
    </div>
  );
}
