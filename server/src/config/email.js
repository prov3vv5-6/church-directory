const { Resend } = require('resend');

// TODO: replace 'onboarding@resend.dev' with your church domain email once
// the domain is verified in Resend (e.g. noreply@yourchurch.org)
async function sendPasswordResetEmail(toEmail, resetLink) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  await resend.emails.send({
    from: 'Church Directory <onboarding@resend.dev>',
    to: toEmail,
    subject: 'Reset your password',
    html: `
      <p>Hi,</p>
      <p>We received a request to reset your Church Directory password.</p>
      <p>
        <a href="${resetLink}" style="
          display: inline-block;
          padding: 10px 20px;
          background: #c76f13;
          color: white;
          text-decoration: none;
          border-radius: 6px;
          font-weight: 500;
        ">Reset Password</a>
      </p>
      <p>This link expires in <strong>1 hour</strong>. If you didn't request this, you can safely ignore this email.</p>
    `,
  });
}

module.exports = { sendPasswordResetEmail };
