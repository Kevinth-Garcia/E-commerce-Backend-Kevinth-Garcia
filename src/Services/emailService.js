import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: Number(process.env.SMTP_PORT) || 587,
  secure: Number(process.env.SMTP_PORT) === 465,
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },

  // evita requests colgadas
  connectionTimeout: 10_000,
  greetingTimeout: 10_000,
  socketTimeout: 10_000,
});

transporter.verify((error) => {
  if (error) console.error("SMTP verify error:", error?.message || error);
  else console.log("SMTP listo ✅");
});

const FROM = `"${process.env.FROM_EMAIL || "Friki-Mundo"}" <${
  process.env.SMTP_USER
}>`;

async function sendMailSafe(mailOptions, label = "email") {
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ ${label} enviado:`, info.messageId);
    return { ok: true, info };
  } catch (err) {
    console.error(`❌ ${label} falló:`, err?.message || err);
    return { ok: false, err };
  }
}

export const sendWelcomeEmail = async (user) => {
  const mailOptions = {
    from: FROM,
    to: user.email,
    subject: "¡Bienvenido a Friki-Mundo!",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333;">Hola ${user.nombre},</h1>
        <p>Gracias por registrarte en nuestra tienda. Estamos felices de tenerte aquí.</p>
        <p>¡Esperamos que disfrutes tus compras!</p>
        <div style="margin-top: 20px; padding: 10px; background-color: #f4f4f4; border-radius: 5px;">
          <p style="margin: 0; font-size: 12px; color: #666;">Si no creaste esta cuenta, por favor ignora este correo.</p>
        </div>
      </div>
    `,
  };

  return sendMailSafe(mailOptions, "welcome");
};

export const sendPasswordResetEmail = async (user, resetUrl) => {
  const mailOptions = {
    from: FROM,
    to: user.email,
    subject: "Recuperación de Contraseña",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333;">Recuperación de Contraseña</h1>
        <p>Has solicitado restablecer tu contraseña.</p>
        <p>Haz clic en el siguiente botón para continuar:</p>
        <a href="${resetUrl}" style="display:inline-block;padding:10px 20px;background:#007bff;color:#fff;text-decoration:none;border-radius:5px;">
          Restablecer Contraseña
        </a>
        <p style="margin-top: 20px;">O copia y pega este enlace en tu navegador:</p>
        <p><a href="${resetUrl}">${resetUrl}</a></p>
        <p>Si no solicitaste esto, ignora este correo.</p>
      </div>
    `,
  };

  return sendMailSafe(mailOptions, "password-reset");
};

export const sendOrderConfirmationEmail = async (user, order) => {
  const itemsHtml = (order.items || [])
    .map(
      (item) =>
        `<li>${item.title} x ${item.quantity} - $${item.unit_price}</li>`
    )
    .join("");

  const mailOptions = {
    from: FROM,
    to: user.email,
    subject: `Confirmación de Compra #${order._id}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333;">¡Gracias por tu compra, ${user.nombre}!</h1>
        <p>Tu orden <strong>#${order._id}</strong> ha sido confirmada.</p>

        <h3>Detalles de la compra:</h3>
        <ul>${itemsHtml}</ul>

        <p><strong>Total: $${order.total}</strong></p>
        <p>Te avisaremos cuando tu pedido sea enviado.</p>
      </div>
    `,
  };

  return sendMailSafe(mailOptions, "order-confirmation");
};

export const sendEmailVerification = async (user, verifyUrl) => {
  const mailOptions = {
    from: FROM,
    to: user.email,
    subject: "Verifica tu cuenta - Friki-Mundo",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
        <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <h1 style="color: #333; margin-bottom: 20px;">¡Hola ${
            user.nombre
          }!</h1>
          <p style="color: #666; font-size: 16px; line-height: 1.5;">
            Gracias por registrarte en nuestra Tienda. Para completar tu registro, 
            por favor verifica tu dirección de correo electrónico haciendo clic en el siguiente botón:
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verifyUrl}"
              style="display:inline-block;padding:15px 40px;background:#4F46E5;color:#fff;text-decoration:none;border-radius:5px;font-weight:bold;font-size:16px;">
              Verificar mi cuenta
            </a>
          </div>
          <p style="color: #999; font-size: 14px; margin-top: 20px;">O copia y pega este enlace en tu navegador:</p>
          <p style="color: #4F46E5; font-size: 14px; word-break: break-all;">${verifyUrl}</p>
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
            <p style="color: #999; font-size: 12px; margin: 0;">
              Este enlace expirará en ${
                process.env.OTP_EXPIRATION_MINUTES || 15
              } minutos.
            </p>
            <p style="color: #999; font-size: 12px; margin-top: 10px;">
              Si no creaste esta cuenta, por favor ignora este correo.
            </p>
          </div>
        </div>
      </div>
    `,
  };

  return sendMailSafe(mailOptions, "email-verification");
};
