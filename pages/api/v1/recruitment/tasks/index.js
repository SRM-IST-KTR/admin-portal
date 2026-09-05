import mongoose from "mongoose";
import DB from "@/utils/db";

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    guidelines: { type: String, required: true, trim: true },
    link: { type: String, default: null, trim: true },
    domain: { type: String, enum: ["Technical", "Creatives", "Corporate"], required: true },
    subdomain: { type: String, required: false, trim: true },
    taskType: { type: String, required: true, trim: true },
    year: { type: String, enum: ["1", "2", "both"], required: true },
    deadline: { type: Date, required: false, default: null },
    steps: { type: [String], default: [] },
    requirements: { type: [String], default: [] },
    datasets: { type: [String], default: [] },
    evaluation: { type: String, default: null },
    outputs: { type: [String], default: [] },
    techStack: { type: [String], default: [] },
    tags: { type: [String], default: [] },
    submissionForm: { type: String, default: null },
    submissionInstructions: { type: String, default: null },
  },
  { timestamps: true }
);

taskSchema.index({ domain: 1, year: 1 });
taskSchema.index({ domain: 1, subdomain: 1 });

const getTaskModel = (connection) => {
  return connection.models.tasks26 || connection.model("tasks26", taskSchema, "tasks26");
};

const normalizeYear = (year) => {
  if (year === undefined || year === null) return null;
  const value = String(year).toLowerCase().trim();
  if (["1", "1st", "1st year", "first", "first year"].includes(value)) return "1";
  if (["2", "2nd", "2nd year", "second", "second year"].includes(value)) return "2";
  if (value === "both") return "both";
  return null;
};

const cleanString = (value) => {
  if (value === undefined || value === null) return value;
  return String(value).trim().replace(/^\s*"+|"+\s*$/g, "");
};

const cleanArray = (value) => {
  if (!Array.isArray(value)) return [];
  return value.map((item) => cleanString(item)).filter((item) => item !== "");
};

export default async function handler(req, res) {
  try {
    const { db: recruitmentConn } = await DB.DBRecruitment();
    const Task = getTaskModel(recruitmentConn);

    switch (req.method) {
      case "GET": {
        const { domain, year, taskType, search } = req.query;
        const query = {};

        if (domain && domain !== "all") {
          query.domain = new RegExp(`^${domain}$`, "i");
        }
        if (year && year !== "all") {
          const normY = normalizeYear(year);
          if (normY) {
            query.year = { $in: [normY, "both"] };
          }
        }
        if (taskType && taskType !== "all") {
          query.taskType = new RegExp(`^${taskType}$`, "i");
        }
        if (search && search.trim() !== "") {
          const q = search.trim();
          query.$or = [
            { title: new RegExp(q, "i") },
            { description: new RegExp(q, "i") },
            { taskType: new RegExp(q, "i") },
          ];
        }

        const tasks = await Task.find(query).sort({ createdAt: -1 });
        return res.status(200).json({
          success: true,
          count: tasks.length,
          data: tasks,
        });
      }

      case "POST": {
        const {
          title,
          description,
          guidelines,
          link,
          domain,
          subdomain,
          taskType,
          year,
          deadline,
          steps,
          requirements,
          datasets,
          evaluation,
          outputs,
          techStack,
          tags,
          submissionForm,
          submissionInstructions,
        } = req.body;

        const missingFields = [];
        if (!title?.trim()) missingFields.push("title");
        if (!description?.trim()) missingFields.push("description");
        if (!guidelines?.trim()) missingFields.push("guidelines");
        if (!domain) missingFields.push("domain");
        if (!taskType?.trim()) missingFields.push("taskType");
        if (!year) missingFields.push("year");

        if (missingFields.length > 0) {
          return res.status(400).json({
            success: false,
            error: "Missing required fields",
            missingFields,
          });
        }

        const allowedDomains = ["Technical", "Creatives", "Corporate"];
        if (!allowedDomains.includes(domain)) {
          return res.status(400).json({
            success: false,
            error: "Invalid domain",
            allowedDomains,
          });
        }

        const normalizedYear = normalizeYear(year);
        if (!normalizedYear) {
          return res.status(400).json({
            success: false,
            error: "Invalid year",
            message: "Year must be 1, 2, or both",
          });
        }

        let normalizedDeadline = null;
        if (deadline) {
          const parsedDeadline = new Date(deadline);
          if (isNaN(parsedDeadline.getTime())) {
            return res.status(400).json({
              success: false,
              error: "Invalid deadline",
              message: "deadline must be a valid date",
            });
          }
          normalizedDeadline = parsedDeadline;
        }

        const taskData = {
          title: cleanString(title),
          description: cleanString(description),
          guidelines: cleanString(guidelines),
          link: link ? cleanString(link) : null,
          domain: cleanString(domain),
          subdomain: subdomain ? cleanString(subdomain) : null,
          taskType: cleanString(taskType),
          year: normalizedYear,
          deadline: normalizedDeadline,
          steps: cleanArray(steps),
          requirements: cleanArray(requirements),
          datasets: cleanArray(datasets),
          evaluation: evaluation ? cleanString(evaluation) : null,
          outputs: cleanArray(outputs),
          techStack: cleanArray(techStack),
          tags: cleanArray(tags),
          submissionForm: submissionForm ? cleanString(submissionForm) : null,
          submissionInstructions: submissionInstructions ? cleanString(submissionInstructions) : null,
        };

        const task = await Task.create(taskData);

        return res.status(201).json({
          success: true,
          message: "Task added successfully",
          data: task,
        });
      }

      default:
        res.setHeader("Allow", ["GET", "POST"]);
        return res.status(405).json({
          success: false,
          error: `Method ${req.method} Not Allowed`,
        });
    }
  } catch (error) {
    console.error("Tasks API Error:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Internal Server Error",
    });
  }
}
