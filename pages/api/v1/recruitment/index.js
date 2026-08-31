import ParticipantUser from "@/utils/models/recruitment.model";
import DB from "@/utils/db";

export default async function handler(req, res) {
  try {
    await DB.DBRecruitment();

    switch (req.method) {
      case "GET": {
        const { domain, status, year, search, sort = "-createdAt", limit, skip } = req.query;

        const query = {};

        if (domain && domain !== "all") {
          query.domain = new RegExp(`^${domain}$`, "i");
        }

        if (status && status !== "all") {
          if (status === "interviewShortlisted") {
            query.status = { $in: ["interviewShortlisted", "interviewShortlist"] };
          } else {
            query.status = status;
          }
        }

        if (year && year !== "all") {
          // Match 1st or 2nd regardless of format
          if (year === "1st" || year === "1" || year === "1st Year") {
            query.year = { $regex: /1|1st/i };
          } else if (year === "2nd" || year === "2" || year === "2nd Year") {
            query.year = { $regex: /2|2nd/i };
          } else {
            query.year = new RegExp(year, "i");
          }
        }

        if (search && search.trim() !== "") {
          const searchRegex = new RegExp(search.trim(), "i");
          query.$or = [
            { name: searchRegex },
            { email: searchRegex },
            { registrationNumber: searchRegex },
            { phone: searchRegex },
            { degreeWithBranch: searchRegex },
            { domain: searchRegex },
          ];
        }

        let dbQuery = ParticipantUser.find(query);

        if (sort) {
          dbQuery = dbQuery.sort(sort);
        }

        if (skip && !isNaN(Number(skip))) {
          dbQuery = dbQuery.skip(Number(skip));
        }

        if (limit && !isNaN(Number(limit))) {
          dbQuery = dbQuery.limit(Number(limit));
        }

        const data = await dbQuery.exec();
        const total = await ParticipantUser.countDocuments(query);

        return res.status(200).json({
          success: true,
          total,
          count: data.length,
          data,
        });
      }

      case "POST": {
        const {
          name,
          email,
          registrationNumber,
          phone,
          year,
          domain,
          degreeWithBranch,
          links,
          status = "registered",
          notes,
          review,
        } = req.body;

        if (!name || !email || !registrationNumber || !phone || !year || !domain || !degreeWithBranch) {
          return res.status(400).json({
            success: false,
            error: "Missing required fields: name, email, registrationNumber, phone, year, domain, degreeWithBranch",
          });
        }

        // Check if candidate already exists
        const existing = await ParticipantUser.findOne({
          $or: [
            { email: email.toLowerCase().trim() },
            { registrationNumber: registrationNumber.toUpperCase().trim() },
          ],
        });

        if (existing) {
          return res.status(409).json({
            success: false,
            error: "A candidate with this email or registration number already exists.",
          });
        }

        const newCandidate = await ParticipantUser.create({
          name: name.trim(),
          email: email.toLowerCase().trim(),
          registrationNumber: registrationNumber.trim(),
          phone: phone.trim(),
          year: year.trim(),
          domain: domain.trim(),
          degreeWithBranch: degreeWithBranch.trim(),
          links: links || { github: null, demo: null, deployment: null },
          status,
          notes: notes || "",
          review: review || {},
        });

        return res.status(201).json({
          success: true,
          message: "Candidate created successfully",
          data: newCandidate,
        });
      }

      case "PUT":
      case "PATCH": {
        const { id, _id, email, ...updateData } = req.body;
        const targetId = id || _id;

        let candidate;
        if (targetId) {
          candidate = await ParticipantUser.findByIdAndUpdate(targetId, updateData, {
            new: true,
            runValidators: true,
          });
        } else if (email) {
          candidate = await ParticipantUser.findOneAndUpdate(
            { email: email.toLowerCase().trim() },
            updateData,
            { new: true, runValidators: true }
          );
        } else {
          return res.status(400).json({
            success: false,
            error: "Must provide candidate id or email to update.",
          });
        }

        if (!candidate) {
          return res.status(404).json({
            success: false,
            error: "Candidate not found",
          });
        }

        return res.status(200).json({
          success: true,
          message: "Candidate updated successfully",
          data: candidate,
        });
      }

      case "DELETE": {
        const { id, _id, email } = req.body || req.query;
        const targetId = id || _id || req.query.id;

        let deleted;
        if (targetId) {
          deleted = await ParticipantUser.findByIdAndDelete(targetId);
        } else if (email || req.query.email) {
          const targetEmail = (email || req.query.email).toLowerCase().trim();
          deleted = await ParticipantUser.findOneAndDelete({ email: targetEmail });
        } else {
          return res.status(400).json({
            success: false,
            error: "Must provide candidate id or email to delete.",
          });
        }

        if (!deleted) {
          return res.status(404).json({
            success: false,
            error: "Candidate not found to delete.",
          });
        }

        return res.status(200).json({
          success: true,
          message: "Candidate deleted successfully",
          data: deleted,
        });
      }

      default:
        res.setHeader("Allow", ["GET", "POST", "PUT", "PATCH", "DELETE"]);
        return res.status(405).json({
          success: false,
          error: `Method ${req.method} Not Allowed`,
        });
    }
  } catch (error) {
    console.error("Recruitment API Error:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Internal Server Error",
    });
  }
}
