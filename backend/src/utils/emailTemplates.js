const OTP_TEMPLATE = (otp, name) => `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden;">
        <div style="background-color: #2563eb; padding: 40px 20px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 800;">PropertyHub</h1>
        </div>
        <div style="padding: 40px; background-color: white;">
            <h2 style="color: #1e293b; margin-top: 0;">Hi ${name},</h2>
            <p style="color: #64748b; line-height: 1.6;">Welcome to the future of real estate! Please use the following code to verify your account.</p>
            
            <div style="text-align: center; margin: 40px 0;">
                <div style="background-color: #f1f5f9; display: inline-block; padding: 20px 40px; border-radius: 12px; border: 2px dashed #cbd5e1;">
                    <span style="font-size: 32px; font-weight: 900; letter-spacing: 10px; color: #0f172a;">${otp}</span>
                </div>
            </div>

            <p style="color: #ef4444; font-size: 14px; font-weight: 600; text-align: center;">This code expires in 10 minutes.</p>
            <hr style="border: 0; border-top: 1px solid #f1f5f9; margin: 40px 0;">
            <p style="color: #94a3b8; font-size: 12px; text-align: center;">If you didn't create an account with PropertyHub, you can safely ignore this email.</p>
        </div>
    </div>
`;

const RESET_PASSWORD_TEMPLATE = (resetUrl, name) => `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 20px; overflow: hidden;">
        <div style="background-color: #0f172a; padding: 40px 20px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 800;">PropertyHub</h1>
        </div>
        <div style="padding: 40px; background-color: white;">
            <h2 style="color: #1e293b; margin-top: 0;">Password Reset Request</h2>
            <p style="color: #64748b; line-height: 1.6;">Hello ${name}, we received a request to reset your password. Click the button below to choose a new one.</p>
            
            <div style="text-align: center; margin: 40px 0;">
                <a href="${resetUrl}" style="background-color: #2563eb; color: white; padding: 16px 32px; border-radius: 12px; text-decoration: none; font-weight: 700; display: inline-block; box-shadow: 0 10px 15px -3px rgba(37, 99, 235, 0.4);">Reset Password</a>
            </div>

            <p style="color: #64748b; font-size: 13px;">Or copy and paste this link in your browser:</p>
            <p style="color: #2563eb; font-size: 12px; word-break: break-all;">${resetUrl}</p>
            
            <p style="color: #ef4444; font-size: 14px; margin-top: 30px;">This link is valid for 10 minutes only.</p>
        </div>
        <div style="background-color: #f8fafc; padding: 20px; text-align: center; color: #94a3b8; font-size: 12px;">
            © 2024 PropertyHub Inc. 
        </div>
    </div>
`;

module.exports = { OTP_TEMPLATE, RESET_PASSWORD_TEMPLATE };