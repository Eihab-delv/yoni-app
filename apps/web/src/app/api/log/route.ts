import { NextRequest, NextResponse } from "next/server";
import { serverLogger } from "~/lib/logger/serverLogger";

export async function POST(req: NextRequest): Promise<NextResponse<unknown>> {
  try {
    const { level, message, meta } = await req.json();

    if (!level || !message) {
      return NextResponse.json({ error: "Invalid log data" }, { status: 400 });
    }

    const logger = serverLogger
    const logMethod = logger[level as keyof typeof logger];

    if (typeof logMethod === 'function') {
      logMethod(message, meta);
    }

    return new NextResponse(null, { status: 204 });
  } catch {
    return NextResponse.json({ error: "Failed to log message" }, { status: 500 });
  }
}
