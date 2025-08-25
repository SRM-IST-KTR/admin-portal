const mongoose = require("mongoose");

const teamSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        domain: {
            type: String,
            required: true,
            enum: ["President", "Vice President", "Technical", "Corporate", "Creatives"],
        },
        position: {
            type: String,
            required: true,
            enum: ["President", "Vice President", "Director", "Member", "Lead", "Associate", "Admin", "Alumni"],
        },
        caption: {
            type: String,
            default: "",
        },
        joined: {
            type: Number,
            required: true,
        },
        pictureUrl: {
            type: String,
            default: "",
        },
        isCurrent: {
            type: Boolean,
            default: true,
        },
        socials: {
            github: {
                type: String,
                default: "",
            },
            linkedin: {
                type: String,
                default: "",
            },
            instagram: {
                type: String,
                default: "",
            },
            twitter: {
                type: String,
                default: "",
            },
            website: {
                type: String,
                default: "",
            },
        },
        index: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

let Team;
try {
    Team = mongoose.model('teams');
} catch {
    Team = mongoose.model('teams', teamSchema);
}

export default Team;
