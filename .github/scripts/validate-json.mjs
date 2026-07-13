import { readFileSync } from "node:fs";

// Filename and expected structure (we haven't defined a formal schema)
const FILE = "docs/links.json";
const REQUIRED_LINK_FIELDS = ["title", "url", "description"];
const REQUIRED_VIDEO_FIELDS = ["title", "channel", "date", "youtubeId", "url"];

const isNonEmptyString = (v) => typeof v === "string" && v.trim().length > 0;

// Use the URL constructor as the validity check, it has built-in parsing and validation
const isValidUrl = (v) => {
  if (!isNonEmptyString(v)) return false;
  try {
    new URL(v);
    return true;
  } catch {
    return false;
  }
};

// Fail fast on unparsable JSON, since none of the checks below make sense without it
let data;
try {
  data = JSON.parse(readFileSync(FILE, "utf8"));
} catch (err) {
  console.error(`${FILE} is missing or not valid JSON: ${err.message}`);
  process.exit(1);
}

// Collect every problem found instead of stopping at the first one, so a single
// CI run reports the full list of fixes needed rather than one at a time
const errors = [];

if (!data.featuredVideo || typeof data.featuredVideo !== "object") {
  errors.push('Missing or invalid top-level "featuredVideo" object.');
} else {
  for (const field of REQUIRED_VIDEO_FIELDS) {
    const value = data.featuredVideo[field];
    const ok = field === "url" ? isValidUrl(value) : isNonEmptyString(value);
    if (!ok) errors.push(`featuredVideo.${field} is missing, empty, or invalid.`);
  }
}

if (!Array.isArray(data.sections) || data.sections.length === 0) {
  errors.push('Missing or empty top-level "sections" array.');
} else {
  data.sections.forEach((section, sIdx) => {
    if (!isNonEmptyString(section.title)) errors.push(`sections[${sIdx}].title is missing or empty.`);
    if (!isNonEmptyString(section.description)) errors.push(`sections[${sIdx}].description is missing or empty.`);
    if (!Array.isArray(section.links) || section.links.length === 0) {
      errors.push(`sections[${sIdx}].links is missing or empty.`);
      // No links to check in this section, so skip straight to the next one.
      return;
    }
    section.links.forEach((link, lIdx) => {
      REQUIRED_LINK_FIELDS.forEach((field) => {
        const value = link[field];
        const ok = field === "url" ? isValidUrl(value) : isNonEmptyString(value);
        if (!ok) errors.push(`sections[${sIdx}].links[${lIdx}].${field} is missing, empty, or invalid.`);
      });
    });
  });
}

if (errors.length) {
  console.error(`\n${FILE} failed validation with ${errors.length} error(s):\n`);
  errors.forEach((e) => console.error(` - ${e}`));
  process.exit(1);
}

console.log(`${FILE} passed validation (${data.sections.length} sections).`);
