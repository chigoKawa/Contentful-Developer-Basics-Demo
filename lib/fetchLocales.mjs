import dotenv from "dotenv";
import fetch from "node-fetch";
import fs from "fs";
import path from "path";

// Load environment variables from .env.local first, then .env as fallback
dotenv.config({ path: ".env.local" });
dotenv.config({ path: ".env" });

// Load environment variables
const CONTENTFUL_SPACE_ID = process.env.NEXT_PUBLIC_CTF_SPACE_ID;
const CONTENTFUL_ACCESS_TOKEN = process.env.NEXT_PUBLIC_CTF_DELIVERY_TOKEN;
const CONTENTFUL_ENVIRONMENT_ID =
  process.env.CONTENTFUL_ENVIRONMENT_ID || "master"; // Default to "master" if not provided

const LOCALES_FILE_PATH = path.join(process.cwd(), "lib", "locales.json");

// Default fallback locale configuration
const DEFAULT_LOCALES = [
  {
    code: "en-US",
    name: "English (United States)",
    default: true,
    fallbackCode: null,
    sys: {
      id: "default-en-US",
      type: "Locale",
    },
  },
];

/**
 * Fetch locales from Contentful REST API
 */
async function getLocales() {
  // Check if credentials are available
  if (!CONTENTFUL_SPACE_ID || !CONTENTFUL_ACCESS_TOKEN) {
    console.warn("⚠️  Contentful credentials not found in environment variables.");
    return null;
  }

  const url = `https://cdn.contentful.com/spaces/${CONTENTFUL_SPACE_ID}/environments/${CONTENTFUL_ENVIRONMENT_ID}/locales?access_token=${CONTENTFUL_ACCESS_TOKEN}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch locales: ${response.statusText}`);
  }

  const data = await response.json();
  return data.items || [];
}

/**
 * Get existing locales from file if it exists
 */
function getExistingLocales() {
  try {
    if (fs.existsSync(LOCALES_FILE_PATH)) {
      const content = fs.readFileSync(LOCALES_FILE_PATH, "utf-8");
      const locales = JSON.parse(content);
      if (Array.isArray(locales) && locales.length > 0) {
        return locales;
      }
    }
  } catch {
    // Ignore errors reading existing file
  }
  return null;
}

/**
 * Save fetched locales to `lib/locales.json`
 */
async function saveLocalesToFile() {
  let locales = null;

  // Try to fetch from Contentful API
  try {
    locales = await getLocales();
    if (locales && locales.length > 0) {
      fs.writeFileSync(LOCALES_FILE_PATH, JSON.stringify(locales, null, 2));
      console.log(`✅ Locales fetched from Contentful and saved to ${LOCALES_FILE_PATH}`);
      return;
    }
  } catch (err) {
    console.warn("⚠️  Could not fetch locales from Contentful:", err.message);
  }

  // Fallback 1: Use existing locales.json if available
  const existingLocales = getExistingLocales();
  if (existingLocales) {
    console.log(`✅ Using existing locales from ${LOCALES_FILE_PATH}`);
    return;
  }

  // Fallback 2: Use default locale configuration
  console.warn("⚠️  Using default locale configuration (en-US)");
  fs.writeFileSync(LOCALES_FILE_PATH, JSON.stringify(DEFAULT_LOCALES, null, 2));
  console.log(`✅ Default locales saved to ${LOCALES_FILE_PATH}`);
}

saveLocalesToFile().catch((err) => {
  console.error("❌ Failed to handle locales:", err);
  // Don't exit with error - use fallback
  const existingLocales = getExistingLocales();
  if (!existingLocales) {
    fs.writeFileSync(LOCALES_FILE_PATH, JSON.stringify(DEFAULT_LOCALES, null, 2));
    console.log(`✅ Fallback: Default locales saved to ${LOCALES_FILE_PATH}`);
  }
});
