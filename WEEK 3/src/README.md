# Movie Booking System - Admin Dashboard

A production-grade React admin dashboard for managing a movie booking system, built with modern technologies and best practices.

## 🚀 Features

### Core Features
- **Responsive Dashboard** - Real-time metrics with occupancy rates, revenue tracking, and user analytics
- **Movie Scheduling Calendar** - Interactive calendar with drag-and-drop event management
- **Kanban Board** - Task management for movie production and operations
- **Advanced Analytics** - Comprehensive charts and insights with Recharts
- **Dynamic CRUD Tables** - Full-featured data tables with search, filter, pagination, and export capabilities
- **Dark/Light Theme** - Persistent theme switching with system preference detection

### Advanced Features
- **Role-Based Access Control** - Admin, Manager, and Staff roles with granular permissions
- **Real-Time Data Simulation** - Live booking updates and revenue tracking
- **Audit Logging** - Complete action tracking for compliance and security
- **Global Command Palette** - Ctrl+K quick navigation and actions
- **Data Export** - CSV and PDF export functionality
- **Performance Optimization** - Lazy loading, memoization, and efficient rendering

### UI/UX Excellence
- **Clean Modern Design** - Tailwind CSS utility-first styling
- **Smooth Animations** - Polished transitions and micro-interactions
- **Mobile-First Responsive** - Optimized for all device sizes
- **Accessibility** - ARIA labels, keyboard navigation, and screen reader support
- **Error Boundaries** - Graceful error handling and user feedback

## 🛠️ Tech Stack

- **Frontend Framework**: React 19 with Vite
- **Styling**: Tailwind CSS 4.x
- **Icons**: Lucide React
- **Charts**: Recharts
- **Calendar**: React Big Calendar with Moment.js
- **Drag & Drop**: React Beautiful DnD
- **Tables**: TanStack Table
- **Hotkeys**: React Hotkeys Hook
- **Data Export**: PapaParse (CSV), jsPDF (PDF)
- **State Management**: React Context API
- **Routing**: React Router DOM

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Layout.jsx      # Main layout with sidebar and topbar
│   ├── Sidebar.jsx     # Navigation sidebar with role-based menu
│   ├── Topbar.jsx      # Top navigation with notifications and user menu
│   └── CommandPalette.jsx # Global command palette (Ctrl+K)
├── contexts/           # React Context providers
│   ├── AuthContext.jsx # User authentication and permissions
│   ├── AuditContext.jsx # Audit logging system
│   ├── RealTimeContext.jsx # Real-time data simulation
│   └── ThemeContext.jsx # Theme management
├── pages/             # Main application pages
│   ├── Dashboard.jsx  # Main dashboard with metrics
│   ├── Analytics.jsx  # Advanced analytics and charts
│   ├── CalendarPage.jsx # Movie scheduling calendar
│   ├── Kanban.jsx     # Task management board
│   ├── Tables.jsx     # User management with CRUD
│   └── AuditLogs.jsx  # Audit logs viewer
└── App.jsx           # Main application component
```

## 🏗️ Architecture

### Context-Based State Management
- **AuthContext**: Handles user authentication, roles, and permissions
- **AuditContext**: Manages audit logging with localStorage persistence
- **RealTimeContext**: Simulates live data updates for bookings and revenue
- **ThemeContext**: Manages dark/light theme with system preference detection

### Role-Based Access Control
- **Admin**: Full access to all features including audit logs and user management
- **Manager**: Access to most features except audit logs and user deletion
- **Staff**: Limited access focused on operational tasks

### Performance Optimizations
- **React.memo**: Prevents unnecessary re-renders
- **useMemo**: Caches expensive computations
- **Lazy Loading**: Code splitting for better initial load times
- **Efficient Updates**: Targeted state updates to minimize re-renders

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd movie-booking-admin
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   ```
   http://localhost:5173
   ```

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## 🎯 Usage Guide

### Navigation
- Use the sidebar to navigate between different sections
- Press `Ctrl+K` (or `Cmd+K` on Mac) to open the command palette
- All navigation respects user permissions

### Dashboard
- View real-time metrics and KPIs
- Monitor live booking activity
- Track revenue and occupancy rates
- Recent activity feed with live updates

### Calendar Management
- View movie screenings in calendar format
- Click on events to view details
- Add new screenings (Admin/Manager only)
- Edit or delete existing screenings
- Color-coded by movie genre

### User Management
- Search and filter users
- Add, edit, or delete users (role-dependent)
- Export data to CSV or PDF
- All actions are logged for audit purposes

### Analytics
- Comprehensive charts and graphs
- Revenue trends and ticket sales
- Genre popularity analysis
- Peak hours and occupancy insights

### Kanban Board
- Drag and drop tasks between columns
- Add new tasks to any column
- Delete completed tasks
- Real-time collaboration simulation

### Audit Logs
- View all system activities (Admin only)
- Filter by action type or user
- Search through log entries
- Export audit data

## 🔐 Security Features

### Authentication & Authorization
- Role-based access control
- Permission-based feature gating
- Secure audit logging

### Data Protection
- Input validation and sanitization
- XSS protection
- Secure data export

### Audit Trail
- Complete action logging
- User activity tracking
- Compliance-ready audit reports

## 📱 Responsive Design

The dashboard is fully responsive and optimized for:
- **Desktop**: Full feature set with multi-column layouts
- **Tablet**: Adapted layouts with touch-friendly controls
- **Mobile**: Single-column design with collapsible navigation

## 🎨 Theme System

### Dark/Light Mode
- Automatic system preference detection
- Manual toggle in sidebar
- Persistent theme selection
- Consistent theming across all components

### Color Scheme
- **Primary**: Blue (#3b82f6) for actions and links
- **Success**: Green (#10b981) for positive states
- **Warning**: Yellow (#f59e0b) for warnings
- **Error**: Red (#ef4444) for errors
- **Neutral**: Gray scale for backgrounds and text

## 🔧 Configuration

### Environment Variables
Create a `.env` file for configuration:
```env
VITE_API_BASE_URL=http://localhost:3001/api
VITE_APP_NAME=Movie Booking Admin
VITE_MAX_AUDIT_LOGS=1000
```

### Theme Customization
Modify `tailwind.config.js` to customize colors and design tokens.

## 🧪 Testing

```bash
npm run test
```

## 📦 Deployment

### Vercel (Recommended)
```bash
npm install -g vercel
vercel --prod
```

### Netlify
```bash
npm run build
# Upload dist/ folder to Netlify
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 5173
CMD ["npm", "run", "preview"]
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

### Code Style
- Follow ESLint configuration
- Use Prettier for code formatting
- Follow React best practices
- Write meaningful commit messages

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [React](https://reactjs.org/) - UI framework
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- [Vite](https://vitejs.dev/) - Build tool
- [TanStack Table](https://tanstack.com/table) - Data table library
- [Recharts](https://recharts.org/) - Chart library
- [React Big Calendar](https://github.com/jquense/react-big-calendar) - Calendar component

## 📞 Support

For support, email support@moviebooking.com or create an issue in the repository.

---

Built with ❤️ using React and modern web technologies.
