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
  academyName: string;
  trialOffer: string;
};

export function WelcomeSubscriberEmail({ academyName, trialOffer }: Props) {
  return (
    <Html>
      <Head />
      <Preview>Welcome to {academyName}</Preview>
      <Body style={{ backgroundColor: "#0A1128", color: "#E8EEFF", fontFamily: "Georgia, serif" }}>
        <Container style={{ padding: "32px 24px", maxWidth: "560px" }}>
          <Heading style={{ color: "#E8EEFF", fontSize: "22px" }}>
            Welcome to our community
          </Heading>
          <Text style={{ color: "#93A4C7", fontSize: "15px", lineHeight: "24px" }}>
            JazakAllah Khair for subscribing to {academyName}. Stay tuned for
            updates — and remember, {trialOffer} are available whenever you are
            ready to begin.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

export default WelcomeSubscriberEmail;
