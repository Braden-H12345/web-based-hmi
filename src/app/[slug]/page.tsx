// src/app/[slug]/page.tsx
import fs from "fs";
import path from "path";
import { notFound } from "next/navigation";
import HMIClientRenderer from "../components/HMI-Components/HMIClientRenderer";

export const dynamic = "force-dynamic";

export default async function HMIPage({
  params,
}: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  // adjust if your build path differs
  const file = path.join(process.cwd(), "src", "app", "generated", "pages", `${slug}.json`);
  if (!fs.existsSync(file)) return notFound();

  const data = JSON.parse(fs.readFileSync(file, "utf-8")) as { components?: any[] };
  const rows = Array.isArray(data.components) ? data.components : [];

  // NOTE: do NOT filter here — HMIClientRenderer needs to see PLCConfig.
  return <HMIClientRenderer components={rows} />;
}