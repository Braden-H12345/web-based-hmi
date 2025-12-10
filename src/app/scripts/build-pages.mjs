//parses the csv files

import fs from "fs";
import path, { delimiter } from "path";
import { parse } from "csv-parse/sync";

//if path needs to change that can be changed here
const SRC = path.join(process.cwd(), "src", "app", "data", "pages");
const OUT = path.join(process.cwd(), "src", "app", "generated", "pages");
fs.mkdirSync(OUT, { recursive: true });

function sanitizeCsv(raw) {
  let s = String(raw);

  // Remove BOM anywhere, zero-widths, NBSP
  s = s.replace(/\uFEFF/g, "");  
  s = s.replace(/[\u200B\u200C\u200D\u200E\u200F]/g, ""); 
  s = s.replace(/\u00A0/g, " ");  

  // Normalize line endings to LF
  s = s.replace(/\r\n/g, "\n").replace(/\r/g, "\n");

  // Remove spaces/tabs after a closing quote before comma or EOL
  // e.g.  ..."}  ,   -> ...",   ;  ..."}  \n  -> ..."\n
  s = s.replace(/"\s+(?=(,|\n|$))/g, '"');

  return s;
}

function parseCsvWithFallback(csv) {
  const base = {
    columns: header => header.map(h => String(h).trim()),
    skip_empty_lines: true,
    trim: true,
    delimiter: ";",
    quote: "'",        
    escape: "\\",
    relax_quotes: true,
    relax_column_count: true
  };

  // First try: standard CSV with double quotes
  try {
    return parse(csv, { ...base, quote: '"', escape: "\\" });
  } catch (e1) {
    if (process.env.HMI_DEBUG === "1") {
      console.warn("⚠️  Double-quote parse failed; retrying with single-quote CSV…");
      console.warn("Reason:", e1.message);
    }
    // Fallback: CSV quoted by single quotes
    return parse(csv, { ...base, quote: "'", escape: "\\" });
  }
}

function parseExtraProps(raw, rowNum) {
  if (!raw) return {};
  const s = String(raw).trim();
  try {
    return JSON.parse(s);
  } catch (err) {
    console.warn(`⚠️ Failed to parse extra_props on row ${rowNum}: ${s}`);
    return {};
  }
}

for (const file of fs.readdirSync(SRC)) {
  if (!file.endsWith(".csv")) continue;

  const slug = path.basename(file, ".csv");
  let csv = fs.readFileSync(path.join(SRC, file), "utf-8");
  csv = sanitizeCsv(csv);

  let rows;
  try {
    rows = parseCsvWithFallback(csv);
  } catch (err) {
    console.error("CSV parse error:", err.message);
    const lines = csv.split("\n");
    const bad = lines[(err.lines ?? 1) - 1] ?? "";
    console.error(`Likely offending line (${err.lines}):`);
    console.log(
      bad
        .split("")
        .map((c) => {
          const hex = c.charCodeAt(0).toString(16).padStart(2, "0");
          if (c === "\r") return "\\r";
          if (c === "\n") return "\\n";
          if (c === " ") return "[space]";
          return `${c}(${hex})`;
        })
        .join(" ")
    );
    throw err;
  }

  if (process.env.HMI_DEBUG === "1") {
    console.log(`[DEBUG] Parsed rows for ${slug}:`);
    console.dir(rows, { depth: null });
  }

const components = rows
    .map((r, idx) => {
      const type = (r.component_type ?? r["component_type"] ?? "").trim();
      if (!type) {
        console.warn(`⚠️ Missing component_type on row ${idx + 2}`);
        return null;
      }

      const labelRaw = r.label ?? r["label"];
      const label =
        typeof labelRaw === "string" ? labelRaw.replace(/^"|"$/g, "") : labelRaw;

      const extra = parseExtraProps(r.extra_props ?? r["extra_props"], idx + 2);
      const extraObj =
        extra && typeof extra === "object" && !Array.isArray(extra) ? extra : {};

      const rawTag = r.modbusTag ?? r["modbusTag"] ?? r.tag ?? r["tag"];
      let modbusTagNum =
        rawTag == null || String(rawTag).trim() === ""
          ? undefined
          : Number(rawTag);

      if (modbusTagNum != null && Number.isNaN(modbusTagNum)) {
        console.warn(
          `⚠️ Invalid modbusTag on row ${idx + 2}:`,
          rawTag,
          "→ dropping it"
        );
        modbusTagNum = undefined;
      }

      // Build base props (common)
      const props = {
        plcId: r.plc_id ? +r.plc_id : undefined,
        label,
        ...extraObj,
      };

      // Attach modbusTag only for HMI parts that use it
      if (
        ["Indicator", "MomentaryButton", "ToggleButton"].includes(type) &&
        typeof modbusTagNum === "number"
      ) {
        props.modbusTag = modbusTagNum;
      }

      return {
        type,
        layout: {
          x: +r.x || 0,
          y: +r.y || 0,
          w: +r.w || 1,
          h: +r.h || 1,
        },
        props,
        _sourceRow: idx + 2,
      };
    })
    .filter(Boolean);

  fs.writeFileSync(
    path.join(OUT, `${slug}.json`),
    JSON.stringify({ slug, components }, null, 2),
    "utf-8"
  );

  console.log(`✅ Built page: ${slug} (${components.length} components)`);
}

console.log("HMI build complete.");
