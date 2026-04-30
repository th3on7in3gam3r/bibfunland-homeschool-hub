import 'server-only';
import { Resend } from 'resend';

export const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = 'BibleFunLand <hello@biblefunland.com>';

export async function sendWelcomeEmail(to: string, name: string) {
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: 'Welcome to the BibleFunLand Homeschool Hub! 📚',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #2D2D2D;">
          <div style="background-color: #1E3A8A; padding: 30px; border-radius: 20px; text-align: center; margin-bottom: 30px;">
            <h1 style="color: white; margin: 0;">Welcome, ${name}!</h1>
          </div>
          <p style="font-size: 16px; line-height: 1.6;">We're so excited to have you join our community of Christian homeschool families.</p>
          <p style="font-size: 16px; line-height: 1.6;">With the Homeschool Hub, you can now generate custom, Bible-themed worksheet packs for your children in seconds using AI.</p>
          <div style="text-align: center; margin: 40px 0;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/generate" style="background-color: #FACC15; color: #1E3A8A; padding: 15px 30px; border-radius: 12px; font-weight: bold; text-decoration: none; text-transform: uppercase; font-size: 14px;">Create Your First Pack</a>
          </div>
          <p style="font-size: 14px; color: #78716c; border-top: 1px solid #e5e7eb; pt-20 mt-40">
            Blessings,<br>
            The BibleFunLand Team
          </p>
        </div>
      `,
    });
  } catch (error) {
    console.error('Failed to send welcome email:', error);
  }
}

export async function sendPackReadyEmail(to: string, packTitle: string, packId: string) {
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: 'Your Worksheet Pack is Ready! ✨',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #2D2D2D;">
          <h2 style="color: #1E3A8A;">Hooray! Your pack is ready.</h2>
          <p style="font-size: 16px; line-height: 1.6;">Your new pack, <strong>${packTitle}</strong>, has been generated and is ready to print.</p>
          <div style="text-align: center; margin: 40px 0;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/pack/${packId}" style="background-color: #1E3A8A; color: white; padding: 15px 30px; border-radius: 12px; font-weight: bold; text-decoration: none; text-transform: uppercase; font-size: 14px;">View & Print Pack</a>
          </div>
          <p style="font-size: 14px; color: #78716c;">
            You can also find all your previous packs in your <a href="${process.env.NEXT_PUBLIC_APP_URL}/profile" style="color: #1E3A8A;">Profile</a>.
          </p>
        </div>
      `,
    });
  } catch (error) {
    console.error('Failed to send pack ready email:', error);
  }
}
