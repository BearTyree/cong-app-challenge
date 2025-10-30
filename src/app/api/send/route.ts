import { render } from "@react-email/render";
import { eq } from "drizzle-orm";
import TrovableTemplate from "@/components/emails";
import { Resend } from "resend";
import { authenticated } from "@/controllers/auth";
import { getDbAsync } from "@/lib/drizzle";
import { listingTable, profilesTable, usersTable } from "@/lib/schema";
import type { SendEmailRequest, SendEmailResponse } from "@/types/api";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request): Promise<Response> {
  try {
    // Get authenticated user's email (requester)
    const requesterEmail = await authenticated();

    if (!requesterEmail) {
      return Response.json(
        { error: "Unauthorized. Please log in to request items." } satisfies SendEmailResponse,
        { status: 401 }
      );
    }

    // Parse and validate request body
    const body: SendEmailRequest = await request.json();
    const { listingId } = body;

    if (!listingId || typeof listingId !== "number") {
      return Response.json(
        { error: "Invalid listing ID." } satisfies SendEmailResponse,
        { status: 400 }
      );
    }

    // Fetch listing with profile and user data
    const db = await getDbAsync();
    const result = await db
      .select({
        itemName: listingTable.title,
        profileId: profilesTable.id,
        listerEmail: usersTable.email,
      })
      .from(listingTable)
      .innerJoin(profilesTable, eq(listingTable.createdBy, profilesTable.id))
      .innerJoin(usersTable, eq(profilesTable.userId, usersTable.id))
      .where(eq(listingTable.id, listingId))
      .get();

    if (!result) {
      return Response.json(
        { error: "Listing not found." } satisfies SendEmailResponse,
        { status: 404 }
      );
    }

    const { itemName, profileId, listerEmail } = result;

    // Prevent users from requesting their own items
    if (requesterEmail === listerEmail) {
      return Response.json(
        { error: "You cannot request your own item." } satisfies SendEmailResponse,
        { status: 400 }
      );
    }

    // Send email
    const { error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev",
      to: [listerEmail],
      subject: `Trovable | Someone is interested in picking up your item!`,
      html: await render(
        TrovableTemplate({
          itemName,
          requesterEmail,
          listerEmail,
          profileId,
        })
      ),
    });

    if (error) {
      console.error("Failed to send email:", error);
      return Response.json(
        { error: "Failed to send email. Please try again." } satisfies SendEmailResponse,
        { status: 500 }
      );
    }

    return Response.json(
      { message: "Email sent successfully" } satisfies SendEmailResponse,
      { status: 200 }
    );
  } catch (error) {
    console.error("Unexpected error in send email route:", error);
    return Response.json(
      { error: "An unexpected error occurred." } satisfies SendEmailResponse,
      { status: 500 }
    );
  }
}
