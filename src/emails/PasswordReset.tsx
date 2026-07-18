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
  resetUrl: string;
};

export function PasswordResetEmail({ name, academyName, resetUrl }: Props) {
  return (
    <Html>
      <Head />
      <Preview>Reset your {academyName} password</Preview>
      <Body style={{ backgroundColor: "#0A1128", color: "#E8EEFF", fontFamily: "Georgia, serif" }}>
        <Container style={{ padding: "32px 24px", maxWidth: "560px" }}>
          <Heading style={{ color: "#E8EEFF", fontSize: "22px" }}>
            Password reset
          </Heading>
          <Text style={{ color: "#93A4C7", fontSize: "15px", lineHeight: "24px" }}>
            Assalamu Alaikum{name ? `, ${name}` : ""}. We received a request to
            reset your password. This link expires in 1 hour.
          </Text>
          <Button
            href={resetUrl}
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
            Reset password
          </Button>
          <Text style={{ color: "#93A4C7", fontSize: "13px", marginTop: "24px" }}>
            If you did not request this, you can ignore this email.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

export default PasswordResetEmail;
