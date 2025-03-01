# PowerChat - Real-time Chat Application

PowerChat is a modern, real-time chat application built with Next.js, Supabase, and Vercel. It features user authentication, real-time messaging, and image sharing capabilities.

## Features

- User authentication (signup, login, logout)
- Real-time messaging
- Image upload and sharing
- Responsive design
- Dark mode UI

## Tech Stack

- **Frontend**: Next.js 13 (App Router), React, TypeScript
- **Backend**: Supabase (Authentication, Database, Real-time subscriptions)
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Image Storage**: Vercel Blob
- **Deployment**: Vercel

## Prerequisites

Before you begin, ensure you have the following installed on your local machine:

- Node.js (v14.x or later)
- npm (v6.x or later)
- Git

You'll also need accounts with the following services:

- [Supabase](https://supabase.com/)
- [Vercel](https://vercel.com/)

## Environment Variables
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
BLOB_READ_WRITE_TOKEN

To run this project, you will need to add the following environment variables to your `.env.local` file:

