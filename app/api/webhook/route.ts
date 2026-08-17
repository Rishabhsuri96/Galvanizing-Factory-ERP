import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

// 🔹 VERIFY WEBHOOK (GET request from Meta)
export async function GET(req: NextRequest) {
  const url = new URL(req.url);

  const mode = url.searchParams.get("hub.mode");
  const token = url.searchParams.get("hub.verify_token");
  const challenge = url.searchParams.get("hub.challenge");

  if (mode === "subscribe" && token === "my_verify_token") {
    return new NextResponse(challenge, { status: 200 });
  }

  return new NextResponse("Verification failed", { status: 403 });
}

// 🔹 RECEIVE MESSAGES
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    console.log("📩 Incoming webhook:");
    console.dir(body, { depth: null });

    const message =
      body?.entry?.[0]?.changes?.[0]?.value?.messages?.[0]?.text?.body;

    if (!message) {
      return NextResponse.json({ status: "no message" });
    }

    console.log("💬 User said:", message);

    // 🔥 TEMP RESPONSE (we will connect DB next)
    let reply = "Message received";

    if (message.toLowerCase().includes("pending")) {
      reply = "Fetching pending challans...";
    }

    return NextResponse.json({
      reply,
    });

  } catch (err) {
    console.error("Webhook error:", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}