import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
} from "@react-email/components";

type Props = {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
};

export function AdminContactNoticeEmail({
  name,
  email,
  phone,
  subject,
  message,
}: Props) {
  return (
    <Html>
      <Head />
      <Preview>New contact message — {subject}</Preview>
      <Body
        style={{
          backgroundColor: "#0A1128",
          color: "#E8EEFF",
          fontFamily: "sans-serif",
        }}
      >
        <Container style={{ padding: "24px" }}>
          <Heading style={{ color: "#38BDF8", fontSize: "20px" }}>
            New contact message
          </Heading>
          <Text>
            From: {name} ({email})
          </Text>
          {phone ? <Text>Phone: {phone}</Text> : null}
          <Text>Subject: {subject}</Text>
          <Text>{message}</Text>
        </Container>
      </Body>
    </Html>
  );
}

export default AdminContactNoticeEmail;
