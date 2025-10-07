import fs from "fs";
import path from "path";
import { notFound } from "next/navigation";
import HMIClientRenderer from "../components/HMI-Components/HMIClientRenderer";
import { COMPONENTS } from "../components/HMI-Components/registry";
import type { HMIComponentDef, ComponentKey } from "../types/hmi";

export const dynamic = "force-dynamic";

export default async function HMIPage({
  params,
}: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const file = path.join(process.cwd(), "src", "app", "generated", "pages", `${slug}.json`);
  if (!fs.existsSync(file)) return notFound();

  const data = JSON.parse(fs.readFileSync(file, "utf-8")) as { components?: any[] };
  const raw = Array.isArray(data.components) ? data.components : [];

  // Runtime guard: only keep rows whose type is a known component key
  const components: HMIComponentDef[] = raw
    .filter((c) => typeof c?.type === "string" && c.type in COMPONENTS)
    .map((c) => ({
      type: c.type as ComponentKey,
      layout: c.layout,
      props: c.props,
    }));

  if (components.length === 0) {
    // Optional: show 404 if nothing valid
    // return notFound();
  }

  return <HMIClientRenderer components={components} />;
}