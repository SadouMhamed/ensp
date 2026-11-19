import "server-only";
import nodemailer, { type Transporter } from "nodemailer";
import { BRAND_NAME } from "@/components/brand/logo";

/**
 * Sends emails with nodemailer over SMTP. Settings come from .env:
 *   SMTP_HOST, SMTP_PORT (465 = SSL, 587 = STARTTLS), SMTP_USER, SMTP_PASSWORD,
 *   EMAIL_FROM (e.g. "ENSP <no-reply@ensp.dz>")
 *
 * Without SMTP settings:
 * - development: the email is printed in the server log (so the flow can be tested)
 * - production: an error is logged and nothing is sent
 */

let transporter: Transporter | null = null;

function getTransporter(): Transporter | null {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASSWORD) return null;
  if (!transporter) {
    const port = Number(SMTP_PORT ?? 587);
    transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port,
      secure: port === 465, // 465 = SSL from the start; 587 = upgrade with STARTTLS
      requireTLS: port !== 465, // never send the password over an unencrypted line
      auth: { user: SMTP_USER, pass: SMTP_PASSWORD },
    });
  }
  return transporter;
}

type Email = { to: string; subject: string; text: string; html: string };

export async function sendEmail(email: Email) {
  const from = process.env.EMAIL_FROM ?? process.env.SMTP_USER;
  const t = getTransporter();

  if (!t || !from) {
    if (process.env.NODE_ENV !== "production") {
      console.info(
        `\n[email] SMTP is not set up, so this email was NOT sent.\nTo: ${email.to}\nSubject: ${email.subject}\n\n${email.text}\n`,
      );
      return;
    }
    throw new Error("Email is not configured (SMTP_* / EMAIL_FROM missing).");
  }

  await t.sendMail({ from, ...email });
}

/** Escapes text before putting it inside the HTML email. */
function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export function sendPasswordResetEmail({
  to,
  name,
  url,
  expiresInMinutes,
}: {
  to: string;
  name: string;
  url: string;
  expiresInMinutes: number;
}) {
  const subject = `Réinitialisation de votre mot de passe – ${BRAND_NAME}`;
  const text = [
    `Bonjour ${name},`,
    "",
    `Une demande de réinitialisation du mot de passe de votre compte ${BRAND_NAME} a été faite.`,
    `Pour choisir un nouveau mot de passe, ouvrez ce lien (valable ${expiresInMinutes} minutes, une seule fois) :`,
    "",
    url,
    "",
    "Si vous n'êtes pas à l'origine de cette demande, ignorez cet e-mail : votre mot de passe ne change pas.",
  ].join("\n");

  const safeName = escapeHtml(name);
  const safeUrl = escapeHtml(url);
  const html = `<!doctype html>
<html lang="fr">
  <body style="margin:0;padding:24px;background:#f6f6f4;font-family:Arial,Helvetica,sans-serif;color:#1c1c1a">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:520px;margin:0 auto;background:#ffffff;border-radius:12px;padding:32px">
      <tr><td>
        <p style="margin:0 0 16px;font-size:18px;font-weight:bold">${escapeHtml(BRAND_NAME)}</p>
        <p style="margin:0 0 12px">Bonjour ${safeName},</p>
        <p style="margin:0 0 20px;line-height:1.5">Une demande de réinitialisation du mot de passe de votre compte a été faite. Cliquez sur le bouton pour choisir un nouveau mot de passe.</p>
        <p style="margin:0 0 20px"><a href="${safeUrl}" style="display:inline-block;background:#e8762b;color:#ffffff;text-decoration:none;padding:12px 20px;border-radius:8px;font-weight:bold">Choisir un nouveau mot de passe</a></p>
        <p style="margin:0 0 8px;font-size:13px;color:#6b6b66;line-height:1.5">Ce lien est valable ${expiresInMinutes} minutes et ne fonctionne qu'une seule fois.</p>
        <p style="margin:0;font-size:13px;color:#6b6b66;line-height:1.5">Si vous n'êtes pas à l'origine de cette demande, ignorez cet e-mail : votre mot de passe ne change pas.</p>
      </td></tr>
    </table>
  </body>
</html>`;

  return sendEmail({ to, subject, text, html });
}
