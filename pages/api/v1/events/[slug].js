import Event from "@/utils/models/event.models";
import DBInstance from "@/utils/db";
DBInstance();

export default async function handler(req, res) {
  const { slug } = req.query;

  if (req.method === "GET") {
    try {
      const event = await Event.findOne({ slug });

      if (!event) {
        return res
          .status(404)
          .json({ success: false, error: "Event not found" });
      }

      res.status(200).json({ success: true, data: event });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: "Internal Server Error" });
    }
  } else {
    res.status(405).json({ success: false, error: "Method Not Allowed" });
  }
}
