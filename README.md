# Digital Nomads in Nepal (2026 Portal)

A definitive premium web portal built for digital nomads living, working, and exploring in Nepal. The application provides verified remote-work resources, directories of coworking hubs and local expert trekking guides, and a secure, gated community platform.

---

## 🌟 Key Features

### 1. 📂 Directories & Resources
- **Verified Coworking & Work Hubs**: Hand-tested coworking spaces filtered by city, WiFi speeds, power backup reliability, and booking features.
- **Local Expert Guides**: Connect with verified outdoor, cultural, and trekking experts across Nepal with full reviews and star-rating systems.
- **Himalayan Destinations**: Comprehensive location guides (Kathmandu, Pokhara, Mustang, Lalitpur, and more) detailing cost of living, weather, and cafes.
- **Visa & Connectivity Guides**: Relocation resources covering the Tourist Visa extensions, SIM cards, transport apps, and banking.

### 2. 👥 Gated Nomad Community
- **Middleware Protected Forum**: Accessible only to registered community members. Intercepts unauthenticated guests and redirects them to registration/sign-in.
- **Location Check-ins**: Active co-working status updates to see which workspaces other nomads are currently using in real-time.
- **Interactive Discussions**: Create threads, like discussions, and leave replies on visa questions, local meetups, and trekking plans.

### 3. 🛠️ Services Showcase
- A responsive, glassmorphic homepage section highlighting core services with tailored HSL animations, micro-interactions, and gold accent transitions.

### 4. 🔑 Admin Dashboard
- Complete dashboard to manage all guide registrations, destinations, co-working bookings, database records, media uploads, and newsletter subscribers.

---

## 💻 Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Authentication**: [NextAuth.js](https://next-auth.js.org/) (JWT Credentials Provider)
- **Database ORM**: [Prisma](https://www.prisma.io/) (MySQL / PostgreSQL schema management)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide-react.dev/)

---

## 🚀 Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed and a running MySQL/PostgreSQL database.

### 1. Clone & Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the root directory and add the following keys:
```env
DATABASE_URL="mysql://username:password@localhost:3306/nomads_nepal"
NEXTAUTH_SECRET="your-jwt-auth-session-secret"
NEXTAUTH_URL="http://localhost:3000"

# Optional: Integration with Brevo for automated community alerts
BREVO_API_KEY="your-brevo-api-key"
```

### 3. Database Setup (Prisma)
Initialize the database schemas and compile the Prisma client:
```bash
# Push schemas to the database
npx prisma db push

# Generate client
npx prisma generate
```

### 4. Seed Admin & Initial Data (Optional)
To setup a default admin account, run:
```bash
node scratch-seed-admin.js
```

### 5. Start Local Development
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## 📂 Project Structure

```text
├── app/                  # Next.js App Router (pages and API endpoints)
│   ├── admin/            # Admin Control Panel pages
│   ├── api/              # Backend routes (auth, community, guides, hubs)
│   ├── auth/             # Sign In and Signup forms
│   ├── community/        # Gated Nomad Community page
│   └── destinations/     # Location guides and resource items
├── components/           # Reusable UI components (Navbar, Footer, Services)
├── lib/                  # Auth configuration and Prisma database client
├── prisma/               # Prisma schema definitions
└── public/               # Static assets (images, logos, icons)
```

---

## 📜 License
This project is private and proprietary. All rights reserved.
