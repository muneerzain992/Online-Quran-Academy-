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
  academyName: string;
};

export function ContactAutoReplyEmail({ name, academyName }: Props) {
  return (
    <Html>
      <Head />
      <Preview>We received your message</Preview>
      <Body style={{ backgroundColor: "#0A1128", color: "#E8EEFF", fontFamily: "Georgia, serif" }}>
        <Container style={{ padding: "32px 24px", maxWidth: "560px" }}>
          <Heading style={{ color: "#E8EEFF", fontSize: "22px" }}>
            Assalamu Alaikum, {name}
          </Heading>
          <Text style={{ color: "#93A4C7", fontSize: "15px", lineHeight: "24px" }}>
            Thank you for contacting {academyName}. We have received your message
            and will reply as soon as we can.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

export default ContactAutoReplyEmail;
