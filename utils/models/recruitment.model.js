import mongoose from 'mongoose';

const participantSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    registrationNumber: {
        type: String,
        required: true,
        unique: true,
    },
    phone: {
        type: String,
        required: true,
    },
    year: {
        type: String,
        required: true,
    },
    domain: {
        type: String,
        required: true,
    },
    degreeWithBranch: {
        type: String,
        required: true,
    },
    links: {
        github: {
            type: String,
            default: null,
        },
        demo: {
            type: String,
            default: null,
        },
        deployment: {
            type: String,
            default: null,
        },
    },
    status: {
        type: String,
        enum: [
            'registered',
            'taskSubmitted',
            'interviewShortlisted',
            'onboarding',
        ],
        default: 'registered',
    },
});

// const ParticipantUser = mongoose.model(
// 	'ParticipantUser',
// 	participantSchema,
// 	'recruitment25'
// );
const ParticipantUser = mongoose.models.recruitment25 || mongoose.model("recruitment25", participantSchema);

export default ParticipantUser;