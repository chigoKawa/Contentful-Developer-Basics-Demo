import dotenv from "dotenv";
import fetch from "node-fetch";
import fs from "fs";
import path from "path";

// Load environment variables from .env.local
dotenv.config({ path: ".env.local" });

// Load environment variables
const CONTENTFUL_SPACE_ID = process.env.NEXT_PUBLIC_CTF_SPACE_ID;
const CONTENTFUL_ACCESS_TOKEN = process.env.NEXT_PUBLIC_CTF_DELIVERY_TOKEN;
const CONTENTFUL_ENVIRONMENT_ID =
  process.env.CONTENTFUL_ENVIRONMENT_ID || "master"; // Default to "master" if not provided

// Check that environment variables are correctly loaded

/**
 * Fetch locales from Contentful REST API
 */
async function getLocales() {
  const url = `https://cdn.contentful.com/spaces/${CONTENTFUL_SPACE_ID}/environments/${CONTENTFUL_ENVIRONMENT_ID}/locales?access_token=${CONTENTFUL_ACCESS_TOKEN}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch locales: ${response.statusText}`);
  }

  const data = await response.json();
  return data.items || [];
}

/**
 * Save fetched locales to `lib/locales.json`
 */
async function saveLocalesToFile() {
  const locales = await getLocales();

  if (!locales.length) {
    console.error("❌ No locales found!");
    process.exit(1);
  }

  const filePath = path.join(process.cwd(), "lib", "locales.json");

  fs.writeFileSync(filePath, JSON.stringify(locales, null, 2));

  console.log(`✅ Locales saved to ${filePath}`);
}

saveLocalesToFile().catch((err) => {
  console.error("❌ Failed to fetch locales:", err);
  process.exit(1);
});
