# 🗓️ Custom Event Calendar – Frontend Assignment

This is a fully functional and interactive **event calendar application** built as part of a frontend assignment. It allows users to manage their schedules efficiently with features like adding, editing, deleting, filtering, and rescheduling events — including support for recurring events and responsive design.

> **Live Demo:** [https://your-live-link.vercel.app](https://your-live-link.vercel.app)  
> **GitHub Repo:** [https://github.com/yourusername/custom-event-calendar](https://github.com/yourusername/custom-event-calendar)

---

## Objective

To build a **dynamic event calendar** that allows users to:

- Manage personal events and schedules
- Handle recurring and overlapping events
- Drag and drop events to reschedule
- Search and filter events
- Experience a smooth, responsive user interface

---

## Features Implemented

### 1. Monthly Calendar View
- Displays a traditional month grid
- Current day is visually highlighted
- Buttons to navigate between months

### 2. Event Management
- **Add Events** by clicking on a specific date
  - Event Title
  - Date & Time (with time picker)
  - Description
  - Recurrence Options (Daily, Weekly, Monthly, Custom)
  - Optional: Color tag or category
- **Edit Events**
  - Modify event details by clicking the event
- **Delete Events**
  - Easily remove unwanted events

### 3. Recurring Events
- **Daily:** Repeats every day
- **Weekly:** Repeats on selected weekdays
- **Monthly:** Repeats on a chosen date each month
- **Custom:** Repeat every _n_ days or weeks

### 4. Drag-and-Drop Rescheduling
- Drag events to a new date
- Automatic adjustment of recurring event chains
- Handles edge cases (e.g., conflict with other events)

### 5. Conflict Management
- Prevents overlapping events at the same time
- Warns user when conflicts occur

### 6. Filtering & Searching *(Optional Feature)*
- Filter events by category or color
- Search for events by title or description

### 7. Event Persistence
- All events are stored in **Local Storage**
- Data persists across browser refreshes

### 8. Responsive Design *(Bonus Feature)*
- Works on all screen sizes
- Switches layout dynamically for smaller screens

---

##  Technical Stack

| Tool/Library       | Purpose                                  |
|--------------------|-------------------------------------------|
| **React**          | Core UI framework                         |
| **TypeScript**     | Type safety and developer tooling         |
| **Tailwind CSS**   | Styling with utility-first classes        |
| **Vite**           | Lightning-fast development/build tooling  |
| **React DnD**      | Drag-and-drop functionality               |
| **date-fns**       | Date/time manipulation and recurrence     |
| **LocalStorage**   | In-browser event persistence              |

---

## Folder Structure

```bash
├── public/                      # Static assets
├── src/
│   ├── components/              # Calendar, forms, modals
│   ├── hooks/                   # useCalendar, useEvents, etc.
│   ├── utils/                   # Date helpers, validation
│   ├── App.tsx                  # Root component
│   └── main.tsx                 # Entry point
├── tailwind.config.ts          # Tailwind CSS config
├── vite.config.ts              # Vite build settings
├── index.html                  # Main HTML template
├── package.json                # Project metadata & scripts
└── README.md                   # Project documentation
