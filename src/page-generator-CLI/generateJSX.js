function generateJSX({ pageName,pageIp,plcId, components }) {
  const imports = new Set();
  const rendered = components.map((comp) => {
    imports.add(comp.type);

    const propPairs = [
      `modbusTag={${comp.tag}}`,
    ];

        if (comp.label) {
      propPairs.push(`label="${comp.label}"`);
    }

    if (comp.shape != null) {
      propPairs.push(`shape="${comp.shape}"`);
    }

    const propString = propPairs.join(" ");



    return `        <${comp.type} ${propString} />`;
  });

  const importLine = `import { ${[...imports].join(", ")} } from "@/app/components/HMI-Components/import-index";`;

  return `
"use client";

import { PLCProvider } from "../Context/PLCContext";
${importLine}

export default function ${pageName.replaceAll(' ', '')}() {
const pagePLCId = ${plcId};
const ip =  "${pageIp}";
const port = 502;

return (
    <PLCProvider plcId={pagePLCId}>
      <div className="hmi-page">
${rendered.join("\n")}
      </div>
    </PLCProvider>
  );
}
  `.trim();
}

export default generateJSX;