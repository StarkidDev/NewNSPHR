# NSP Portal and Management System for GNPC

A comprehensive digital platform designed to streamline and modernize National Service Personnel (NSP) management processes at Ghana National Petroleum Corporation (GNPC).

## Project Overview

This system transforms the manual, paper-based NSP appointment process into a modern, efficient digital workflow that improves communication, transparency, and document management between GNPC HR, supervisors, and NSPs.

## Key Features

### For NSPs (National Service Personnel)
- Upload NSS appointment letters without prior login
- Check approval status using email
- Receive automated email notifications
- Submit monthly reports and evaluations
- Digital permission/off-duty requests
- File complaints and track responses
- Access announcements and policy documents

### For HR (Human Resources)
- Review and approve/decline NSP submissions
- Generate official GNPC appointment letters
- Manage digital permission requests
- Maintain NSP records archive
- Send announcements and communications

### For Supervisors
- Review and evaluate assigned NSPs
- Receive monthly report notifications
- Access performance dashboards
- Submit feedback reports

## Tech Stack

### Backend
- **Framework**: Django (Python)
- **Database**: PostgreSQL
- **Authentication**: Django REST Framework with JWT
- **Email**: Django Email Backend with SMTP

### Frontend
- **Framework**: React.js
- **State Management**: Redux Toolkit
- **UI Library**: Material-UI
- **HTTP Client**: Axios

### Infrastructure
- **Deployment**: Docker containers
- **Web Server**: Nginx
- **Process Manager**: Gunicorn

## Project Structure

```
nsp-portal/
├── backend/                 # Django backend application
│   ├── apps/               # Django apps
│   │   ├── accounts/       # User management and authentication
│   │   ├── appointments/   # NSP appointment workflows
│   │   ├── permissions/    # Permission request system
│   │   ├── reports/        # Monthly reports and evaluations
│   │   ├── communications/ # Announcements and messaging
│   │   └── core/          # Shared utilities and base classes
│   ├── config/            # Django settings and configuration
│   └── requirements.txt   # Python dependencies
├── frontend/              # React.js frontend application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API service layers
│   │   ├── store/         # Redux store configuration
│   │   └── utils/         # Utility functions
│   └── package.json       # Node.js dependencies
├── docker/                # Docker configuration files
├── docs/                  # Project documentation
└── scripts/               # Deployment and utility scripts
```

## Installation & Setup

### Prerequisites
- Python 3.9+
- Node.js 16+
- PostgreSQL 13+
- Docker & Docker Compose (optional)

### Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

### Frontend Setup
```bash
cd frontend
npm install
npm start
```

### Using Docker
```bash
docker-compose up --build
```

## Development Phases

1. **Phase 1**: Core backend models and authentication
2. **Phase 2**: Appointment submission and approval workflows
3. **Phase 3**: Frontend development and integration
4. **Phase 4**: Permission request and communication modules
5. **Phase 5**: Reporting and evaluation system
6. **Phase 6**: Testing, security, and deployment

## Contributing

This project is developed for GNPC's National Service Personnel management. Please follow the coding standards and submit pull requests for review.

## License

Proprietary - Ghana National Petroleum Corporation (GNPC)