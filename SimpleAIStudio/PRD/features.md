# SimpleAI Product Requirements Document

## Overview
SimpleAI is a web application that enables users to generate high-quality images and videos using AI technology with a simple, intuitive interface.

## Feature Specifications

### 1. Landing Page
**Given** a user accesses the application, **as a** guest user, **when I** load the page, **I want** to see the SimpleAI branding and subtitle, **so that** I understand what the application does.

### 2. Task Type Selection
**Given** the landing page is loaded, **as a** guest user, **when I** view the left panel, **I want** to see Image selected by default with Video as an alternative option, **so that** I can choose my desired output format.

**Given** Image is selected, **as a** guest user, **when I** click on Video, **I want** the interface to switch to video-specific options, **so that** I can configure video generation parameters.

### 3. Speed Selection (Image Mode)
**Given** Image task type is selected, **as a** guest user, **when I** view the speed options, **I want** to see Speed label with an icon and inline time estimates (Fast: 1min, Normal: 1-2min, Slow: +3min), **so that** I can balance quality vs generation time in a compact layout.

**Given** speed options are available, **as a** guest user, **when I** click on any speed option, **I want** visual feedback showing my selection with improved contrast for unselected buttons, **so that** I know which speed is currently selected.

### 4. Prompt Input Field
**Given** Image task type is selected, **as a** guest user, **when I** view the prompt section, **I want** to see a text field with placeholder text, **so that** I understand what kind of prompts to write.

**Given** the prompt field is active, **as a** guest user, **when I** type in the field, **I want** to see a real-time character counter and validation, **so that** I know when I've met the minimum requirements.

**Given** I have typed less than 50 characters, **as a** guest user, **when I** view the form, **I want** the Generate button to be disabled with validation messages, **so that** I'm prevented from submitting incomplete prompts.

### 5. Quick Examples
**Given** the prompt field is visible, **as a** guest user, **when I** see the Quick Examples section, **I want** the label and three very compact example buttons positioned to the right of the prompt label and aligned right, **so that** I can quickly populate the prompt field with professional examples without taking excessive vertical space.

**Given** Quick Examples are available, **as a** guest user, **when I** click on any example button (Product Photo, Restaurant, Customer), **I want** the prompt field to be filled with the corresponding text, **so that** I can use or modify professional prompts.

### 6. Image Upload (Optional)
**Given** the form is visible, **as a** guest user, **when I** see the Upload Image section with an upload icon, **I want** a compact drag-and-drop area with click functionality, **so that** I can optionally provide reference images without taking excessive vertical space.

**Given** I have selected an image, **as a** guest user, **when I** upload it, **I want** to see a compact preview (24px height) with a small remove button overlay, **so that** I can confirm my upload and change it if needed while maintaining form compactness.

**Given** I try to upload an invalid file, **as a** guest user, **when I** attempt the upload, **I want** to see an error message, **so that** I understand what went wrong.

### 7. Aspect Ratio Selection
**Given** Image task type is selected, **as a** guest user, **when I** view the aspect ratio section, **I want** to see the label with an icon on the left and a fixed-width dropdown aligned to the right with comprehensive options including social media formats, **so that** I can generate images in the correct dimensions for my use case while maintaining a compact, right-aligned layout.

### 8. Form Actions
**Given** the form is incomplete, **as a** guest user, **when I** view the action buttons, **I want** the Generate button to be disabled, **so that** I'm prevented from submitting invalid forms.

**Given** the form is complete and valid, **as a** guest user, **when I** click Generate, **I want** to see loading feedback and eventual results, **so that** I know the generation is in progress.

**Given** I want to start over, **as a** guest user, **when I** click Reset, **I want** all form fields to be cleared and returned to default states, **so that** I can begin a new generation task.

### 9. Event Logging
**Given** any user interaction occurs, **as a** system administrator, **when I** review logs, **I want** to see detailed event tracking including timestamps and user data, **so that** I can analyze user behavior and improve the application.

### 10. Right Panel - Before/After Carousel
**Given** the application loads, **as a** guest user, **when I** view the right panel, **I want** to see an interactive before/after image comparison carousel showcasing AI transformation examples, **so that** I understand the application's capabilities and am inspired to create.

**Given** the before/after carousel is visible, **as a** guest user, **when I** interact with the draggable slider, **I want** to smoothly reveal the differences between original photos and AI-generated artwork, **so that** I can see the transformation quality in detail.

**Given** the carousel is active, **as a** guest user, **when I** hover over the carousel area, **I want** the automatic rotation to pause, **so that** I can examine the current comparison without interruption.

**Given** the carousel auto-advances, **as a** guest user, **when I** wait without interaction, **I want** slides to change automatically every 2.5 seconds with smooth transitions, **so that** I can see multiple examples without manual navigation.

**Given** I manually navigate the carousel, **as a** guest user, **when I** click arrows or dots, **I want** auto-play to pause and resume after 5 seconds of inactivity, **so that** I have control over the viewing experience.

**Given** the carousel navigation is available, **as a** guest user, **when I** view the indicator dots, **I want** to see a visual status showing whether auto-play is active (green dot) or paused (gray dot), **so that** I understand the current playback state.

**Given** the carousel content is displayed, **as a** guest user, **when I** view the text section below, **I want** to see an inspiring headline "Just Imagine It, We Can Create It" with explanatory subtext and a prominent upload button, **so that** I'm motivated to try the service.

### 11. Responsive Design
**Given** I access the application on any device, **as a** guest user, **when I** view the interface, **I want** it to adapt to my screen size, **so that** I can use the application effectively on desktop, tablet, or mobile.

### 12. Accessibility
**Given** I use assistive technologies, **as a** user with accessibility needs, **when I** navigate the application, **I want** proper ARIA labels, keyboard navigation, and screen reader support, **so that** I can use all features effectively.

## Technical Requirements

### Form Validation
- Minimum 50 characters for prompt field
- Real-time character counting
- File type and size validation for uploads
- Disabled states for incomplete forms

### Event Tracking
- All button clicks, field changes, and user interactions
- Form validation events
- Upload and generation events
- Error and success events
- Carousel interactions (manual navigation, auto-advance, hover pause/resume)
- Before/after slider interactions

### Performance
- Fast form validation feedback
- Efficient image preview handling
- Smooth UI transitions
- Responsive layout performance

### Browser Support
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browser compatibility
- Progressive enhancement approach

## Implementation Details

### Color Scheme
- Primary: Blue (#2563eb / hsl(213.8, 94%, 50%))
- Secondary: Gray (#6b7280)
- Success: Green (#10b981)
- Background: Light gray (#f9fafb)
- Text: Dark gray (#111827)
- Improved contrast for unselected outline buttons: border-gray-400 with hover:border-gray-500

### Typography
- Font family: Inter
- Headers: Bold weights (600-700)
- Body text: Regular (400) and medium (500)
- Small text: Light (300-400)

### Layout
- Two-column layout on desktop
- Single column on mobile
- Card-based design with shadows
- Compact spacing (space-y-4 instead of space-y-6) to reduce scrolling
- Inline labels and controls where appropriate (Speed, Aspect Ratio, Quick Examples)
- Smaller button heights and compact components
- Responsive grid system

### Components
- shadcn UI component library
- Tailwind CSS for styling
- Lucide React for icons
- React Hook Form for form management
- React Query for data fetching

### State Management
- Form state with React Hook Form
- Server state with React Query
- Local state with React useState
- Event logging with custom hooks

### API Endpoints
- POST /api/events/log - Log user events
- GET /api/events - Retrieve event logs
- POST /api/upload - Upload images
- POST /api/generate - Submit generation requests
- GET /api/generate/:id - Check generation status

### Data Models
- EventLog: event tracking data
- GenerationRequest: AI generation parameters
- User: user account information (future)

### Error Handling
- Form validation with Zod schemas
- File upload validation
- API error responses
- User-friendly error messages
- Toast notifications for feedback

### Performance Considerations
- Lazy loading for components
- Debounced input validation
- Optimized image handling with compact previews (24px height)
- Efficient event logging
- Minimal re-renders
- Reduced vertical space usage for better UX on smaller screens

### UI Improvements (Latest)
- Added icons to Speed (Settings), Upload Image (Upload), and Aspect Ratio (Settings) sections
- Moved explanation texts inline with labels for compact layout:
  - Speed: Time estimates appear next to label
  - Quick Examples: Moved to right side of prompt label, right-aligned with smaller buttons
  - Aspect Ratio: Fixed-width dropdown (240px) positioned to the right for better alignment
- Removed redundant help text under Aspect Ratio section
- Improved contrast for unselected outline buttons with border-gray-400
- Enhanced prompt field contrast with border-gray-400 and darker focus states
- Reduced component spacing from space-y-6 to space-y-4
- Made task type buttons more compact (py-2 instead of py-3)
- Reduced image upload area padding and preview height
- Made example buttons even smaller (h-5, px-1.5) and positioned inline with prompt label
- Improved visual hierarchy with consistent iconography
- Better right-alignment for dropdown controls and example buttons

### Right Panel Carousel Implementation
- **Before/After Slider Component**: Interactive draggable slider revealing AI transformations
- **Auto-rotation System**: 2.5-second intervals with smart pause/resume functionality
- **User Interaction Controls**: 
  - Hover to pause auto-play
  - Manual navigation via arrow buttons and dot indicators
  - 5-second resume delay after manual interaction
- **Visual Status Indicator**: Green dot (auto-playing) / Gray dot (paused) with text labels
- **Responsive Design**: Centered layout with navigation arrows positioned outside the slider
- **Content Structure**: 
  - Three example before/after pairs showcasing different transformation styles
  - Centered text section with motivational headline and call-to-action
  - Full-width blue-outlined upload button connecting to the main form
- **Event Logging Integration**: All carousel interactions tracked for analytics
- **Accessibility Features**: Proper ARIA labels and keyboard navigation support
