import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN;
const ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN;
const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;

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

async function sendWhatsAppMessage(to: string, message: string) {
  if (!ACCESS_TOKEN || !PHONE_NUMBER_ID) {
    throw new Error(
      "Missing WHATSAPP_ACCESS_TOKEN or WHATSAPP_PHONE_NUMBER_ID"
    );
  }

  const response = await fetch(
    `https://graph.facebook.com/v26.0/${PHONE_NUMBER_ID}/messages`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to,
        type: "text",
        text: {
          preview_url: false,
          body: message,
        },
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    console.error("❌ WhatsApp API error:", data);
    throw new Error("Failed to send WhatsApp message");
  }

  console.log("✅ WhatsApp message sent:", data);

  return data;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    console.log("📩 Incoming WhatsApp webhook:");
    console.dir(body, { depth: null });

    const value = body?.entry?.[0]?.changes?.[0]?.value;

    const message = value?.messages?.[0];

    // Ignore webhook events that aren't actual messages.
    if (!message) {
      return NextResponse.json({ status: "event received" });
    }

    const messageType = message.type;
    const from = message.from;

    if (messageType !== "text" || !from) {
      return NextResponse.json({
        status: "unsupported message type",
      });
    }

    const userMessage = message.text?.body?.trim();

    if (!userMessage) {
      return NextResponse.json({
        status: "empty message",
      });
    }

    console.log("👤 From:", from);
    console.log("💬 User said:", userMessage);

    // Temporary response.
    // ERP database + AI will be connected later.
    let reply = "Message received by GFS ERP.";

    if (userMessage.toLowerCase().includes("pending")) {
      reply = "GFS ERP received your request for pending challans.";
    }

    console.log("🤖 Reply:", reply);

    await sendWhatsAppMessage(from, reply);

    return NextResponse.json({
      status: "received",
    });
  } catch (error) {
    console.error("❌ Webhook error:", error);

    return NextResponse.json(
      { error: "Failed to process webhook" },
      { status: 500 }
    );
  }
}