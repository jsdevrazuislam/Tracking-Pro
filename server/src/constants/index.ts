const DATA_LIMIT = "5MB";
const API_VERSION = '/api/v1'

const SocketEventEnum = Object.freeze({
  SOCKET_CONNECTED: "connected",
  SOCKET_DISCONNECTED: "disconnect",
  SOCKET_ERROR: "socketError",
  PARCEL_LOCATION: "PARCEL_LOCATION",
  AGENT_JOIN: "AGENT_JOIN",
  JOIN_CLIENT_PARCEL: "JOIN_CLIENT_PARCEL",
});

const USER_ATTRIBUTE = ["id", "full_name", "email", "phone", "location", "status", "role", "createdAt"]

export { DATA_LIMIT, SocketEventEnum, API_VERSION, USER_ATTRIBUTE };