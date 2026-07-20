import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ status: "ok", service: "acs-command-center", version: "0.1.0" });
}
