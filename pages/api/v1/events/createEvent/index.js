import dotenv from "dotenv";
dotenv.config();
import DBInstance from "@/utils/db";
import Event from "@/utils/models/event.models";

export default async function handler(req, res) {
    if (req.method === "POST") {
        const {
            slug,
            rsvpLimit,
            event_name,
            event_description,
            speakers_details,
            event_date,
            is_active,
            venue,
            sponsors_details,
            duration,
            prerequisites,
            certificateLink,
            cost,
            poster_url,
            registration_url,
            gallery,
            database,
            certificate,
            jimp_config,
            teamEvent,
            teamSize,
        } = req.body;

        try {
            // Validate required fields
            if (!certificateLink || !certificate?.organizers || !certificate?.participants || !certificate?.volunteers) {
                return res.status(400).json({
                    message: "Missing required fields",
                    errors: {
                        certificateLink: !certificateLink ? "Certificate link is required" : null,
                        certificate: {
                            organizers: !certificate?.organizers ? "Organizer certificate URL is required" : null,
                            participants: !certificate?.participants ? "Participant certificate URL is required" : null,
                            volunteers: !certificate?.volunteers ? "Volunteer certificate URL is required" : null,
                        }
                    }
                });
            }

            // Connect to MongoDB
            await DBInstance();

            // Create new event document
            const newEvent = new Event({
                slug,
                rsvpLimit,
                event_name,
                event_description,
                speakers_details: speakers_details || [],
                event_date,
                is_active,
                venue,
                sponsors_details: sponsors_details || [],
                duration,
                prerequisites: prerequisites || [],
                certificateLink,
                cost,
                poster_url,
                registration_url,
                gallery: gallery || [],
                database,
                collection: {
                    participants: "participants",
                    organizers: "organizers",
                    volunteers: "volunteers"
                },
                certificate,
                jimp_config: jimp_config || {
                    yOffset: "",
                    color: "",
                    font_size: ""
                },
                teamEvent,
                teamSize,
            });

            // Save the event to MongoDB
            const savedEvent = await newEvent.save();

            // Respond with success message and saved event data
            res.status(201).json({
                message: "Event created successfully!",
                event: savedEvent
            });
        } catch (error) {
            console.error("Error creating event:", error);
            res.status(500).json({
                message: "Error creating event. Please try again.",
                error: error.message
            });
        }
    } else {
        res.status(405).json({ message: "Method Not Allowed" });
    }
}
