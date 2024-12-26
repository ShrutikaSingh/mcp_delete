import { type NextRequest, NextResponse } from "next/server";
import {
  EventRequest,
  UserData,
  ServerEvent,
} from "facebook-nodejs-business-sdk";
import { getClientIp } from "@/lib/utils";

// biome-ignore lint/style/noNonNullAssertion: <explanation>
const accessToken = process.env.META_CONVERSIONS_API_ACCESS_TOKEN!;
// biome-ignore lint/style/noNonNullAssertion: <explanation>
const pixelId = process.env.NEXT_PUBLIC_META_CONVERSIONS_API_PIXEL_ID!;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, userAgent } = body;

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const clientIp = getClientIp(request);

    const userData = new UserData()
      .setEmail(email)
      .setClientUserAgent(userAgent || "")
      .setClientIpAddress(clientIp || "");

    const serverEvent = new ServerEvent()
      .setEventName("CompleteRegistration")
      .setEventTime(Math.floor(Date.now() / 1000))
      .setUserData(userData);

    const eventRequest = new EventRequest(accessToken, pixelId).setEvents([
      serverEvent,
    ]);

    const response = await eventRequest.execute();
    return NextResponse.json({ success: true, response });
  } catch (error) {
    console.error("Error triggering Facebook event:", error);
    return NextResponse.json(
      { error: "Failed to trigger Facebook event" },
      { status: 500 }
    );
  }
}
