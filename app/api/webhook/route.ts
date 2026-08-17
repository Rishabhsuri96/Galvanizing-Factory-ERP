import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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

  return new NextResponse("Verification failed", {
    status: 403,
  });
}

async function sendWhatsAppMessage(
  to: string,
  message: string
) {
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

/* =========================================================
   ERP DATA HELPERS
========================================================= */

async function getPendingMaterial() {
  const result = await prisma.challanItem.aggregate({
    where: {
      pendingProductionWeight: {
        gt: 0,
      },
    },
    _sum: {
      pendingProductionWeight: true,
    },
  });

  const challans = await prisma.challan.findMany({
    where: {
      items: {
        some: {
          pendingProductionWeight: {
            gt: 0,
          },
        },
      },
    },
    include: {
      party: true,
      items: true,
    },
    orderBy: {
      receivedDate: "desc",
    },
    take: 10,
  });

  const totalWeight =
    result._sum.pendingProductionWeight ?? 0;

  if (challans.length === 0) {
    return "There is no pending production material right now.";
  }

  let reply =
    `📦 *Pending Material*\n\n` +
    `Total pending: *${totalWeight.toFixed(2)} kg*\n\n`;

  for (const challan of challans) {
    const weight = challan.items.reduce(
      (sum, item) =>
        sum + (item.pendingProductionWeight ?? 0),
      0
    );

    reply +=
      `• ${challan.party.partyName}\n` +
      `  Challan: ${challan.challanNumber}\n` +
      `  Pending: ${weight.toFixed(2)} kg\n\n`;
  }

  return reply.trim();
}

async function getReadyMaterial() {
  const result = await prisma.challanItem.aggregate({
    where: {
      readyWeight: {
        gt: 0,
      },
    },
    _sum: {
      readyWeight: true,
    },
  });

  const items = await prisma.challanItem.findMany({
    where: {
      readyWeight: {
        gt: 0,
      },
    },
    include: {
      challan: {
        include: {
          party: true,
        },
      },
    },
    orderBy: {
      readyWeight: "desc",
    },
    take: 10,
  });

  const totalReady =
    result._sum.readyWeight ?? 0;

  if (items.length === 0) {
    return "There is no ready material currently available.";
  }

  let reply =
    `✅ *Ready Material*\n\n` +
    `Total ready: *${totalReady.toFixed(2)} kg*\n\n`;

  for (const item of items) {
    reply +=
      `• ${item.challan.party.partyName}\n` +
      `  Challan: ${item.challan.challanNumber}\n` +
      `  Item: ${item.itemName}\n` +
      `  Ready: ${(item.readyWeight ?? 0).toFixed(2)} kg\n\n`;
  }

  return reply.trim();
}

async function getTodayDispatches() {
  const start = new Date();
  start.setHours(0, 0, 0, 0);

  const end = new Date(start);
  end.setDate(end.getDate() + 1);

  const dispatches = await prisma.dispatch.findMany({
    where: {
      dispatchDate: {
        gte: start,
        lt: end,
      },
    },
    include: {
      items: true,
    },
    orderBy: {
      dispatchDate: "desc",
    },
  });

  if (dispatches.length === 0) {
    return "🚚 No dispatches have been recorded today.";
  }

  let totalWeight = 0;

  for (const dispatch of dispatches) {
    totalWeight += dispatch.items.reduce(
      (sum, item) => sum + item.outputWeight,
      0
    );
  }

  let reply =
    `🚚 *Today's Dispatches*\n\n` +
    `Vehicles: *${dispatches.length}*\n` +
    `Total dispatched: *${totalWeight.toFixed(2)} kg*\n\n`;

  for (const dispatch of dispatches) {
    const weight = dispatch.items.reduce(
      (sum, item) => sum + item.outputWeight,
      0
    );

    reply +=
      `• Vehicle: ${dispatch.vehicleNumber}\n` +
      `  Weight: ${weight.toFixed(2)} kg\n\n`;
  }

  return reply.trim();
}

async function searchParty(query: string) {
  const parties = await prisma.party.findMany({
    where: {
      partyName: {
        contains: query,
        mode: "insensitive",
      },
    },
    include: {
      challans: {
        where: {
          items: {
            some: {
              pendingProductionWeight: {
                gt: 0,
              },
            },
          },
        },
        include: {
          items: true,
        },
        orderBy: {
          receivedDate: "desc",
        },
      },
    },
    take: 5,
  });

  if (parties.length === 0) {
    return `I couldn't find a party matching "${query}".`;
  }

  let reply = `🏭 *Party Search: ${query}*\n\n`;

  for (const party of parties) {
    reply += `*${party.partyName}*\n`;

    if (party.challans.length === 0) {
      reply += "No pending challans.\n\n";
      continue;
    }

    for (const challan of party.challans) {
      const pending = challan.items.reduce(
        (sum, item) =>
          sum + (item.pendingProductionWeight ?? 0),
        0
      );

      reply +=
        `• Challan ${challan.challanNumber}: ` +
        `${pending.toFixed(2)} kg pending\n`;
    }

    reply += "\n";
  }

  return reply.trim();
}

async function getProductionToday() {
  const start = new Date();
  start.setHours(0, 0, 0, 0);

  const result =
    await prisma.productionBatchItem.aggregate({
      where: {
        completedAt: {
          gte: start,
        },
      },
      _sum: {
        inputWeight: true,
        outputWeight: true,
        zincAddedWeight: true,
        contractorAmount: true,
      },
    });

  const input = result._sum.inputWeight ?? 0;
  const output = result._sum.outputWeight ?? 0;
  const zinc = result._sum.zincAddedWeight ?? 0;
  const contractorAmount =
    result._sum.contractorAmount ?? 0;

  return (
    `🏭 *Today's Production*\n\n` +
    `Input: *${input.toFixed(2)} kg*\n` +
    `Output: *${output.toFixed(2)} kg*\n` +
    `Zinc added: *${zinc.toFixed(2)} kg*\n` +
    `Contractor amount: *₹${contractorAmount.toFixed(2)}*`
  );
}

/* =========================================================
   MESSAGE UNDERSTANDING
========================================================= */

async function generateERPReply(
  userMessage: string
) {
  const text = userMessage.toLowerCase().trim();

  if (
    text === "hi" ||
    text === "hello" ||
    text === "hey"
  ) {
    return (
      "👋 *GFS ERP Assistant*\n\n" +
      "I can help you check:\n\n" +
      "• Pending material\n" +
      "• Ready material\n" +
      "• Today's dispatches\n" +
      "• Production\n" +
      "• Party pending material\n\n" +
      "Try:\n" +
      "`pending`\n" +
      "`ready`\n" +
      "`dispatch today`\n" +
      "`production today`\n" +
      "`ABC pending`"
    );
  }

  if (
    text.includes("pending") ||
    text.includes("pending material") ||
    text.includes("pending challan")
  ) {
    // Party-specific pending request
    const cleaned = text
      .replace("pending material", "")
      .replace("pending challans", "")
      .replace("pending challan", "")
      .replace("pending", "")
      .trim();

    if (cleaned.length > 1) {
      return await searchParty(cleaned);
    }

    return await getPendingMaterial();
  }

  if (
    text === "ready" ||
    text.includes("ready material") ||
    text.includes("ready stock")
  ) {
    return await getReadyMaterial();
  }

  if (
    text.includes("dispatch") &&
    (text.includes("today") ||
      text === "dispatch")
  ) {
    return await getTodayDispatches();
  }

  if (
    text.includes("production") &&
    text.includes("today")
  ) {
    return await getProductionToday();
  }

  return (
    "I didn't understand that request.\n\n" +
    "Try one of these:\n\n" +
    "📦 `pending`\n" +
    "✅ `ready`\n" +
    "🚚 `dispatch today`\n" +
    "🏭 `production today`\n" +
    "🏭 `ABC pending`"
  );
}

/* =========================================================
   POST WEBHOOK
========================================================= */

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    console.log("📩 Incoming WhatsApp webhook:");
    console.dir(body, { depth: null });

    const value =
      body?.entry?.[0]?.changes?.[0]?.value;

    const message = value?.messages?.[0];

    // Ignore status/read/delivery events
    if (!message) {
      return NextResponse.json({
        status: "event received",
      });
    }

    const messageType = message.type;
    const from = message.from;

    if (messageType !== "text" || !from) {
      return NextResponse.json({
        status: "unsupported message type",
      });
    }

    const userMessage =
      message.text?.body?.trim();

    if (!userMessage) {
      return NextResponse.json({
        status: "empty message",
      });
    }

    console.log("👤 From:", from);
    console.log("💬 User said:", userMessage);

    const reply =
      await generateERPReply(userMessage);

    console.log("🤖 Reply:", reply);

    await sendWhatsAppMessage(
      from,
      reply
    );

    return NextResponse.json({
      status: "received",
    });
  } catch (error) {
    console.error(
      "❌ Webhook error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Failed to process webhook",
      },
      { status: 500 }
    );
  }
}