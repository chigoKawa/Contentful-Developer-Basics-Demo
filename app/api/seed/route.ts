import { NextResponse } from "next/server";

export async function POST(request: Request) {
  // This project intentionally runs space seeding in the browser (client-side)
  // to avoid serverless timeouts (e.g. Vercel) for long-running imports.
  // Keep this route as a hard-disabled stub to prevent accidental use.
  void request;
  return NextResponse.json(
    { message: "Not found", hasError: true },
    { status: 404 }
  );
}
