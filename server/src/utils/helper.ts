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
