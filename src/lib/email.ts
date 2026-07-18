import { render } from "@react-email/render";
import nodemailer from "nodemailer";
import type { Transporter } from "nodemailer";
import { Resend } from "resend";
import type { ReactElement } from "react";
import { site } from "@/config/site";

let etherealTransporter: Transporter | null = null;

function getResend() {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  return new Resend(key);
}

function fromAddress() {
  return (
    process.env.EMAIL_FROM ??
    `Dr Farhat Hashmi Academy <${site.email}>`
  );
}

export function adminEmail() {
  return process.env.ADMIN_EMAIL ?? site.email;
}

export function appBaseUrl() {
  return (
    process.env.AUTH_URL ??
    process.env.NEXTAUTH_URL ??
    "http://localhost:3000"
  );
}

async function getSmtpTransporter() {
  if (process.env.SMTP_HOST) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT ?? 587),
      secure: process.env.SMTP_SECURE === "true",
      auth:
        process.env.SMTP_USER && process.env.SMTP_PASS
          ? {
              user: process.env.SMTP_USER,
              pass: process.env.SMTP_PASS,
            }
          : undefined,
    });
  }

  // Dev fallback: Ethereal test inbox (preview URL logged to console)
  if (process.env.NODE_ENV !== "production") {
    if (!etherealTransporter) {
      const testAccount = await nodemailer.createTestAccount();
      etherealTransporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
      console.info(
        "[email] Using Ethereal test mailbox:",
        testAccount.user,
        "(open preview URLs from server logs)",
      );
    }
    return etherealTransporter;
  }

  return null;
}

export async function sendEmail({
  to,
  subject,
  react,
}: {
  to: string | string[];
  subject: string;
  react: ReactElement;
}) {
  const html = await render(react);
  const recipients = Array.isArray(to) ? to : [to];

  const resend = getResend();
  if (resend) {
    const { error } = await resend.emails.send({
      from: fromAddress(),
      to: recipients,
      subject,
      html,
    });
    if (error) {
      console.error("[email:resend]", error);
      return { ok: false as const, error };
    }
    return { ok: true as const, provider: "resend" as const };
  }

  const smtp = await getSmtpTransporter();
  if (smtp) {
    const info = await smtp.sendMail({
      from: fromAddress(),
      to: recipients.join(", "),
      subject,
      html,
    });
    const preview = nodemailer.getTestMessageUrl(info);
    if (preview) {
      console.info("[email:preview]", preview);
    }
    return {
      ok: true as const,
      provider: "smtp" as const,
      previewUrl: preview || undefined,
    };
  }

  console.warn("[email] No mailer configured — email not sent", {
    to: recipients,
    subject,
  });
  return { ok: false as const, error: "No mailer configured" };
}
