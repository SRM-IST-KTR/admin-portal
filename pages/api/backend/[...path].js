const BACKEND_API_BASE_URL = (
  process.env.BACKEND_API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "http://localhost:8000"
).replace(/\/+$/, "");

const PUBLIC_KEY =
  process.env.PUBLIC_API_KEY || process.env.NEXT_PUBLIC_PUBLIC_API_KEY;

// First path segment must be one of these; anything else is rejected so this
// route cannot be used to reach arbitrary backend paths.
const ALLOWED_ROOTS = new Set([
  "team",
  "sponsors",
  "events",
  "certificate",
  "recruitment",
  "contact",
  "email",
  "ossomehacks",
]);

/**
 * Endpoints the backend guards with the read-only public key. Everything else
 * uses the admin (service) key. The two keys are not interchangeable, so the
 * method + path must match the backend's guard exactly.
 */
function usesPublicKey(path, method) {
  if (method !== "GET") return false;
  return (
    path === "team" ||
    /^team\/[^/]+$/.test(path) ||
    path === "sponsors" ||
    path === "events" ||
    /^events\/slug\/[^/]+$/.test(path) ||
    /^events\/[0-9a-fA-F]{24}$/.test(path) ||
    /^certificate\/(verify|download)\/.+/.test(path)
  );
}

export const config = {
  api: {
    bodyParser: true,
    responseLimit: false,
    externalResolver: true,
  },
};

/**
 * Same-origin proxy for the backend API.
 *
 * The backend now guards every route with an API key held in the server
 * environment. This route attaches the right key server-side — admin for writes
 * and admin reads, public for display reads — so no key ever reaches the
 * browser. All `API_ENDPOINTS` in utils/config.js point here.
 */
export default async function handler(req, res) {
  const { path = [], ...query } = req.query;
  const segments = Array.isArray(path) ? path : [path];

  if (segments.length === 0 || !ALLOWED_ROOTS.has(segments[0])) {
    return res.status(404).json({ success: false, message: "Unknown API path" });
  }

  const joined = segments.join("/");
  const key = usesPublicKey(joined, req.method)
    ? PUBLIC_KEY
    : process.env.SERVICE_API_KEY;

  if (!key) {
    return res
      .status(500)
      .json({ success: false, message: "Server configuration error" });
  }

  const qs = new URLSearchParams(query).toString();
  const target = `${BACKEND_API_BASE_URL}/api/${joined}${qs ? `?${qs}` : ""}`;

  const headers = {
    Accept: "application/json",
    Authorization: `Bearer ${key}`,
  };

  let body;
  if (req.method !== "GET" && req.method !== "HEAD") {
    headers["Content-Type"] = "application/json";
    body = JSON.stringify(req.body ?? {});
  }

  try {
    const upstream = await fetch(target, { method: req.method, headers, body });
    const contentType = upstream.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
      const payload = await upstream.json().catch(() => null);
      return res.status(upstream.status).json(payload ?? { success: upstream.ok });
    }

    const disposition = upstream.headers.get("content-disposition");
    const buffer = Buffer.from(await upstream.arrayBuffer());
    res.setHeader("Content-Type", contentType || "application/octet-stream");
    if (disposition) res.setHeader("Content-Disposition", disposition);
    return res.status(upstream.status).send(buffer);
  } catch (error) {
    console.error("Backend proxy error:", error);
    return res
      .status(502)
      .json({ success: false, message: "Failed to reach the backend" });
  }
}
