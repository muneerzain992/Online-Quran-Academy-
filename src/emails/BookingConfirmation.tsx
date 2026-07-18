import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";

type Props = {
  studentName: string;
  parentName: string;
  courseTitle: string;
  preferredTime: string;
  academyName: string;
};

export function BookingConfirmationEmail({
  studentName,
  parentName,
  courseTitle,
  preferredTime,
  academyName,
}: Props) {
  return (
    <Html>
      <Head />
      <Preview>Your 3 Days Free Trial Classes request is received</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Assalamu Alaikum, {parentName}</Heading>
          <Text style={text}>
            JazakAllah Khair for booking <strong>3 Days Free Trial Classes</strong>{" "}
            at {academyName}.
          </Text>
          <Section style={box}>
            <Text style={text}>
              <strong>Student:</strong> {studentName}
            </Text>
            <Text style={text}>
              <strong>Course:</strong> {courseTitle}
            </Text>
            <Text style={text}>
              <strong>Preferred time:</strong> {preferredTime}
            </Text>
          </Section>
          <Text style={text}>
            Our team will confirm your first live class shortly by email or
            WhatsApp.
          </Text>
          <Hr style={hr} />
          <Text style={footer}>{academyName}</Text>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: "#0A1128",
  fontFamily: "Georgia, serif",
  color: "#E8EEFF",
};

const container = {
  margin: "0 auto",
  padding: "32px 24px",
  maxWidth: "560px",
};

const h1 = {
  color: "#E8EEFF",
  fontSize: "24px",
  fontWeight: "600" as const,
};

const text = {
  color: "#93A4C7",
  fontSize: "15px",
  lineHeight: "24px",
};

const box = {
  backgroundColor: "#0D1B3E",
  borderRadius: "12px",
  padding: "16px 20px",
  margin: "16px 0",
};

const hr = {
  borderColor: "rgba(232,238,255,0.12)",
  margin: "24px 0",
};

const footer = {
  color: "#93A4C7",
  fontSize: "12px",
};

export default BookingConfirmationEmail;
