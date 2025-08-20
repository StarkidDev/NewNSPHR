# 🏢 NSP Portal and Management System for GNPC

[![Django](https://img.shields.io/badge/Django-5.2.5-green.svg)](https://djangoproject.com/)
[![React](https://img.shields.io/badge/React-19.1.1-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.9.5-blue.svg)](https://typescriptlang.org/)
[![Material-UI](https://img.shields.io/badge/Material--UI-5.x-blue.svg)](https://mui.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-17-blue.svg)](https://postgresql.org/)

A comprehensive digital platform designed to streamline and modernize National Service Personnel (NSP) management processes at Ghana National Petroleum Corporation (GNPC).

## 🎯 Project Overview

This system transforms the manual, paper-based NSP appointment process into a modern, efficient digital workflow that improves communication, transparency, and document management between GNPC HR, supervisors, and NSPs.

### ✨ Key Features

- **🔓 Public Appointment Submission** - NSPs can submit applications without prior registration
- **📧 Real-time Status Tracking** - Check application status instantly using email
- **👥 Role-based Access Control** - Separate interfaces for NSPs, HR, Supervisors, and Admins
- **📋 Digital Permission Requests** - Paperless permission/off-duty request system
- **📊 Monthly Reporting** - Streamlined report submission and evaluation
- **💬 Communication Hub** - Complaints, messages, and announcements
- **📱 Mobile-Responsive** - Works seamlessly on all devices
- **🔒 Secure & Scalable** - Enterprise-grade security with comprehensive audit trails

## 🏗️ Architecture

### Backend (Django + PostgreSQL)
- **Framework**: Django 5.2.5 + Django REST Framework
- **Database**: PostgreSQL 17 with optimized indexes
- **Authentication**: JWT tokens with role-based permissions
- **Email**: Automated notifications and confirmations
- **File Storage**: Secure document upload and management
- **API**: 40+ REST endpoints with comprehensive documentation

### Frontend (React + TypeScript)
- **Framework**: React 19.1.1 with TypeScript
- **UI Library**: Material-UI (MUI) with custom GNPC theme
- **State Management**: Redux Toolkit
- **Routing**: React Router with protected routes
- **Forms**: React Hook Form with Yup validation
- **HTTP Client**: Axios with JWT interceptors

## 🚀 Quick Start

### Prerequisites
- Python 3.9+
- Node.js 16+
- PostgreSQL 13+
- Git

### Backend Setup

```bash
# Clone the repository
git clone https://github.com/StarkidDev/NewNSPHR.git
cd NewNSPHR/nsp-portal/backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set up environment variables
cp .env.example .env
# Edit .env with your database credentials

# Set up database
createdb nsp_portal_db
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Start development server
python manage.py runserver
```

### Frontend Setup

```bash
# Navigate to frontend directory
cd ../frontend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your API URL

# Start development server
npm start
```

### Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000/api
- **Django Admin**: http://localhost:8000/admin

## 📊 Database Schema

### Core Models
- **User Management**: Custom user model with role-based types
- **NSP Profiles**: Complete NSP information and service tracking
- **Appointments**: Application submission and approval workflow
- **Permissions**: Digital permission/off-duty request system
- **Reports**: Monthly reports and performance evaluations
- **Communications**: Complaints, messages, and announcements

### Key Relationships
```
User (NSP/HR/Supervisor/Admin)
├── NSPProfile (for NSPs)
├── HRProfile (for HR staff)
├── SupervisorProfile (for supervisors)
├── AppointmentSubmission (applications)
├── PermissionRequest (permission requests)
├── MonthlyReport (monthly reports)
├── PerformanceEvaluation (evaluations)
└── Complaint (complaints)
```

## 🔐 User Roles & Permissions

### 👤 National Service Personnel (NSP)
- Submit appointment applications
- Check application status
- Request permissions/off-duty
- Submit monthly reports
- File complaints and feedback
- Access personal dashboard

### 👔 Human Resources (HR)
- Review and approve/decline applications
- Generate user accounts for approved NSPs
- Process permission requests
- Manage announcements
- Access comprehensive analytics
- Bulk operations for efficiency

### 👨‍💼 Supervisor
- Monitor assigned NSPs
- Conduct performance evaluations
- Review monthly reports
- Approve permission requests
- Provide feedback and guidance

### 🔧 System Administrator
- Full system access
- User management
- System configuration
- Audit log monitoring

## 📱 User Interface

### Public Pages
- **Homepage**: Feature overview and quick access
- **Application Submission**: Complete form with file upload
- **Status Check**: Real-time status lookup
- **Login**: Secure authentication portal

### Role-based Dashboards
- **NSP Dashboard**: Service overview, quick actions, upcoming tasks
- **HR Dashboard**: Application management, statistics, bulk operations
- **Supervisor Dashboard**: NSP monitoring, evaluation tools

## 🔧 API Documentation

### Public Endpoints
```
POST /api/appointments/submit/        # Submit appointment
GET  /api/appointments/status/        # Check status
```

### Authentication
```
POST /api/auth/login/                 # User login
POST /api/auth/refresh/               # Token refresh
```

### Protected Endpoints
```
# Appointments
GET  /api/appointments/submissions/   # List submissions (HR)
PUT  /api/appointments/submissions/{id}/review/  # Review submission
POST /api/appointments/bulk-action/   # Bulk operations

# Permissions
GET  /api/permissions/requests/       # List requests
POST /api/permissions/requests/create/  # Create request
PUT  /api/permissions/requests/{id}/approve/  # Approve request

# Reports
GET  /api/reports/monthly/            # List monthly reports
POST /api/reports/evaluations/create/  # Create evaluation
```

## 🛡️ Security Features

- **JWT Authentication** with automatic token refresh
- **Role-based Access Control** (RBAC)
- **CORS Protection** for cross-origin requests
- **File Upload Validation** with size and type restrictions
- **Activity Logging** for comprehensive audit trails
- **SQL Injection Protection** through Django ORM
- **XSS Protection** with Content Security Policy

## 📈 Performance & Scalability

- **Database Optimization**: Indexes on frequently queried fields
- **API Pagination**: Efficient data loading with page limits
- **Caching Strategy**: Redis-ready for session and data caching
- **File Storage**: Configurable for local or cloud storage
- **Load Balancing**: Docker-ready for horizontal scaling

## 🧪 Testing

### Backend Tests
```bash
cd backend
python manage.py test
```

### Frontend Tests
```bash
cd frontend
npm test
```

### Coverage Reports
```bash
# Backend coverage
coverage run --source='.' manage.py test
coverage report

# Frontend coverage
npm run test:coverage
```

## 📦 Deployment

### Docker Deployment
```bash
# Build and run with Docker Compose
docker-compose up --build
```

### Production Deployment
1. Set up PostgreSQL database
2. Configure environment variables
3. Run database migrations
4. Collect static files
5. Set up reverse proxy (Nginx)
6. Configure SSL certificates
7. Set up monitoring and logging

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is proprietary to Ghana National Petroleum Corporation (GNPC). All rights reserved.

## 📞 Support

For technical support or questions:
- **Email**: hr@gnpcghana.com
- **Phone**: +233 (0) 302 666 000
- **Address**: GNPC Towers, Tetteh Quarshie Interchange, Accra

## 🏆 Acknowledgments

- **Ghana National Petroleum Corporation** - For the opportunity to modernize NSP management
- **National Service Scheme** - For their collaboration and requirements input
- **Development Team** - For implementing this comprehensive solution

---

**Built with ❤️ for GNPC and Ghana's National Service Personnel**

*Transforming NSP management through digital innovation*