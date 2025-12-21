import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

//const para servicio de envios de correos al email utilizando la configuracion de google gmail
//con su correo de bienvenida
//recuperacion de password
//verificacion de usuario
//estructura inspirada curso
//a futuro implementar un correo aparte, solo hecho para propositos de proyecto

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: Number(process.env.SMTP_PORT) || "587",
  secure: Number(process.env.SMTP_PORT) === 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

transporter.verify((error) => {
  if (error) console.error("SMTP verify error:", error);
  else console.log("SMTP listo ✅");
});

export const sendWelcomeEmail = async (user) => {
  try {
    const mailOptions = {
      from: `"${process.env.FROM_EMAIL || "Friki-Mundo"}" <${
        process.env.SMTP_USER
      }>`,
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

    const info = await transporter.sendMail(mailOptions);
    console.log("Email de bienvenida enviado:", info.messageId);
    return info;
  } catch (error) {
    console.error("Error enviando email de bienvenida:", error);
    throw error;
  }
};

export const sendPasswordResetEmail = async (user, resetUrl) => {
  try {
    const mailOptions = {
      from: `"${process.env.FROM_EMAIL || "Friki-Mundo"}" <${
        process.env.SMTP_USER
      }>`,
      to: user.email,
      subject: "Recuperación de Contraseña",
      html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h1 style="color: #333;">Recuperación de Contraseña</h1>
                    <p>Has solicitado restablecer tu contraseña.</p>
                    <p>Haz clic en el siguiente botón para continuar:</p>
                    <a href="${resetUrl}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">Restablecer Contraseña</a>
                    <p style="margin-top: 20px;">O copia y pega este enlace en tu navegador:</p>
                    <p><a href="${resetUrl}">${resetUrl}</a></p>
                    <p>Si no solicitaste esto, ignora este correo.</p>
                </div>
            `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email de recuperación enviado:", info.messageId);
    return info;
  } catch (error) {
    console.error("Error enviando email de recuperación:", error);
    throw error;
  }
};

export const sendOrderConfirmationEmail = async (user, order) => {
  try {
    const itemsHtml = order.items
      .map(
        (item) =>
          `<li>${item.title} x ${item.quantity} - $${item.unit_price}</li>`
      )
      .join("");

    const mailOptions = {
      from: `"${process.env.FROM_EMAIL || "Friki-Mundo"}" <${
        process.env.SMTP_USER
      }>`,
      to: user.email,
      subject: `Confirmación de Compra #${order._id}`,
      html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h1 style="color: #333;">¡Gracias por tu compra, ${user.nombre}!</h1>
                    <p>Tu orden <strong>#${order._id}</strong> ha sido confirmada.</p>
                    
                    <h3>Detalles de la compra:</h3>
                    <ul>
                        ${itemsHtml}
                    </ul>
                    
                    <p><strong>Total: $${order.total}</strong></p>
                    
                    <p>Te avisaremos cuando tu pedido sea enviado.</p>
                </div>
            `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email de confirmación de orden enviado:", info.messageId);
    return info;
  } catch (error) {
    console.error("Error enviando email de confirmación de orden:", error);
    // No lanzamos error aquí para no interrumpir el flujo de compra si falla el email
  }
};

export const sendVerificationEmail = async (email, verifyUrl) => {
  try {
    const mailOptions = {
      from: `"${process.env.FROM_EMAIL || "Friki-Mundo"}" <${
        process.env.SMTP_USER
      }>`,
      to: email,
      subject: "Verifica tu email",
      html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h1 style="color: #333;">Verificación de Correo</h1>
                    <p>Por favor verifica tu dirección de correo electrónico haciendo clic en el siguiente enlace:</p>
                    <a href="${verifyUrl}" style="display: inline-block; padding: 10px 20px; background-color: #28a745; color: white; text-decoration: none; border-radius: 5px;">Verificar Email</a>
                    <p style="margin-top: 20px;">Este enlace expirará pronto.</p>
                </div>
            `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email de verificación enviado:", info.messageId);
    return info;
  } catch (error) {
    console.error("Error enviando email de verificación:", error);
    throw error;
  }
};

export const sendEmailVerification = async (user, verifyUrl) => {
  try {
    const mailOptions = {
      from: `"${process.env.FROM_EMAIL || "Friki-Mundo"}" <${
        process.env.SMTP_USER
      }>`,
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
                               style="display: inline-block; padding: 15px 40px; background-color: #4F46E5; color: white; 
                                      text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 16px;">
                                Verificar mi cuenta
                            </a>
                        </div>
                        <p style="color: #999; font-size: 14px; margin-top: 20px;">
                            O copia y pega este enlace en tu navegador:
                        </p>
                        <p style="color: #4F46E5; font-size: 14px; word-break: break-all;">
                            ${verifyUrl}
                        </p>
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

    const info = await transporter.sendMail(mailOptions);
    console.log("Email de verificación de cuenta enviado:", info.messageId);
    return info;
  } catch (error) {
    console.error("Error enviando email de verificación de cuenta:", error);
    throw error;
  }
};
