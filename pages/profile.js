import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/contexts/AuthContext";
import axios from "axios";
import Head from "next/head";
import { Calendar, Users, Briefcase, Mail, Shield, Globe, Link as LinkIcon } from "lucide-react";

export default function Profile() {
    const { user: authUser, isAdmin } = useAuth();
    const router = useRouter();
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!authUser) {
            router.push("/");
            return;
        }

        const fetchProfileData = async () => {
            try {
                const response = await axios.get(`/api/v1/teams/getByName?name=${encodeURIComponent(authUser.name)}`);
                if (response.data.success) {
                    setProfileData(response.data.data);
                } else {
                    setError(response.data.message || "Failed to fetch profile data");
                }
            } catch (err) {
                setError(err.response?.data?.message || "Failed to fetch profile data");
                console.error("Error fetching profile data:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchProfileData();
    }, [authUser, router]);

    if (!authUser) {
        return null;
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl mx-auto">
                    <div className="animate-pulse">
                        <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
                        <div className="h-64 bg-gray-200 rounded mb-4"></div>
                        <div className="space-y-3">
                            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl mx-auto">
                    <div className="bg-red-50 border border-red-200 rounded-md p-4">
                        <p className="text-red-700">{error}</p>
                    </div>
                </div>
            </div>
        );
    }

    const { user, team } = profileData || {};

    const getRoleBadgeColor = (role) => {
        switch (role) {
            case "admin":
                return "bg-purple-100 text-purple-800";
            case "manager":
                return "bg-blue-100 text-blue-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    const getDomainBadgeColor = (domain) => {
        switch (domain) {
            case "Technical":
                return "bg-blue-100 text-blue-800";
            case "Creative":
            case "Creatives":
                return "bg-green-100 text-green-800";
            case "Corporate":
                return "bg-yellow-100 text-yellow-800";
            case "President":
            case "Vice President":
                return "bg-purple-100 text-purple-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    return (
        <>
            <Head>
                <title>Profile - {user?.name || "User"}</title>
            </Head>
            <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl mx-auto">
                    <div className="bg-white shadow rounded-lg overflow-hidden">
                        {/* Profile Header */}
                        <div className="px-4 py-5 sm:px-6 bg-gradient-to-r from-blue-600 to-indigo-600">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <img
                                        className="h-20 w-20 rounded-full border-4 border-white object-cover"
                                        src={team?.pictureUrl || "/default-avatar.png"}
                                        alt={user?.name}
                                    />
                                </div>
                                <div className="ml-4">
                                    <h3 className="text-xl font-bold text-white">{user?.name}</h3>
                                    <p className="text-blue-100">
                                        <span className="flex items-center mt-1">
                                            <Mail className="w-4 h-4 mr-1" />
                                            {user?.email}
                                        </span>
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Profile Content */}
                        <div className="border-t border-gray-200 p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Account Information */}
                                <div className="bg-gray-50 p-4 rounded-lg col-span-full">
                                    <h2 className="text-lg font-semibold mb-4 text-gray-800 flex items-center">
                                        <Shield className="w-5 h-5 mr-2 text-gray-500" />
                                        Account Information
                                    </h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-sm text-gray-500 mb-1">Role</p>
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleBadgeColor(user?.role)}`}>
                                                {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1) || "Member"}
                                            </span>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500 mb-1">Status</p>
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user?.isApproved ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>
                                                {user?.isApproved ? "Approved" : "Pending Approval"}
                                            </span>
                                        </div>
                                        {user?.createdAt && (
                                            <div>
                                                <p className="text-sm text-gray-500 mb-1">Member Since</p>
                                                <p className="text-sm text-gray-700">
                                                    {new Date(user.createdAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                        )}
                                        {user?.lastLogin && (
                                            <div>
                                                <p className="text-sm text-gray-500 mb-1">Last Login</p>
                                                <p className="text-sm text-gray-700">
                                                    {new Date(user.lastLogin).toLocaleDateString()}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Team Information */}
                                {team && (
                                    <div className="bg-gray-50 p-4 rounded-lg col-span-full">
                                        <h2 className="text-lg font-semibold mb-4 text-gray-800 flex items-center">
                                            <Users className="w-5 h-5 mr-2 text-gray-500" />
                                            Team Information
                                        </h2>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-sm text-gray-500 mb-1">Position</p>
                                                <p className="text-sm font-medium text-gray-800">{team.position}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500 mb-1">Domain</p>
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getDomainBadgeColor(team.domain)}`}>
                                                    {team.domain}
                                                </span>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500 mb-1">Joined Team</p>
                                                <p className="text-sm font-medium text-gray-800">
                                                    {team.joined}
                                                </p>
                                            </div>
                                            {team.caption && (
                                                <div className="col-span-full">
                                                    <p className="text-sm text-gray-500 mb-1">Caption</p>
                                                    <p className="text-sm text-gray-700">{team.caption}</p>
                                                </div>
                                            )}
                                        </div>

                                        {/* Social Links */}
                                        {team.socials && Object.entries(team.socials).some(([_, url]) => url) && (
                                            <div className="mt-4 border-t border-gray-200 pt-4">
                                                <h3 className="text-md font-medium mb-3 text-gray-700 flex items-center">
                                                    <Globe className="w-4 h-4 mr-1 text-gray-500" />
                                                    Social Links
                                                </h3>
                                                <div className="flex flex-wrap gap-2">
                                                    {Object.entries(team.socials).map(([platform, url]) => {
                                                        if (!url) return null;
                                                        return (
                                                            <a
                                                                key={platform}
                                                                href={url}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="inline-flex items-center rounded-md bg-blue-50 px-2.5 py-1.5 text-xs font-medium text-blue-700 hover:bg-blue-100 transition-colors"
                                                            >
                                                                <LinkIcon className="w-3 h-3 mr-1" />
                                                                {platform.charAt(0).toUpperCase() + platform.slice(1)}
                                                            </a>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
} 