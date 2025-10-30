import {
  Body,
  Button,
  Container,
  Head,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

interface ItemRequestEmailProps {
  itemName: string;
  requesterEmail: string;
  listerEmail: string;
  profileId: number;
}

export default function ItemRequestEmail({
  itemName,
  requesterEmail,
  listerEmail,
  profileId,
}: ItemRequestEmailProps) {
  const profileUrl = `https://trovable.org/profile/${profileId}`;

  return (
    <Html>
      <Head />
      <Preview>{requesterEmail} wants to pick up your item: {itemName}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={logoSection}>
            <Img
              src="https://trovable.org/logo.svg"
              alt="Trovable"
              width="120"
              height="40"
              style={logo}
            />
          </Section>

          <Section style={content}>
            <Text style={greeting}>
              {listerEmail}! <span style={emailHighlight}>{requesterEmail}</span> has requested to pick up your item, <strong>{itemName}</strong>!
            </Text>

            <Text style={instructionText}>
              For communication please contact <span style={emailHighlight}>{requesterEmail}</span>
            </Text>

            <Text style={reminderText}>
              Once picked up, make sure to delete your listing!
            </Text>

            <Section style={buttonSection}>
              <Button href={profileUrl} style={button}>
                Visit your Profile
              </Button>
            </Section>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "40px 20px",
  maxWidth: "600px",
  border: "2px solid #333",
  borderRadius: "20px",
};

const logoSection = {
  textAlign: "center" as const,
  marginBottom: "30px",
};

const logo = {
  margin: "0 auto",
};

const content = {
  padding: "0 20px",
};

const greeting = {
  color: "#333",
  fontSize: "18px",
  lineHeight: "28px",
  margin: "20px 0",
  textAlign: "center" as const,
};

const emailHighlight = {
  fontWeight: "600",
  color: "#333",
};

const instructionText = {
  color: "#333",
  fontSize: "16px",
  lineHeight: "26px",
  margin: "20px 0",
  textAlign: "center" as const,
};

const reminderText = {
  color: "#333",
  fontSize: "16px",
  lineHeight: "26px",
  margin: "20px 0",
  textAlign: "center" as const,
};

const buttonSection = {
  textAlign: "center" as const,
  margin: "30px 0",
};

const button = {
  backgroundColor: "#78A75A",
  borderRadius: "12px",
  color: "white",
  fontSize: "16px",
  fontWeight: "600",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
  padding: "12px 40px",
};