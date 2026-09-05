export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

export const API_ENDPOINTS = {
    CONTACT: {
        SEND_MESSAGE: `${API_BASE_URL}/api/contact`,
    },
    EVENTS: {
        GET_ALL: `${API_BASE_URL}/api/events`,
        GET_BY_ID: (id) => `${API_BASE_URL}/api/events/${id}`,
        GET_BY_SLUG: (slug) => `${API_BASE_URL}/api/events/slug/${slug}`,
        PARTICIPANTS: (slug) => `${API_BASE_URL}/api/events/participants/${slug}`,
        UPDATE_PARTICIPANT: (email) => `${API_BASE_URL}/api/events/participants/${email}`,
        CHECKIN: `${API_BASE_URL}/api/events/checkin`,
        SNACKS: `${API_BASE_URL}/api/events/snacks`,
        CREATE: `${API_BASE_URL}/api/events`,
        UPDATE: (id) => `${API_BASE_URL}/api/events/${id}`,
        DELETE: (id) => `${API_BASE_URL}/api/events/${id}`,
    },
    RECRUITMENT: {
        GET_ALL: `${API_BASE_URL}/api/recruitment`,
        GET_BY_ID: (id) => `${API_BASE_URL}/api/recruitment/${id}`,
        CREATE: `${API_BASE_URL}/api/recruitment`,
        UPDATE: (id) => `${API_BASE_URL}/api/recruitment/${id}`,
        DELETE: (id) => `${API_BASE_URL}/api/recruitment/${id}`,
        BATCH_UPDATE: `${API_BASE_URL}/api/recruitment/batch`,
        ANALYTICS: `${API_BASE_URL}/api/recruitment/analytics`,
        TASKS: `${API_BASE_URL}/api/recruitment/tasks`,
        TASK_BY_ID: (id) => `${API_BASE_URL}/api/recruitment/tasks/${id}`,
    },
    SPONSORS: {
        GET_ALL: `${API_BASE_URL}/api/sponsors`,
        GET_BY_ID: (id) => `${API_BASE_URL}/api/sponsors/${id}`,
        CREATE: `${API_BASE_URL}/api/sponsors`,
        UPDATE: (id) => `${API_BASE_URL}/api/sponsors/${id}`,
        DELETE: (id) => `${API_BASE_URL}/api/sponsors/${id}`,
    },
    TEAM: {
        GET_ALL: `${API_BASE_URL}/api/team`,
        GET_BY_ID: (id) => `${API_BASE_URL}/api/team/${id}`,
        CREATE: `${API_BASE_URL}/api/team`,
        UPDATE: (id) => `${API_BASE_URL}/api/team/${id}`,
        DELETE: (id) => `${API_BASE_URL}/api/team/${id}`,
    },
    CERTIFICATES: {
        GENERATE: `${API_BASE_URL}/api/certificate/generate`,
        VERIFY: (certificateId) => `${API_BASE_URL}/api/certificate/verify/${certificateId}`,
        DOWNLOAD: (certificateId) => `${API_BASE_URL}/api/certificate/download/${certificateId}`,
    },
};

export const API_CONFIG = {
    TIMEOUT: 30000,
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
