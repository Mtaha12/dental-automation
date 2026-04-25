import nodemailer from "nodemailer";

function createTransport() {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    return null;
  }

  const port = Number(process.env.SMTP_PORT || 587);
  const secure = process.env.SMTP_SECURE
    ? process.env.SMTP_SECURE === "true"
    : port === 465;

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    tls: process.env.SMTP_ALLOW_SELF_SIGNED === "true" ? { rejectUnauthorized: false } : undefined,
  });
}

const transporter = createTransport();

if (transporter) {
  transporter
    .verify()
    .then(() => {
      console.log("SMTP connection verified.");
    })
    .catch((error) => {
      console.error("SMTP verification failed:", error.message);
    });
}

async function safeSend(mailOptions) {
  if (!transporter) {
    console.log("Email transport not configured. Skipping email:", mailOptions.subject);
    return;
  }

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error(`Email send failed for '${mailOptions.subject}':`, error.message);
  }
}

export async function sendPatientConfirmation({ name, email, date, time, doctorName, clinicAddress }) {
  await safeSend({
    from: process.env.FROM_EMAIL || process.env.SMTP_USER,
    to: email,
    subject: "Appointment Confirmed",
    text: `Hello ${name},\nYour appointment is confirmed.\n\nDate: ${date}\nTime: ${time}\nDoctor: ${doctorName}\nClinic Address: ${clinicAddress}\n\nThank you!`,
  });
}

export async function sendDoctorNotification({ doctorEmail, patientName, service, date, time }) {
  if (!doctorEmail) return;

  await safeSend({
    from: process.env.FROM_EMAIL || process.env.SMTP_USER,
    to: doctorEmail,
    subject: "New Appointment Booked",
    text: `Patient: ${patientName}\nService: ${service}\nDate: ${date}\nTime: ${time}`,
  });
}
