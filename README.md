# School Admit Card Generator

A powerful, responsive web application for dynamically generating professional school admit cards in bulk. Built with React and Vite, this tool streamlines the process of issuing hall tickets by accepting student data via Excel or CSV and automatically laying out beautiful, print-ready PDF admit cards.

## Features

- **Multi-Step Setup Wizard**: An intuitive 7-step guide covering School Profile, Exam Details, Class Selection, Subject Setup, Schedule, Student Data, and Generation.
- **Advanced CSV/Excel Parsing**: Import student data seamlessly using either CSV or XLSX templates. Includes real-time validation and error reporting.
- **Smart Date Auto-Fill**: Intelligently schedules exams sequentially while automatically skipping Sundays.
- **Advanced & Standard Modes**: Flexible subject selection allowing for uniform class subjects or complex student-specific subject combinations.
- **Mobile-First UX**: Sleek, app-like responsive design featuring bottom floating action bars and edge-to-edge layouts optimized for phones and tablets.
- **Browser-Native PDF Generation**: Uses standard HTML-to-Image rendering allowing perfect, high-resolution printable PDFs directly in the browser.

## Technology Stack

- **Framework**: React 19 + Vite
- **Styling**: Tailwind CSS v4, Lucide React (Icons)
- **Data Parsing**: PapaParse (CSV), xlsx (Excel)
- **PDF Generation**: html-to-image, jsPDF
- **Date Utilities**: date-fns
- **Animation**: Motion (Framer Motion)

## Project Structure

- `/src/components/wizard` - The core multi-step setup flow components.
- `/src/components/admit-card` - The printable UI layout for the generated admit cards.
- `/src/components/shared` - Reusable UI components (Buttons, Cards, Steppers, DatePickers).
- `/src/lib` - Utility functions for validation, parsing, and PDF generation.
- `/src/state` - React Context and Reducers for managing the global wizard state.

## Getting Started

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start the Development Server**
   ```bash
   npm run dev
   ```

3. **Build for Production**
   ```bash
   npm run build
   ```
