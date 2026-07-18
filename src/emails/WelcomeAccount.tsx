import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
} from "@react-email/components";

type Props = {
  name: string;
  academyName: string;
  verifyUrl: string;
};

export function WelcomeAccountEmail({ name, academyName, verifyUrl }: Props) {
  return (
    <Html>
      <Head />
      <Preview>Welcome to {academyName} — verify your email</Preview>
      <Body style={{ backgroundColor: "#0A1128", color: "#E8EEFF", fontFamily: "Georgia, serif" }}>
        <Container style={{ padding: "32px 24px", maxWidth: "560px" }}>
          <Heading style={{ color: "#E8EEFF", fontSize: "22px" }}>
            Assalamu Alaikum, {name}
          </Heading>
          <Text style={{ color: "#93A4C7", fontSize: "15px", lineHeight: "24px" }}>
            Welcome to {academyName}. Your account is ready. Please verify your
            email to keep your account secure.
          </Text>
          <Button
            href={verifyUrl}
            style={{
              backgroundColor: "#1E5AFF",
              color: "#ffffff",
              padding: "12px 20px",
              borderRadius: "10px",
              textDecoration: "none",
              display: "inline-block",
              marginTop: "12px",
            }}
          >
            Verify email
          </Button>
          <Text style={{ color: "#93A4C7", fontSize: "13px", marginTop: "24px" }}>
            If the button does not work, open this link: {verifyUrl}
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

export default WelcomeAccountEmail;
