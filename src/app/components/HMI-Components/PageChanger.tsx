"use client";

import { useRouter } from "next/navigation";

interface PageChangeProps
{
    path: string;
    pageName: string;
}

function PageChanger({path = "", pageName}: PageChangeProps)
{
    const router = useRouter();

    const goToPage = () => {
        router.push(path);
    };

    return(<button onClick={goToPage} style={{ padding: "8px 16px", background: "#0070f3", color: "#fff"}}> Go to {pageName}</button>);
    
}

export default PageChanger;