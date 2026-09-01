import ParticipantUser from "@/utils/models/recruitment.model";
import DB from "@/utils/db";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ success: false, error: `Method ${req.method} Not Allowed` });
  }

  try {
    await DB.DBRecruitment();

    const allCandidates = await ParticipantUser.find({}).lean();
    const total = allCandidates.length;

    // Domains
    const domainCounts = { Technical: 0, Creatives: 0, Corporate: 0, Other: 0 };
    // Years
    const yearCounts = { firstYear: 0, secondYear: 0, other: 0 };
    // Statuses
    const statusCounts = {
      registered: 0,
      task_assigned: 0,
      taskSubmitted: 0,
      interviewShortlisted: 0,
      onboarding: 0,
      underReview: 0,
      rejected: 0,
      other: 0,
    };
    // Year x Domain matrix
    const yearDomainMatrix = {
      Technical: { firstYear: 0, secondYear: 0, other: 0 },
      Creatives: { firstYear: 0, secondYear: 0, other: 0 },
      Corporate: { firstYear: 0, secondYear: 0, other: 0 },
    };
    // Domain x Status matrix
    const domainStatusMatrix = {
      Technical: { registered: 0, task_assigned: 0, taskSubmitted: 0, interviewShortlisted: 0, onboarding: 0, underReview: 0, rejected: 0 },
      Creatives: { registered: 0, task_assigned: 0, taskSubmitted: 0, interviewShortlisted: 0, onboarding: 0, underReview: 0, rejected: 0 },
      Corporate: { registered: 0, task_assigned: 0, taskSubmitted: 0, interviewShortlisted: 0, onboarding: 0, underReview: 0, rejected: 0 },
    };
    // Links health
    const linksStats = {
      hasGithub: 0,
      hasDemo: 0,
      hasDeployment: 0,
      hasFigmaPlugins: 0,
      hasDesign: 0,
      hasDesignFiles: 0,
      hasDocument: 0,
      hasIntroVideo: 0,
      hasAnyLink: 0,
      hasAllLinks: 0,
    };
    // Branch analysis
    const branchCounts = {};

    allCandidates.forEach((candidate) => {
      // Normalize domain
      let d = candidate.domain || "Other";
      if (/technical/i.test(d)) d = "Technical";
      else if (/creative/i.test(d)) d = "Creatives";
      else if (/corporate/i.test(d)) d = "Corporate";
      else d = "Other";

      if (domainCounts[d] !== undefined) domainCounts[d]++;
      else domainCounts.Other++;

      // Normalize year
      const yStr = String(candidate.year || "").toLowerCase();
      let yKey = "other";
      if (yStr.includes("1") || yStr.includes("1st")) {
        yKey = "firstYear";
        yearCounts.firstYear++;
      } else if (yStr.includes("2") || yStr.includes("2nd")) {
        yKey = "secondYear";
        yearCounts.secondYear++;
      } else {
        yearCounts.other++;
      }

      // Normalize status
      let s = candidate.status || "registered";
      if (s === "interviewShortlist") s = "interviewShortlisted";
      if (statusCounts[s] !== undefined) {
        statusCounts[s]++;
      } else {
        statusCounts.other++;
      }

      // Year x Domain
      if (yearDomainMatrix[d]) {
        yearDomainMatrix[d][yKey] = (yearDomainMatrix[d][yKey] || 0) + 1;
      }

      // Domain x Status
      if (domainStatusMatrix[d] && domainStatusMatrix[d][s] !== undefined) {
        domainStatusMatrix[d][s]++;
      }

      // Links (domain-specific submission fields)
      const getLink = (key) => Boolean(candidate.links?.[key] && String(candidate.links[key]).trim() !== "");
      const github = getLink("github");
      const demo = getLink("demo");
      const deployment = getLink("deployment");
      const figmaPlugins = getLink("figmaPlugins");
      const design = getLink("design");
      const designFiles = getLink("designFiles");
      const document = getLink("document");
      const introVideo = getLink("introVideo");

      if (github) linksStats.hasGithub++;
      if (demo) linksStats.hasDemo++;
      if (deployment) linksStats.hasDeployment++;
      if (figmaPlugins) linksStats.hasFigmaPlugins++;
      if (design) linksStats.hasDesign++;
      if (designFiles) linksStats.hasDesignFiles++;
      if (document) linksStats.hasDocument++;
      if (introVideo) linksStats.hasIntroVideo++;
      if (github || demo || deployment || figmaPlugins || design || designFiles || document || introVideo) linksStats.hasAnyLink++;
      if (github && demo && deployment && figmaPlugins && design && designFiles && document && introVideo) linksStats.hasAllLinks++;

      // Branch
      const branch = (candidate.degreeWithBranch || "Unknown").trim();
      branchCounts[branch] = (branchCounts[branch] || 0) + 1;
    });

    // Sort branches top 10
    const topBranches = Object.entries(branchCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([branch, count]) => ({ branch, count }));

    // Conversion Funnel Rates
    const funnel = {
      registered: total,
      taskAssigned: statusCounts.task_assigned + statusCounts.taskSubmitted + statusCounts.interviewShortlisted + statusCounts.onboarding,
      taskSubmitted: statusCounts.taskSubmitted + statusCounts.interviewShortlisted + statusCounts.onboarding,
      interviewShortlisted: statusCounts.interviewShortlisted + statusCounts.onboarding,
      onboarded: statusCounts.onboarding,
      rejected: statusCounts.rejected,
      taskAssignmentRate: total > 0 ? (((statusCounts.task_assigned + statusCounts.taskSubmitted + statusCounts.interviewShortlisted + statusCounts.onboarding) / total) * 100).toFixed(1) : 0,
      taskConversionRate: total > 0 ? (((statusCounts.taskSubmitted + statusCounts.interviewShortlisted + statusCounts.onboarding) / total) * 100).toFixed(1) : 0,
      interviewConversionRate: total > 0 ? (((statusCounts.interviewShortlisted + statusCounts.onboarding) / total) * 100).toFixed(1) : 0,
      onboardingRate: total > 0 ? ((statusCounts.onboarding / total) * 100).toFixed(1) : 0,
    };

    return res.status(200).json({
      success: true,
      data: {
        total,
        domainCounts,
        yearCounts,
        statusCounts,
        yearDomainMatrix,
        domainStatusMatrix,
        linksStats,
        topBranches,
        funnel,
      },
    });
  } catch (error) {
    console.error("Recruitment Analytics API Error:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Internal Server Error",
    });
  }
}
