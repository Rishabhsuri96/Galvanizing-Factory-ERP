import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN;

export async function GET(req: NextRequest) {
  const url = new URL(req.url);

  const mode = url.searchParams.get("hub.mode");
  const token = url.searchParams.get("hub.verify_token");
  const challenge = url.searchParams.get("hub.challenge");

  if (
    mode === "subscribe" &&
    token &&
    VERIFY_TOKEN &&
    token === VERIFY_TOKEN
  ) {
    return new NextResponse(challenge, { status: 200 });
  }

  return new NextResponse("Verification failed", { status: 403 });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    console.log("📩 Incoming WhatsApp webhook:");
    console.dir(body, { depth: null });

    const message =
      body?.entry?.[0]?.changes?.[0]?.value?.messages?.[0]?.text?.body;

    if (!message) {
      return NextResponse.json({ status: "no message" });
    }

    console.log("💬 User said:", message);

    // Temporary response.
    // DB + AI will be connected after webhook communication is confirmed.
    let reply = "Message received";

    if (message.toLowerCase().includes("pending")) {
      reply = "Fetching pending challans...";
    }

    console.log("🤖 Reply:", reply);

    return NextResponse.json({
      status: "received",
      reply,
    });
  } catch (error) {
    console.error("❌ Webhook error:", error);

    return NextResponse.json(
      { error: "Failed to process webhook" },
      { status: 500 }
    );
  }
}