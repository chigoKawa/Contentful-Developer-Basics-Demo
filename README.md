
# Chi Coffee – Next.js + Contentful Starter 


This is a **Next.js** project integrated with **Contentful** as a CMS. It demonstrates how to fetch and render content from Contentful, use localization, and structure a scalable content model.  

---

## 🚀 Key Technologies  
- **Contentful** – A headless CMS that allows content managers to create and manage content, while developers retrieve it via APIs to display on the frontend.  
- **Next.js** – A React framework for building high-performance, component-driven websites.  
- **Localization & Internationalization** – Serve content in multiple languages and regions using Next.js internationalization.  

---

## 📌 Core Concepts  

### **1. Contentful Overview**  
Contentful enables content modeling by creating **content types** (templates for different content structures) and **content entries** (actual content instances).  

In this project, we define four content types:  
- **Landing Page** – Represents a full page.  
- **Hero Banner** – A headline, description, and call-to-action (CTA).  
- **CTA** – A standalone call-to-action component.  
- **Base Button** – Buttons used across the site.  

Each page in Contentful consists of **multiple components** like a hero banner and CTAs, making content flexible and reusable.  

---

### **2. Fetching & Rendering Content**  
To display content, we retrieve it from Contentful using the **Contentful JavaScript SDK**. The API keys (found under **Settings > API Keys** in Contentful) allow fetching:  
- **Published content** using the Delivery API.  
- **Unpublished + published content** using the Preview API.  

We then map Contentful components to Next.js components to render the content dynamically.  

---

### **3. Dynamic Routing in Next.js**  
Next.js uses **file-based routing**, allowing us to generate pages dynamically based on **slugs** (unique page identifiers).  

For example, a **Landing Page** in Contentful with the slug `"about"` maps to:  
✅ `www.chigoriddim.com/about`  
✅ `www.chigoriddim.com/contact`  

We achieve this using the dynamic route:  
```bash
/app/[locale]/[slug]/page.tsx


https://nextjs.org/docs/pages/building-your-application/routing/internationalization





/contentful-demo  
 ├── /components  → (Reusable UI components)  
 ├── /pages  
 │   ├── index.tsx  → (Homepage with Contentful data)  
 │   ├── [slug].tsx  → (Dynamic pages from Contentful)  
 ├── /lib  
 │   ├── contentful.ts  → (API utilities)  
 ├── /styles  
 ├── next.config.js  
 ├── tailwind.config.js  
 ├── package.json  
 ├── .env.local  → (Contentful API keys)  

 TBC