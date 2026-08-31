# GCSRM Admin Portal

The official administrative and analytics portal for GitHub Community SRM (GCSRM), built with Next.js, Tailwind CSS, and Chart.js.

## Overview

The Admin Portal is a decoupled frontend client that interfaces with the **`gcsrm_server`** backend API.

- **Recruitment & Analytics Dashboard** (`/recruitment`): Real-time applicant intake analytics, domain breakdown (Technical, Creatives, Corporate), seniority distribution, conversion funnel progression, links submission health, and candidate evaluation pipeline.
- **Events Management** (`/events`, `/events/[slug]`): Event creation, attendee participant list tracking, QR code scanner check-in, and snack distribution tracking.
- **Team Management** (`/teams`): Manage executive board and member rosters.

## Getting Started

### Prerequisites

- Node.js (v18+)
- Running `gcsrm_server` backend instance (defaults to `http://localhost:8000`)

### Environment Configuration

Create `.env` or `.env.local`:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
NEXT_PUBLIC_ADMIN_USERNAME=admin
NEXT_PUBLIC_ADMIN_PASSWORD=admin
NEXT_PUBLIC_MANAGER_USERNAME=manager
NEXT_PUBLIC_MANAGER_PASSWORD=manager
```

### Installation & Development

```bash
# Install dependencies
npm install

# Start Next.js development server on port 3000
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to access the portal.
