export class EmailTemplate {
  static getWelcomeTemplate(name: string): string {
    return `
      <h1>Welcome, ${name}!</h1>
      <p>We’re thrilled to have you onboard </p>
      <p>Start exploring your account today!</p>
    `;
  }

  static getVerificationTemplate(verifyUrl: string): string {
    return `
      <h2>Verify Your Email</h2>
      <p>Click below to verify your account in 10 minutes:</p>
      <a href="${verifyUrl}" target="_blank"
         style="background:#007bff;color:#fff;padding:10px 20px;text-decoration:none;border-radius:5px;">
         Verify Email
      </a>
      <p>If you didn’t request this, please ignore this message.</p>
    `;
  }
}
