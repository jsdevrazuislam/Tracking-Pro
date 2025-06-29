import bwipjs from 'bwip-js';



export const getStatusDescription = (status: string) => {
  const descriptions: Record<string, string> = {
    pending: 'Parcel booking initiated.',
    assigned: 'Delivery agent assigned to parcel.',
    picked: 'Parcel picked from sender.',
    in_transit: 'Parcel is en route to receiver.',
    delivered: 'Parcel delivered successfully.',
    cancelled: 'Parcel delivery cancelled.',
  };
  return descriptions[status] || 'Status updated.';
};

export async function generateBarcodeBase64(trackingCode: string): Promise<string> {
  const pngBuffer = await bwipjs.toBuffer({
    bcid: 'code128',
    text: trackingCode,
    scale: 3,
    height: 10,
    includetext: true,
    textxalign: 'center',
  });

  return `data:image/png;base64,${pngBuffer.toString('base64')}`;
}
