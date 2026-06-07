/**
 * email-templates.ts
 * 
 * Template HTML untuk email yang dikirim via Resend.
 */

// ─── Shared Styles ────────────────────────────────────────────────────────────

const baseStyles = `
  font-family: 'Arial', sans-serif;
  background: #f5f0e8;
  margin: 0;
  padding: 0;
`;

const containerStyles = `
  max-width: 540px;
  margin: 40px auto;
  background: #fffef7;
  border: 3px solid #1a1a1a;
  box-shadow: 6px 6px 0px #1a1a1a;
`;

const headerStyles = `
  background: #f5c842;
  border-bottom: 3px solid #1a1a1a;
  padding: 28px 32px;
`;

const logoStyles = `
  display: inline-block;
  background: #1a1a1a;
  color: #f5c842;
  font-family: monospace;
  font-weight: 900;
  font-size: 18px;
  padding: 6px 12px;
  letter-spacing: 2px;
  margin-right: 10px;
  border: 2px solid #1a1a1a;
`;

const titleStyles = `
  font-size: 14px;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 3px;
  color: #1a1a1a;
  display: inline-block;
  vertical-align: middle;
`;

const bodyStyles = `
  padding: 32px;
`;

const headingStyles = `
  font-size: 22px;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #1a1a1a;
  margin: 0 0 12px 0;
`;

const textStyles = `
  font-size: 15px;
  color: #333;
  line-height: 1.6;
  margin: 0 0 24px 0;
`;

const buttonStyles = `
  display: inline-block;
  background: #1a1a1a;
  color: #f5c842 !important;
  text-decoration: none;
  font-weight: 900;
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 2px;
  padding: 14px 28px;
  border: 3px solid #1a1a1a;
  box-shadow: 4px 4px 0px #555;
`;

const dividerStyles = `
  border: none;
  border-top: 2px solid #e0d9cc;
  margin: 28px 0;
`;

const smallTextStyles = `
  font-size: 12px;
  color: #888;
  line-height: 1.5;
`;

const footerStyles = `
  background: #f0ebe0;
  border-top: 3px solid #1a1a1a;
  padding: 20px 32px;
  text-align: center;
  font-size: 12px;
  color: #666;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

// ─── Template 1: Verifikasi Email ────────────────────────────────────────────

export function buildVerificationEmail(opts: {
  username: string;
  verifyUrl: string;
}): { subject: string; html: string } {
  const { username, verifyUrl } = opts;

  return {
    subject: '✅ Verifikasi Email TIMO Kamu',
    html: `
<!DOCTYPE html>
<html lang="id">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="${baseStyles}">
  <div style="${containerStyles}">
    <div style="${headerStyles}">
      <span style="${logoStyles}">TI</span>
      <span style="${titleStyles}">TIMO</span>
    </div>
    <div style="${bodyStyles}">
      <h1 style="${headingStyles}">Verifikasi Email Kamu 🎉</h1>
      <p style="${textStyles}">
        Hai <strong>${username}</strong>!<br>
        Selamat datang di TIMO — Task & Time Management untuk mahasiswa produktif.
        Klik tombol di bawah untuk mengkonfirmasi email kamu.
      </p>
      <div style="text-align: center; margin: 32px 0;">
        <a href="${verifyUrl}" style="${buttonStyles}">
          ✅ Verifikasi Sekarang
        </a>
      </div>
      <hr style="${dividerStyles}">
      <p style="${smallTextStyles}">
        Link ini akan kedaluwarsa dalam <strong>24 jam</strong>.
        Jika kamu tidak mendaftar ke TIMO, abaikan email ini.
        <br><br>
        Atau copy link berikut ke browser kamu:<br>
        <a href="${verifyUrl}" style="color: #2563eb; word-break: break-all;">${verifyUrl}</a>
      </p>
    </div>
    <div style="${footerStyles}">
      TIMO — Task & Time Management App
    </div>
  </div>
</body>
</html>`,
  };
}

// ─── Template 2: Undangan Kolaborasi (User sudah terdaftar) ──────────────────

export function buildCollabInviteEmail(opts: {
  invitedUsername: string;
  inviterName: string;
  taskTitle: string;
  taskDeadline?: string;
  dashboardUrl: string;
}): { subject: string; html: string } {
  const { invitedUsername, inviterName, taskTitle, taskDeadline, dashboardUrl } = opts;

  const deadlineText = taskDeadline
    ? `<br>📅 <strong>Deadline:</strong> ${taskDeadline}`
    : '';

  return {
    subject: `🤝 ${inviterName} mengundang kamu ke tugas di TIMO`,
    html: `
<!DOCTYPE html>
<html lang="id">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="${baseStyles}">
  <div style="${containerStyles}">
    <div style="${headerStyles}" style="background: #7dd87d;">
      <span style="${logoStyles}">TI</span>
      <span style="${titleStyles}">TIMO</span>
    </div>
    <div style="${bodyStyles}">
      <h1 style="${headingStyles}">Kamu Diundang! 🤝</h1>
      <p style="${textStyles}">
        Hai <strong>${invitedUsername}</strong>!<br>
        <strong>${inviterName}</strong> mengundang kamu untuk berkolaborasi pada tugas berikut:
      </p>
      <div style="background: #fffbea; border: 3px solid #1a1a1a; padding: 20px; margin: 0 0 24px 0; box-shadow: 4px 4px 0 #1a1a1a;">
        <strong style="font-size: 18px; text-transform: uppercase; letter-spacing: 1px;">📋 ${taskTitle}</strong>
        ${deadlineText}
      </div>
      <p style="${textStyles}">
        Kamu sudah ditambahkan sebagai anggota. Login ke TIMO untuk mulai berkolaborasi!
      </p>
      <div style="text-align: center; margin: 32px 0;">
        <a href="${dashboardUrl}" style="${buttonStyles}">
          🚀 Buka Dashboard TIMO
        </a>
      </div>
    </div>
    <div style="${footerStyles}">
      TIMO — Task & Time Management App
    </div>
  </div>
</body>
</html>`,
  };
}

// ─── Template 3: Undangan untuk User Baru (Belum Terdaftar) ─────────────────

export function buildNewUserInviteEmail(opts: {
  inviterName: string;
  taskTitle: string;
  registerUrl: string;
}): { subject: string; html: string } {
  const { inviterName, taskTitle, registerUrl } = opts;

  return {
    subject: `🎓 ${inviterName} mengundang kamu ke TIMO`,
    html: `
<!DOCTYPE html>
<html lang="id">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="${baseStyles}">
  <div style="${containerStyles}">
    <div style="${headerStyles}">
      <span style="${logoStyles}">TI</span>
      <span style="${titleStyles}">TIMO</span>
    </div>
    <div style="${bodyStyles}">
      <h1 style="${headingStyles}">Kamu Diajak Bergabung! 🎓</h1>
      <p style="${textStyles}">
        Hai!<br>
        <strong>${inviterName}</strong> mengundang kamu untuk berkolaborasi pada tugas 
        <strong>"${taskTitle}"</strong> di TIMO — aplikasi manajemen tugas untuk mahasiswa.
      </p>
      <p style="${textStyles}">
        Daftar akun TIMO gratis sekarang dan langsung join tugas tersebut:
      </p>
      <div style="text-align: center; margin: 32px 0;">
        <a href="${registerUrl}" style="${buttonStyles}">
          ✨ Daftar & Join Tugas
        </a>
      </div>
      <hr style="${dividerStyles}">
      <p style="${smallTextStyles}">
        Link undangan ini berlaku selama <strong>7 hari</strong>.
        Setelah daftar dan verifikasi email, kamu akan otomatis masuk ke tugas tersebut.
        <br><br>
        Atau copy link berikut ke browser:<br>
        <a href="${registerUrl}" style="color: #2563eb; word-break: break-all;">${registerUrl}</a>
      </p>
    </div>
    <div style="${footerStyles}">
      TIMO — Task & Time Management App
    </div>
  </div>
</body>
</html>`,
  };
}
