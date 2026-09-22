const BACKEND_API_BASE_URL =
  process.env.BACKEND_API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "http://localhost:8000";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  if (!process.env.SERVICE_API_KEY) {
    return res.status(500).json({
      success: false,
      message: "Email service is not configured",
    });
  }

  try {
    const response = await fetch(`${BACKEND_API_BASE_URL.replace(/\/$/, "")}/api/email/send`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.SERVICE_API_KEY}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(req.body),
    });

    const data = await response.json();
    return res.status(response.status).json(data);
  } catch (error) {
    console.error("Email proxy error:", error);
    return res.status(502).json({
      success: false,
      message: "Unable to reach the email service",
    });
  }
}