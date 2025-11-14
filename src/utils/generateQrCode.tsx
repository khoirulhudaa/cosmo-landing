// src/utils/generateQRWithLogo.ts
import QRCode from 'qrcode';

export const generateQRWithLogo = async (
  text: string,
  logoPath: string = '/logo.jpg'
): Promise<string> => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas not supported');

  await QRCode.toCanvas(canvas, text, {
    width: 512,
    margin: 2,
    errorCorrectionLevel: 'H',
    color: { dark: '#000000', light: '#FFFFFF' },
    image: logoPath,
    imageOptions: {
      width: 80,
      margin: 10,
      crossOrigin: 'anonymous',
    },
  });

  return canvas.toDataURL('image/png');
};