export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const API_ENDPOINTS = {
    CONTACT: {
        SEND_MESSAGE: `${API_BASE_URL}/api/contact`, // POST - Send a contact message
    },
    EVENTS: {
        GET_ALL: `${API_BASE_URL}/api/events`, // GET - Retrieve all events
        GET_BY_ID: (id) => `${API_BASE_URL}/api/event/${id}`, // GET - Retrieve a single event by ID
        CREATE: `${API_BASE_URL}/api/events/createEvent`, // POST - Create a new event
        UPDATE: (id) => `${API_BASE_URL}/api/event/update/${id}`, // PUT - Update an existing event
        DELETE: (id) => `${API_BASE_URL}/api/event/delete/${id}`, // DELETE - Delete an event
    },
    SPONSORS: {
        GET_ALL: `${API_BASE_URL}/api/sponsors`, // GET - Retrieve all sponsors
        GET_BY_ID: (id) => `${API_BASE_URL}/api/sponsor/${id}`, // GET - Retrieve a single sponsor by ID
        CREATE: `${API_BASE_URL}/api/sponsor/create`, // POST - Create a new sponsor
        UPDATE: (id) => `${API_BASE_URL}/api/sponsor/update/${id}`, // PUT - Update an existing sponsor
        DELETE: (id) => `${API_BASE_URL}/api/sponsor/delete/${id}`, // DELETE - Delete a sponsor
    },
    TEAM: {
        GET_ALL: `${API_BASE_URL}/api/team`, // GET - Retrieve all team members
        GET_BY_ID: (id) => `${API_BASE_URL}/api/team/${id}`, // GET - Retrieve a single team member by ID
        CREATE: `${API_BASE_URL}/api/team`, // POST - Create a new team member
        UPDATE: (id) => `${API_BASE_URL}/api/team/${id}`, // PUT - Update an existing team member
        DELETE: (id) => `${API_BASE_URL}/api/team/${id}`, // DELETE - Delete a team member
    },
    CERTIFICATES: {
        GENERATE: `${API_BASE_URL}/api/certificate/generate`, // POST - Generate a certificate for an event participant
        VERIFY: (certificateId) => `${API_BASE_URL}/api/certificate/verify/${certificateId}`, // GET - Verify the authenticity of a certificate
        DOWNLOAD: (certificateId) => `${API_BASE_URL}/api/certificate/download/${certificateId}`, // GET - Download a verified certificate
    },
};
export const API_CONFIG = {
    TIMEOUT: 30000, // 30 seconds
    HEADERS: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
};
export const CONTACT_INFO = {
    EMAIL: "community@githubsrmist.in",
    WEBSITE: "https://githubsrmist.in",
};

export default {
    API_BASE_URL,
    API_ENDPOINTS,
    API_CONFIG,
    CONTACT_INFO,
};