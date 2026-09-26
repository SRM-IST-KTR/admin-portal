import React, { useState, useEffect } from "react";
import axios from "axios";
import { X, User, Mail, Phone, Github, Globe, ExternalLink, Loader2, FileText, Video, Figma, Palette, File } from "lucide-react";
import { API_ENDPOINTS } from "@/utils/config";

const OnboardingSubmissionModal = ({ candidate, isOpen, onClose }) => {
  const [onboardingData, setOnboardingData] = useState(null);
  const [isFetchingOnboarding, setIsFetchingOnboarding] = useState(false);

  useEffect(() => {
    if (candidate && isOpen && candidate.email) {
      fetchOnboardingData(candidate.email);
    }
  }, [candidate, isOpen]);

  const fetchOnboardingData = async (email) => {
    if (!email) return;
    setIsFetchingOnboarding(true);
    try {
      const response = await axios.get(API_ENDPOINTS.RECRUITMENT.GET_TEAM_ONBOARDING(email));
      setOnboardingData(response.data.data || null);
    } catch (err) {
      setOnboardingData(null);
    } finally {
      setIsFetchingOnboarding(false);
    }
  };

  if (!isOpen || !candidate) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-[70] flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-zinc-900 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-zinc-200 dark:border-zinc-800 shadow-2xl">
        {/* Header */}
        <div className="p-5 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
          <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
            Onboarding Submission — {onboardingData?.name || candidate.name || "Candidate"}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4 text-xs">
          {isFetchingOnboarding ? (
            <div className="flex items-center gap-2 py-4">
              <Loader2 className="w-4 h-4 animate-spin text-zinc-500" />
              <span className="text-xs text-zinc-500">Loading onboarding data...</span>
            </div>
          ) : (
            <>
              {/* Personal Info */}
              <div>
                <span className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider block mb-2">
                  Personal Information
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <span className="font-medium text-zinc-600 dark:text-zinc-400">Name:</span>
                    <span className="text-zinc-900 dark:text-zinc-100 ml-1">{onboardingData?.name || candidate.name || "—"}</span>
                  </div>
                  <div>
                    <span className="font-medium text-zinc-600 dark:text-zinc-400">Email:</span>
                    <span className="text-zinc-900 dark:text-zinc-100 ml-1">{onboardingData?.email || candidate.email || "—"}</span>
                  </div>
                  <div>
                    <span className="font-medium text-zinc-600 dark:text-zinc-400">Phone:</span>
                    <span className="text-zinc-900 dark:text-zinc-100 ml-1">{onboardingData?.phoneno || candidate.phone || "—"}</span>
                  </div>
                  <div>
                    <span className="font-medium text-zinc-600 dark:text-zinc-400">Section:</span>
                    <span className="text-zinc-900 dark:text-zinc-100 ml-1">{onboardingData?.section || "—"}</span>
                  </div>
                  <div>
                    <span className="font-medium text-zinc-600 dark:text-zinc-400">Domain:</span>
                    <span className="text-zinc-900 dark:text-zinc-100 ml-1">{onboardingData?.domain || candidate.domain || "—"}</span>
                  </div>
                  <div>
                    <span className="font-medium text-zinc-600 dark:text-zinc-400">Subdomain:</span>
                    <span className="text-zinc-900 dark:text-zinc-100 ml-1">{onboardingData?.subdomain || "—"}</span>
                  </div>
                  <div>
                    <span className="font-medium text-zinc-600 dark:text-zinc-400">Position:</span>
                    <span className="text-zinc-900 dark:text-zinc-100 ml-1">{onboardingData?.position || "—"}</span>
                  </div>
                  <div>
                    <span className="font-medium text-zinc-600 dark:text-zinc-400">Joined Year:</span>
                    <span className="text-zinc-900 dark:text-zinc-100 ml-1">{onboardingData?.joined_yr || "—"}</span>
                  </div>
                </div>
              </div>

              {/* Caption */}
              {onboardingData?.caption && (
                <div>
                  <span className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider block mb-2">
                    Caption
                  </span>
                  <p className="text-zinc-900 dark:text-zinc-100">{onboardingData.caption}</p>
                </div>
              )}

              {/* Socials */}
              {onboardingData?.socials && onboardingData.socials.length > 0 && (
                <div>
                  <span className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider block mb-2">
                    Socials
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {onboardingData.socials.map((s, i) => (
                      <div key={i}>
                        {s?.github && (
                          <div>
                            <span className="font-medium text-zinc-600 dark:text-zinc-400">GitHub:</span>
                            <a href={s.github} target="_blank" rel="noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline ml-1">
                              {s.github}
                            </a>
                          </div>
                        )}
                        {s?.linkedin && (
                          <div>
                            <span className="font-medium text-zinc-600 dark:text-zinc-400">LinkedIn:</span>
                            <a href={s.linkedin} target="_blank" rel="noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline ml-1">
                              {s.linkedin}
                            </a>
                          </div>
                        )}
                        {s?.insta && (
                          <div>
                            <span className="font-medium text-zinc-600 dark:text-zinc-400">Instagram:</span>
                            <a href={s.insta} target="_blank" rel="noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline ml-1">
                              {s.insta}
                            </a>
                          </div>
                        )}
                        {s?.portfolio && (
                          <div>
                            <span className="font-medium text-zinc-600 dark:text-zinc-400">Portfolio:</span>
                            <a href={s.portfolio} target="_blank" rel="noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline ml-1">
                              {s.portfolio}
                            </a>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Family Details */}
              {onboardingData?.faDetails && onboardingData.faDetails.length > 0 && (
                <div>
                  <span className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider block mb-2">
                    Family / Guardian Details
                  </span>
                  <div className="space-y-2">
                    {onboardingData.faDetails.map((fa, i) => (
                      <div key={i} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <span className="font-medium text-zinc-600 dark:text-zinc-400">Name:</span>
                          <span className="text-zinc-900 dark:text-zinc-100 ml-1">{fa.faname || "—"}</span>
                        </div>
                        <div>
                          <span className="font-medium text-zinc-600 dark:text-zinc-400">Phone:</span>
                          <span className="text-zinc-900 dark:text-zinc-100 ml-1">{fa.faphonenumber || "—"}</span>
                        </div>
                        <div>
                          <span className="font-medium text-zinc-600 dark:text-zinc-400">Email:</span>
                          <span className="text-zinc-900 dark:text-zinc-100 ml-1">{fa.faemailid || "—"}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Task Submission Links */}
              {(candidate.links?.github || candidate.links?.demo || candidate.links?.deployment ||
                candidate.links?.figmaPlugins || candidate.links?.design || candidate.links?.designFiles ||
                candidate.links?.document || candidate.links?.introVideo) && (
                <div>
                  <span className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider block mb-2">
                    Task Submission Links — {candidate.domain}
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {candidate.links?.github && (
                      <a href={candidate.links.github} target="_blank" rel="noreferrer" className="text-xs text-zinc-700 dark:text-zinc-300 hover:underline flex items-center gap-1">
                        <Github className="w-3 h-3" />
                        <span>GitHub</span>
                      </a>
                    )}
                    {candidate.links?.demo && (
                      <a href={candidate.links.demo} target="_blank" rel="noreferrer" className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1">
                        <Globe className="w-3 h-3" />
                        <span>Demo</span>
                      </a>
                    )}
                    {candidate.links?.deployment && (
                      <a href={candidate.links.deployment} target="_blank" rel="noreferrer" className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1">
                        <ExternalLink className="w-3 h-3" />
                        <span>Deployment</span>
                      </a>
                    )}
                    {candidate.links?.figmaPlugins && (
                      <a href={candidate.links.figmaPlugins} target="_blank" rel="noreferrer" className="text-xs text-orange-600 dark:text-orange-400 hover:underline flex items-center gap-1">
                        <Figma className="w-3 h-3" />
                        <span>Figma Plugins</span>
                      </a>
                    )}
                    {candidate.links?.design && (
                      <a href={candidate.links.design} target="_blank" rel="noreferrer" className="text-xs text-pink-600 dark:text-pink-400 hover:underline flex items-center gap-1">
                        <Palette className="w-3 h-3" />
                        <span>Design</span>
                      </a>
                    )}
                    {candidate.links?.designFiles && (
                      <a href={candidate.links.designFiles} target="_blank" rel="noreferrer" className="text-xs text-violet-600 dark:text-violet-400 hover:underline flex items-center gap-1">
                        <File className="w-3 h-3" />
                        <span>Design Files</span>
                      </a>
                    )}
                    {candidate.links?.document && (
                      <a href={candidate.links.document} target="_blank" rel="noreferrer" className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1">
                        <FileText className="w-3 h-3" />
                        <span>Document</span>
                      </a>
                    )}
                    {candidate.links?.introVideo && (
                      <a href={candidate.links.introVideo} target="_blank" rel="noreferrer" className="text-xs text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1">
                        <Video className="w-3 h-3" />
                        <span>Intro Video</span>
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* Documents */}
              <div>
                <span className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider block mb-2">
                  Submitted Documents
                </span>
                <div className="flex flex-col gap-2">
                  {onboardingData?.pictureUrl && (
                    <a
                      href={onboardingData.pictureUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2 text-xs text-zinc-700 dark:text-zinc-300 hover:underline"
                    >
                      <User className="w-3.5 h-3.5" />
                      <span>Profile Picture (PFP)</span>
                      <ExternalLink className="w-3 h-3 ml-auto" />
                    </a>
                  )}
                  {onboardingData?.ndaUrl && (
                    <a
                      href={onboardingData.ndaUrl}
                      target="_blank"
                      rel="noreferrer"
                      download
                      className="flex items-center gap-2 text-xs text-zinc-700 dark:text-zinc-300 hover:underline"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Signed NDA (PDF)</span>
                      <ExternalLink className="w-3 h-3 ml-auto" />
                    </a>
                  )}
                  {!onboardingData?.pictureUrl && !onboardingData?.ndaUrl && (
                    <p className="text-xs text-zinc-500">No onboarding documents found.</p>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-zinc-100 dark:border-zinc-800 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer text-xs font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingSubmissionModal;
