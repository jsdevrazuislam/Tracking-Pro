const ApiStrings = {
  LOGIN: "/auth/login",
  REGISTER: "/auth/register",
  ME: "/auth/me",
  LOGOUT: "/auth/logout",
  // parcel
  BOOK_PARCEL: '/parcel/',
  GET_PARCELS: '/parcel/my',
  GET_STATS: '/parcel/stats',
  AGENT_STATS: '/parcel/agent-stats',
  AGENT_ASSIGN_PARCELS: '/parcel/agent-assign-parcels',
  TRACK_PARCEL: '/parcel/track',
  UPDATE_PARCEL_STATUS: '/parcel/update-status',
  PARCEL_DETAILS: '/parcel/parcel-details',
  // Admin
  GET_ADMIN_STATS: '/admin/stats',
  REPORT_EXPORT: '/admin/export',
  GENERATE_LABEL: '/parcel/generate-barcode',
  UNASSIGNED_PARCELS: '/admin/unassigned-parcels',
  GET_ACTIVE_AGENTS: '/admin/agents',
  GET_USERS: '/admin/users',
  ASSIGN_PARCEL: '/admin/assign-parcel',
  GET_BOOKINGS: '/admin/bookings',
  CHANGE_USER_STATUS: '/admin/user',
};

export default ApiStrings;