# TakaTena - Transform Waste Into Value

[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38bdf8)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-5-2d3748)](https://www.prisma.io/)

TakaTena is Kenya's leading marketplace for sustainable material exchange. Our platform connects waste generators with recyclers and processors, transforming waste materials into valuable opportunities while building a circular economy.

## 🌟 Features

### Core Platform Features
- **Material Listings**: Post and browse waste materials with detailed descriptions, photos, and quantities
- **User Profiles**: Complete user management with profile customization and verification
- **Search & Filter**: Advanced search with material type, location, and status filters
- **Impact Tracking**: Real-time statistics showing environmental impact and community achievements
- **Responsive Design**: Fully optimized for desktop, tablet, and mobile devices

### Technical Features
- **Authentication**: Secure user authentication with NextAuth.js
- **Image Upload**: Drag-and-drop image uploads with cloud storage via Vercel Blob
- **Database**: PostgreSQL with Prisma ORM for type-safe database operations
- **Error Handling**: Comprehensive error boundaries and API error handling
- **Performance**: Optimized with lazy loading, image optimization, and caching
- **SEO**: Complete SEO optimization with metadata, sitemap, and structured data
- **Accessibility**: WCAG compliant with proper ARIA labels and keyboard navigation

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL database
- Vercel account (for blob storage)

### Environment Variables

Create a `.env.local` file in the root directory:

```bash
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/takatena"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# Vercel Blob Storage
BLOB_READ_WRITE_TOKEN="your-vercel-blob-token"

# App Configuration
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/takatena.git
   cd takatena
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up the database**
   ```bash
   # Generate Prisma client
   npx prisma generate

   # Push database schema
   npx prisma db push

   # (Optional) Seed the database
   npx prisma db seed
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000)

## 📦 Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Beautiful UI components built on Radix UI
- **Lucide React** - Beautiful & consistent icons

### Backend
- **Next.js API Routes** - Serverless API endpoints
- **Prisma** - Next-generation ORM
- **PostgreSQL** - Robust relational database
- **NextAuth.js** - Complete authentication solution

### Infrastructure
- **Vercel** - Deployment and hosting
- **Vercel Blob** - File storage
- **Neon** - Serverless PostgreSQL (recommended)

## 🗂️ Project Structure

```
takatena/
├── app/                    # Next.js App Router
│   ├── (main)/            # Main app pages
│   ├── (auth)/            # Authentication pages
│   ├── api/               # API routes
│   ├── globals.css        # Global styles
│   └── layout.tsx         # Root layout
├── components/            # Reusable components
│   ├── ui/               # Base UI components
│   ├── layout/           # Layout components
│   ├── listings/         # Listing-related components
│   └── shared/           # Shared components
├── lib/                  # Utility functions
│   ├── auth.ts          # Authentication configuration
│   ├── prisma.ts        # Database client
│   └── utils.ts         # General utilities
├── prisma/              # Database schema and migrations
│   └── schema.prisma    # Prisma schema
└── public/              # Static assets
```

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "feat: initial commit"
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Configure environment variables
   - Deploy automatically

3. **Set Environment Variables**

   In Vercel dashboard, add all environment variables:
   ```
   DATABASE_URL=your-production-database-url
   NEXTAUTH_URL=https://your-domain.vercel.app
   NEXTAUTH_SECRET=your-production-secret
   BLOB_READ_WRITE_TOKEN=your-vercel-blob-token
   NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
   ```

4. **Database Migration**
   ```bash
   # After deployment, run database migrations
   npx prisma db push
   ```

## 🗃️ Database Schema

### Core Entities

```prisma
model User {
  id          String      @id @default(cuid())
  email       String      @unique
  name        String
  userType    UserType
  location    String
  phone       String?
  whatsapp    String?
  verified    Boolean     @default(false)
  listings    Listing[]
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt
}

model Listing {
  id           String        @id @default(cuid())
  title        String
  description  String
  materialType MaterialType
  quantity     Int
  unit         Unit
  location     String
  images       String[]
  status       ListingStatus @default(AVAILABLE)
  views        Int           @default(0)
  userId       String
  user         User          @relation(fields: [userId], references: [id])
  createdAt    DateTime      @default(now())
  updatedAt    DateTime      @updatedAt
}
```

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/) and [Vercel](https://vercel.com/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Icons from [Lucide](https://lucide.dev/)

---

**Made with ❤️ for a sustainable Kenya**
