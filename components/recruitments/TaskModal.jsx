import React, { useState } from "react";
import { API_ENDPOINTS } from "@/utils/config";
import {
  X,
  FileText,
  Calendar,
  Layers,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Link as LinkIcon,
  ListOrdered,
  Tag,
  Cpu,
  Trash2,
  Target,
} from "lucide-react";

const TaskModal = ({ isOpen, onClose, onTaskAdded }) => {
  const [formData, setFormData] = useState({
    title: "",
    goal: "",
    description: "",
    guidelines: "",
    link: "",
    domain: "Technical",
    subdomain: "",
    taskType: "",
    year: "1st",
    deadline: "",
    steps: [""],
    requirements: [""],
    datasets: [""],
    evaluation: "",
    outputs: [""],
    techStack: [""],
    tags: [""],
    submissionForm: "",
    submissionInstructions: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleArrayChange = (index, value, field) => {
    setFormData((prev) => {
      const arr = [...prev[field]];
      arr[index] = value;
      return { ...prev, [field]: arr };
    });
  };

  const addArrayItem = (field) => {
    setFormData((prev) => ({ ...prev, [field]: [...prev[field], ""] }));
  };

  const removeArrayItem = (index, field) => {
    setFormData((prev) => {
      const arr = prev[field].filter((_, i) => i !== index);
      return { ...prev, [field]: arr.length ? arr : [""] };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const cleanPayload = {
        ...formData,
        steps: formData.steps.filter((s) => s.trim() !== ""),
        requirements: formData.requirements.filter((s) => s.trim() !== ""),
        datasets: formData.datasets.filter((s) => s.trim() !== ""),
        outputs: formData.outputs.filter((s) => s.trim() !== ""),
        techStack: formData.techStack.filter((s) => s.trim() !== ""),
        tags: formData.tags.filter((s) => s.trim() !== ""),
        deadline: formData.deadline ? new Date(formData.deadline).toISOString() : null,
      };

      const res = await fetch(API_ENDPOINTS.RECRUITMENT.TASKS, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cleanPayload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || data.message || "Failed to add task");
      }

      if (onTaskAdded) onTaskAdded(data.data);
      onClose();
    } catch (err) {
      console.error("Error adding task:", err);
      setError(err.message || "Failed to add task to database");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/50 flex items-center justify-center text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                Set Recruitment Task for Drive
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Insert a new task directly into the tasks26 MongoDB collection
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {error && (
            <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs flex items-center gap-3">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Basic Info Section */}
          <div className="space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 font-mono">
              Core Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                  Task Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. Company Outreach for Sponsorships"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5 text-zinc-400" />
                  Task Goal <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="goal"
                  required
                  value={formData.goal}
                  onChange={handleChange}
                  placeholder="e.g. Identify and reach out to potential sponsors for the upcoming tech drive"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                  Domain <span className="text-red-500">*</span>
                </label>
                <select
                  name="domain"
                  required
                  value={formData.domain}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Technical">Technical</option>
                  <option value="Creatives">Creatives</option>
                  <option value="Corporate">Corporate</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                  Task Type <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="taskType"
                  required
                  value={formData.taskType}
                  onChange={handleChange}
                  placeholder="e.g. Sponsorship & Partnerships, WebDev, Video"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                  Target Year <span className="text-red-500">*</span>
                </label>
                <select
                  name="year"
                  required
                  value={formData.year}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="1st">1st Year ("1")</option>
                  <option value="2nd">2nd Year ("2")</option>
                  <option value="both">Both Years ("both")</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                  Subdomain (Optional)
                </label>
                <input
                  type="text"
                  name="subdomain"
                  value={formData.subdomain}
                  onChange={handleChange}
                  placeholder="e.g. Web, App, GFX, PR"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                  Reference Link (Optional)
                </label>
                <input
                  type="url"
                  name="link"
                  value={formData.link}
                  onChange={handleChange}
                  placeholder="https://example.com/task-reference"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                  Deadline (Optional)
                </label>
                <input
                  type="datetime-local"
                  name="deadline"
                  value={formData.deadline}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="description"
                  required
                  rows={3}
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Detailed overview of what the candidate needs to accomplish..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                  Guidelines <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="guidelines"
                  required
                  rows={3}
                  value={formData.guidelines}
                  onChange={handleChange}
                  placeholder="Key rules, expectations, and instructions for candidates..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Arrays Section: Steps, Requirements, Datasets, TechStack, Outputs, Tags */}
          <div className="space-y-6 pt-4 border-t border-zinc-200 dark:border-zinc-800">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 font-mono">
              Task Specifications & Arrays
            </h3>

            {/* Steps */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                  <ListOrdered className="w-3.5 h-3.5 text-zinc-400" />
                  Steps / Action Items
                </label>
                <button
                  type="button"
                  onClick={() => addArrayItem("steps")}
                  className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                >
                  + Add Step
                </button>
              </div>
              {formData.steps.map((step, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={step}
                    onChange={(e) => handleArrayChange(idx, e.target.value, "steps")}
                    placeholder={`Step ${idx + 1}`}
                    className="flex-1 px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => removeArrayItem(idx, "steps")}
                    className="p-2 rounded-xl text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/50 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Requirements */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-zinc-400" />
                  Requirements
                </label>
                <button
                  type="button"
                  onClick={() => addArrayItem("requirements")}
                  className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                >
                  + Add Requirement
                </button>
              </div>
              {formData.requirements.map((req, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={req}
                    onChange={(e) => handleArrayChange(idx, e.target.value, "requirements")}
                    placeholder={`Requirement ${idx + 1}`}
                    className="flex-1 px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => removeArrayItem(idx, "requirements")}
                    className="p-2 rounded-xl text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/50 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Tech Stack & Tags */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                    <Cpu className="w-3.5 h-3.5 text-zinc-400" />
                    Tech Stack
                  </label>
                  <button
                    type="button"
                    onClick={() => addArrayItem("techStack")}
                    className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                  >
                    + Add Tech
                  </button>
                </div>
                {formData.techStack.map((tech, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={tech}
                      onChange={(e) => handleArrayChange(idx, e.target.value, "techStack")}
                      placeholder="e.g. React.js, Tailwind, Node.js"
                      className="flex-1 px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => removeArrayItem(idx, "techStack")}
                      className="p-2 rounded-xl text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/50 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-zinc-400" />
                    Tags
                  </label>
                  <button
                    type="button"
                    onClick={() => addArrayItem("tags")}
                    className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                  >
                    + Add Tag
                  </button>
                </div>
                {formData.tags.map((tag, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={tag}
                      onChange={(e) => handleArrayChange(idx, e.target.value, "tags")}
                      placeholder="e.g. sponsorship, webdev, mandatory"
                      className="flex-1 px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => removeArrayItem(idx, "tags")}
                      className="p-2 rounded-xl text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/50 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Evaluation & Submission Info */}
            <div className="space-y-4 pt-2">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                  Evaluation Criteria
                </label>
                <textarea
                  name="evaluation"
                  rows={2}
                  value={formData.evaluation}
                  onChange={handleChange}
                  placeholder="How will this task be evaluated..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                    Submission Form URL
                  </label>
                  <input
                    type="url"
                    name="submissionForm"
                    value={formData.submissionForm}
                    onChange={handleChange}
                    placeholder="https://forms.gle/..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                    Submission Instructions
                  </label>
                  <input
                    type="text"
                    name="submissionInstructions"
                    value={formData.submissionInstructions}
                    onChange={handleChange}
                    placeholder="e.g. Upload repository link & deployment URL"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-6 border-t border-zinc-200 dark:border-zinc-800">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 font-medium text-xs hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 rounded-xl bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 font-medium text-xs hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all shadow-sm flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading && <div className="w-3.5 h-3.5 border-2 border-white dark:border-zinc-900 border-t-transparent rounded-full animate-spin" />}
              <span>{loading ? "Adding Task..." : "Save & Insert Task"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;
