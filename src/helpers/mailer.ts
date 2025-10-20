import User from '@/models/userModel';
import nodemailer from 'nodemailer'
import bcryptjs from 'bcryptjs';

export const sendEmail = async({email, emailType, userId}:any) =>
{
    try{

        const hashedToken = await bcryptjs.hash(userId.toString(), 10)

        if(emailType === "VERIFY"){
            await User.findByIdAndUpdate(userId,
                {
                    verifyToken: hashedToken,
                    verifyTokenExpiry: Date.now() + 3600000
                 })
        }
        else if(emailType === "RESET"){
            await User.findByIdAndUpdate(userId,
                {
                    forgotPasswordToken: hashedToken,
                    forgotPasswordTokenExpiry: Date.now() + 3600000
                 })
        }
    var transport = nodemailer.createTransport({
        host: "sandbox.smtp.mailtrap.io",
        port: 2525,
        auth: {
            user: "881adce8eef45a", 
            pass: "c668c78e490a94" 
        }
    });

        const mailOptions = {
            from: 'prothomghosh41@gmail.com',
            to: email,
            subject: emailType === "VERIFY" ? "Verify your email" : "Reset your Password",
            html: `<p> 
                Click <a href="${process.env.DOMAIN}/verifyemail?token=${hashedToken}">Here</a> to ${
                emailType === "VERIFY" ? "verify your email" : "reset your password"
                } or copy and paste the link below in your browser.
                <br> ${process.env.DOMAIN}/verifyemail?token=${hashedToken}
                </p>`, 
        }

        const mailResponse = await transport.sendMail(mailOptions)
        return mailResponse
    }

    catch(error:any){
        throw new Error(error.message)
    }
}


export const sendConfirmationEmail = async (
  email: string,
  username: string,
  seats: string[],
  totalPrice: number
) => {
  try {
    const transport = nodemailer.createTransport({
      host: process.env.MAILTRAP_HOST || "sandbox.smtp.mailtrap.io",
      port: Number(process.env.MAILTRAP_PORT) || 2525,
      auth: {
        user: process.env.MAILTRAP_USER || "881adce8eef45a",
        pass: process.env.MAILTRAP_PASS || "c668c78e490a94"
      },
      logger: true,    // log SMTP traffic
      debug: true      // show debugging output
    });

    // Verify connection
    await transport.verify();
    console.log("✅ SMTP connection verified for Mailtrap");

    const htmlContent = `
      <h2>Flight Booking Confirmation</h2>
      <p>Dear ${username},</p>
      <p>Thank you for your booking. Here are your seat details:</p>
      <ul>
        ${seats.map(seat => `<li>Seat: ${seat}</li>`).join('')}
      </ul>
      <p><strong>Total Paid:</strong> $${totalPrice.toFixed(2)}</p>
      <p>We hope you enjoy your flight!</p>
      <br/>
      <p>— Airline Team</p>
    `;

    const mailOptions = {
      from: process.env.EMAIL_FROM || 'no‑reply@example.com',
      to: email,
      subject: "Your Flight Booking Confirmation",
      html: htmlContent
    };

    const info = await transport.sendMail(mailOptions);
    console.log("📬 sendMail info:", info);
    return info;

  } catch (err: any) {
    console.error("❌ sendConfirmationEmail error:", err);
    throw err;
  }
};