# SimpleAI - AI Image & Video Generation Platform

## Overview

SimpleAI is a modern web application that enables users to generate high-quality images and videos using AI technology. Built with a clean, intuitive interface, the platform allows users to create content through simple prompts while providing advanced customization options like speed selection, aspect ratios, and optional image uploads for reference.

The application features a comprehensive form-based workflow where users select between image and video generation modes, configure parameters, input descriptive prompts, and optionally upload reference images. The right panel showcases an interactive before/after image comparison carousel that demonstrates AI transformation capabilities with automatic rotation and user controls. The system includes robust event logging for analytics and user behavior tracking.

## Recent Changes (August 17, 2025)

✓ **Before/After Carousel Implementation**: Replaced simple image carousel with interactive before/after comparison sliders
✓ **Auto-rotation System**: Added 2.5-second automatic slide advancement with smart pause/resume functionality  
✓ **User Interaction Controls**: Hover-to-pause, manual navigation with 5-second resume delay
✓ **Visual Status Indicators**: Auto-play status indicator (green=auto, gray=paused) next to navigation dots
✓ **Enhanced UX**: Smooth transitions, responsive design, and comprehensive event logging for all interactions

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript for type safety and modern development practices
- **Styling**: Tailwind CSS with shadcn/ui component library for consistent, accessible UI components
- **State Management**: React Hook Form with Zod validation for robust form handling and data validation
- **Data Fetching**: TanStack React Query for efficient server state management and caching
- **Routing**: Wouter for lightweight client-side routing
- **Build Tool**: Vite for fast development and optimized production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js framework for RESTful API endpoints
- **Language**: TypeScript throughout the entire stack for consistency and type safety
- **Data Storage**: In-memory storage implementation with interface-based design allowing future database integration
- **File Handling**: Multer middleware for image upload processing with file type and size validation
- **Development**: Custom Vite integration for seamless full-stack development experience

### Database Schema
- **Users Table**: Basic user management with username/password authentication
- **Event Logs Table**: Comprehensive user interaction tracking including events, elements, timestamps, and metadata
- **Generation Requests Table**: Full request lifecycle tracking from submission to completion with status management
- **ORM**: Drizzle with PostgreSQL dialect configured for future database integration

### API Design
- **Event Logging**: POST /api/events/log for real-time user interaction tracking
- **Event Retrieval**: GET /api/events for analytics and debugging purposes
- **Generation Pipeline**: Structured request/response handling for AI generation workflows
- **File Upload**: Secure image upload with validation and preview functionality

### Form Validation & UX
- **Prompt Validation**: Minimum 50-character requirement with real-time feedback
- **Speed Selection**: Three-tier system (Slow, Normal, Fast) with time estimates
- **Aspect Ratio Options**: Comprehensive presets including social media formats
- **Image Upload**: Optional drag-and-drop with preview and validation
- **Quick Examples**: Pre-written prompts for user inspiration and faster workflow

## External Dependencies

### UI & Styling
- **shadcn/ui**: Complete component library built on Radix UI primitives
- **Tailwind CSS**: Utility-first CSS framework with custom design system
- **Radix UI**: Accessible, unstyled component primitives for complex UI patterns
- **Lucide React**: Consistent icon library for UI elements

### State Management & Forms
- **TanStack React Query**: Server state management with intelligent caching
- **React Hook Form**: Performant form library with minimal re-renders
- **Zod**: TypeScript-first schema validation for runtime type safety

### File Handling & Storage
- **Multer**: Multipart form data handling for file uploads
- **Google Cloud Storage**: Cloud storage integration for file management
- **Uppy**: File upload components with progress tracking and multiple upload methods

### Development & Build Tools
- **Vite**: Next-generation frontend build tool with HMR
- **TypeScript**: Static type checking across the entire application
- **ESBuild**: Fast JavaScript bundler for production builds
- **Drizzle Kit**: Database migrations and schema management

### Database & ORM
- **Drizzle ORM**: Type-safe SQL query builder with PostgreSQL support
- **Neon Database**: Serverless PostgreSQL for production deployment
- **PostgreSQL**: Relational database configured through environment variables

### Development Experience
- **Replit Integration**: Cloud development environment with live preview
- **Hot Module Replacement**: Instant feedback during development
- **Runtime Error Overlay**: Enhanced debugging experience in development mode