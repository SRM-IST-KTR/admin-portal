// Every backend call goes through the same-origin proxy at pages/api/backend/[...path].
// The proxy attaches the required API key server-side (admin for writes and admin
// reads, public for display reads), so no key is ever shipped to the browser.
const PROXY = "/api/backend";

export const API_ENDPOINTS = {
    CONTACT: {
        SEND_MESSAGE: `${PROXY}/contact`,
    },
    EMAIL: {
        SEND: "/api/email/send",
    },
    EVENTS: {
        GET_ALL: `${PROXY}/events`,
        GET_BY_ID: (id) => `${PROXY}/events/${id}`,
        GET_BY_SLUG: (slug) => `${PROXY}/events/slug/${slug}`,
        PARTICIPANTS: (slug) => `${PROXY}/events/participants/${slug}`,
        UPDATE_PARTICIPANT: (email) => `${PROXY}/events/participants/${email}`,
        CHECKIN: `${PROXY}/events/checkin`,
        SNACKS: `${PROXY}/events/snacks`,
        CREATE: `${PROXY}/events`,
        UPDATE: (id) => `${PROXY}/events/${id}`,
        DELETE: (id) => `${PROXY}/events/${id}`,
        SEND_RSVP: `${PROXY}/events/send-rsvp`,
    },
    RECRUITMENT: {
        GET_ALL: `${PROXY}/recruitment`,
        GET_BY_ID: (id) => `${PROXY}/recruitment/${id}`,
        CREATE: `${PROXY}/recruitment`,
        UPDATE: (id) => `${PROXY}/recruitment/${id}`,
        DELETE: (id) => `${PROXY}/recruitment/${id}`,
        BATCH_UPDATE: `${PROXY}/recruitment/batch`,
        ANALYTICS: `${PROXY}/recruitment/analytics`,
        TASKS: `${PROXY}/recruitment/tasks`,
        TASK_BY_ID: (id) => `${PROXY}/recruitment/tasks/${id}`,
        SEND_TASK_REMINDER: `${PROXY}/recruitment/send-task-reminder`,
        GET_TEAM_ONBOARDING: (email) => `${PROXY}/team/by-email/${encodeURIComponent(email)}`,
    },
    SPONSORS: {
        GET_ALL: `${PROXY}/sponsors`,
        GET_BY_ID: (id) => `${PROXY}/sponsors/${id}`,
        CREATE: `${PROXY}/sponsors`,
        UPDATE: (id) => `${PROXY}/sponsors/${id}`,
        DELETE: (id) => `${PROXY}/sponsors/${id}`,
    },
    TEAM: {
        GET_ALL: `${PROXY}/team`,
        GET_BY_ID: (id) => `${PROXY}/team/${id}`,
        CREATE: `${PROXY}/team`,
        UPDATE: (id) => `${PROXY}/team/${id}`,
        DELETE: (id) => `${PROXY}/team/${id}`,
    },
    CERTIFICATES: {
        GET_ALL: `${PROXY}/certificate`,
        GENERATE: `${PROXY}/certificate/generate`,
        VERIFY: (certificateId) => `${PROXY}/certificate/verify/${certificateId}`,
        DOWNLOAD: (certificateId) => `${PROXY}/certificate/download/${certificateId}`,
        REVOKE: (certificateId) => `${PROXY}/certificate/revoke/${certificateId}`,
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
    API_ENDPOINTS,
    API_CONFIG,
    CONTACT_INFO,
};
