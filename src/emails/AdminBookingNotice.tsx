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
  studentName: string;
  parentName: string;
  email: string;
  whatsapp: string;
  country: string;
  timezone: string;
  courseTitle: string;
  preferredTime: string;
  teacherGenderPref: string;
};

export function AdminBookingNoticeEmail(props: Props) {
  return (
    <Html>
      <Head />
      <Preview>New free trial booking — {props.studentName}</Preview>
      <Body style={{ backgroundColor: "#0A1128", color: "#E8EEFF", fontFamily: "sans-serif" }}>
        <Container style={{ padding: "24px", maxWidth: "560px" }}>
          <Heading style={{ color: "#38BDF8", fontSize: "20px" }}>
            New trial booking
          </Heading>
          {(
            Object.entries(props) as [string, string][]
          ).map(([key, value]) => (
            <Text key={key} style={{ color: "#93A4C7", fontSize: "14px" }}>
              <strong style={{ color: "#E8EEFF" }}>{key}:</strong> {value}
            </Text>
          ))}
        </Container>
      </Body>
    </Html>
  );
}

export default AdminBookingNoticeEmail;
