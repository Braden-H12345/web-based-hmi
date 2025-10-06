import fs from "fs";
import path from "path";
import { notFound } from "next/navigation";
import { COMPONENTS } from "../components/HMI-Components/registry";

export const dynamic = "force-dynamic";

type HMIComponentDef = {
  type: keyof typeof COMPONENTS;
  layout?: { x: number; y: number; w: number; h: number };
  props?: Record<string, any>;
};

export default async function HMIPage({
  params,
}: {
  // Next 15: params is async
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const file = path.join(process.cwd(), "src", "app", "generated", "pages", `${slug}.json`);
  if (!fs.existsSync(file)) return notFound();

  const { components } = JSON.parse(
    fs.readFileSync(file, "utf-8")
  ) as { components: HMIComponentDef[] };

  return (
    <main
      className="p-6 grid gap-4"
      style={{ gridTemplateColumns: "repeat(12, minmax(0, 1fr))" }}
    >
      {components.map((c, i) => {
        const Cmp = COMPONENTS[c.type];
        if (!Cmp) {
          return (
            <div key={i} className="border p-2 rounded bg-red-100 text-red-800">
              Unknown component: {c.type}
            </div>
          );
        }
        const style = c.layout
          ? {
              gridColumn: `${c.layout.x} / span ${c.layout.w}`,
              gridRow: `${c.layout.y} / span ${c.layout.h}`,
            }
          : {};
        return (
          <div key={i} style={style}>
            <Cmp {...(c.props as any)} />
          </div>
        );
      })}
    </main>
  );
}
