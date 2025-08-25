import DBInstance from "@/utils/db";
import DB from "@/utils/db"
import LoginLog from "@/utils/models/loginLog.model";
import { withAuth } from "@/utils/auth";

async function handler(req, res) {
    if (req.method !== "GET") {
        return res.status(405).json({ success: false, error: "Method not allowed" });
    }

    try {
        await DB.DBInstance();

        // Extract query parameters for filtering and pagination
        const { page = 1, limit = 10, status, role, startDate, endDate } = req.query;

        // Parse page and limit as integers
        const pageInt = parseInt(page, 10);
        const limitInt = parseInt(limit, 10);

        // Build query based on filters
        const query = {};

        if (status && status !== 'all') {
            query.status = status;
        }

        if (role && role !== 'all') {
            query.role = role;
        }

        if (startDate) {
            query.createdAt = { ...query.createdAt, $gte: new Date(startDate) };
        }

        if (endDate) {
            query.createdAt = { ...query.createdAt, $lte: new Date(endDate) };
        }

        // Count total logs matching the query
        const totalLogs = await LoginLog.countDocuments(query);

        // Calculate total pages
        const totalPages = Math.ceil(totalLogs / limitInt);

        // Fetch logs with pagination and sorting
        const logs = await LoginLog.find(query)
            .sort({ createdAt: -1 }) // Sort by newest first
            .skip((pageInt - 1) * limitInt)
            .limit(limitInt)
            .populate('user', 'name email'); // Populate user details if available

        return res.status(200).json({
            success: true,
            data: {
                logs,
                totalPages,
                totalLogs,
                currentPage: pageInt,
                limit: limitInt,
            },
        });
    } catch (error) {
        console.error("Error fetching login logs:", error);
        return res.status(500).json({
            success: false,
            error: "Failed to fetch login logs",
        });
    }
}

// Protect this route for admin users only
export default withAuth(handler); 