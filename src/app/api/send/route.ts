import { render } from "@react-email/render";
import TrovableTemplate from "@/components/emails";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request, res: Response) {
  // rate limit
  // authorization

  const {
    itemName,
    requesterEmail,
    listerEmail,
    profileId,
  } = await request.json();

  const { data, error } = await resend.emails.send({
    from: "onboarding@resend.dev",
    to: [listerEmail],
    subject: "Thank you",
    html: await render(TrovableTemplate({ itemName, requesterEmail, listerEmail, profileId, })),
  });

  if (error) {
    return Response.json(error);
  }

  return Response.json({ message: "Email sent successfully" });
}
