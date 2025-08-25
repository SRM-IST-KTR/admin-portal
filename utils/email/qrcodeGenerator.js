import QRCode from "qrcode";

export async function generateQRCode(data) {
  try {
    const qrCodeImage = await QRCode.toBuffer(data);
    return qrCodeImage;
  } catch (error) {
    throw new Error("Error generating QR code");
  }
}
