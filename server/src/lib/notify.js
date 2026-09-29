import nodemailer from 'nodemailer';

const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_SECURE, MAIL_FROM, HOTEL_EMAIL } = process.env;

const transporter =
  SMTP_HOST && HOTEL_EMAIL
    ? nodemailer.createTransport({
        host: SMTP_HOST,
        port: Number(SMTP_PORT) || 587,
        secure: SMTP_SECURE === 'true',
        auth: SMTP_USER ? { user: SMTP_USER, pass: SMTP_PASS } : undefined,
      })
    : null;

const oneLine = (s) => String(s).replace(/[\r\n]+/g, ' ').slice(0, 200);

/**
 * Emails the hotel about a new booking request or message. Without SMTP settings
 * the notification is only logged, so the site keeps working during development.
 * Never throws: a mail failure must not fail the guest's request.
 */
export async function notifyHotel({ subject, lines, replyTo }) {
  const body = lines.filter(Boolean).join('\n');
  if (!transporter) {
    console.log(`\n[notification] ${subject}\n${body}\n`);
    return;
  }
  try {
    await transporter.sendMail({
      from: MAIL_FROM || SMTP_USER || HOTEL_EMAIL,
      to: HOTEL_EMAIL,
      replyTo,
      subject: oneLine(subject),
      text: body,
    });
  } catch (err) {
    console.error('[notification] email failed:', err.message);
  }
}
