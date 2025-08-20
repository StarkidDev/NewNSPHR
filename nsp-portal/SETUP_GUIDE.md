# 🚀 NSP Portal - Complete Setup Guide

## Prerequisites

### Required Software
1. **Python 3.9+** - [Download from python.org](https://www.python.org/downloads/)
2. **Node.js 16+** - [Download from nodejs.org](https://nodejs.org/en/download/)
3. **PostgreSQL 13+** - [Download from postgresql.org](https://www.postgresql.org/download/)
4. **Git** - [Download from git-scm.com](https://git-scm.com/downloads)

### For Windows Users
- Use **PowerShell** or **Command Prompt** as Administrator
- Alternatively, use **Git Bash** for Unix-like commands

## 📥 Clone the Repository

```bash
git clone https://github.com/StarkidDev/NewNSPHR.git
cd NewNSPHR/nsp-portal
```

## 🗄️ Database Setup

### 1. Install and Start PostgreSQL
```bash
# Start PostgreSQL service (Windows)
net start postgresql-x64-13

# Or use pgAdmin GUI to start the service
```

### 2. Create Database and User
```sql
-- Connect to PostgreSQL as superuser
psql -U postgres

-- Create database
CREATE DATABASE nsp_portal_db;

-- Create user
CREATE USER nsp_user WITH PASSWORD 'nsp_password';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE nsp_portal_db TO nsp_user;
GRANT CREATE ON SCHEMA public TO nsp_user;
GRANT USAGE ON SCHEMA public TO nsp_user;

-- Exit PostgreSQL
\q
```

## 🐍 Backend Setup

### 1. Navigate to Backend Directory
```bash
cd backend
```

### 2. Create Virtual Environment
```bash
# Windows PowerShell/CMD
python -m venv venv
venv\Scripts\activate

# Windows Git Bash / Linux / macOS
python -m venv venv
source venv/bin/activate
```

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

### 4. Set Up Environment Variables
```bash
# Windows PowerShell/CMD
copy .env.example .env

# Windows Git Bash / Linux / macOS
cp .env.example .env
```

### 5. Edit Environment File
Open `.env` file and update the following values:

```env
# Change this to a secure secret key
SECRET_KEY=your-very-secure-secret-key-here-change-this-in-production

# Database settings (update if different)
DB_NAME=nsp_portal_db
DB_USER=nsp_user
DB_PASSWORD=nsp_password
DB_HOST=localhost
DB_PORT=5432

# Update paths to your actual project location
MEDIA_ROOT=C:/path/to/your/project/nsp-portal/backend/media/
STATIC_ROOT=C:/path/to/your/project/nsp-portal/backend/staticfiles/

# Email settings (optional for development)
EMAIL_BACKEND=django.core.mail.backends.console.EmailBackend
# For production, use SMTP:
# EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
# EMAIL_HOST=your-smtp-server.com
# EMAIL_HOST_USER=your-email@domain.com
# EMAIL_HOST_PASSWORD=your-email-password
```

### 6. Run Database Migrations
```bash
python manage.py migrate
```

### 7. Create Superuser
```bash
python manage.py createsuperuser
```

### 8. Create Required Directories
```bash
# Windows PowerShell/CMD
mkdir media
mkdir staticfiles
mkdir logs

# Windows Git Bash / Linux / macOS
mkdir -p media staticfiles logs
```

### 9. Start Backend Server
```bash
python manage.py runserver
```

The backend will be available at: **http://localhost:8000**

## ⚛️ Frontend Setup

### 1. Open New Terminal/Command Prompt
Keep the backend server running and open a new terminal.

### 2. Navigate to Frontend Directory
```bash
cd frontend
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Set Up Environment Variables
```bash
# Windows PowerShell/CMD
copy .env.example .env

# Windows Git Bash / Linux / macOS
cp .env.example .env
```

### 5. Edit Frontend Environment File
Open `frontend/.env` and verify:

```env
REACT_APP_API_URL=http://localhost:8000/api
GENERATE_SOURCEMAP=false
```

### 6. Start Frontend Server
```bash
npm start
```

The frontend will be available at: **http://localhost:3000**

## 🧪 Testing the Application

### 1. Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000/api
- **Django Admin**: http://localhost:8000/admin

### 2. Test Public Features
1. Visit the homepage
2. Try submitting an appointment application
3. Check application status using the email

### 3. Test Admin Features
1. Login to Django Admin with your superuser credentials
2. Create test users with different roles (NSP, HR, Supervisor)
3. Test the API endpoints

## 🐛 Troubleshooting

### Common Issues

#### 1. PostgreSQL Connection Error
```
django.db.utils.OperationalError: could not connect to server
```
**Solution**: 
- Ensure PostgreSQL service is running
- Check database credentials in `.env`
- Verify database and user exist

#### 2. Python Module Not Found
```
ModuleNotFoundError: No module named 'django'
```
**Solution**: 
- Ensure virtual environment is activated
- Run `pip install -r requirements.txt`

#### 3. Node.js Dependencies Error
```
npm ERR! peer dep missing
```
**Solution**: 
- Delete `node_modules` folder
- Run `npm install` again

#### 4. Port Already in Use
```
Error: That port is already in use
```
**Solution**: 
- Kill the process using the port
- Use different ports: `python manage.py runserver 8001`

#### 5. Permission Denied (PostgreSQL)
```
permission denied for schema public
```
**Solution**: 
```sql
GRANT CREATE ON SCHEMA public TO nsp_user;
GRANT USAGE ON SCHEMA public TO nsp_user;
```

### Windows-Specific Issues

#### Virtual Environment Activation
If `venv\Scripts\activate` doesn't work:
```bash
# Try this instead
venv\Scripts\Activate.ps1

# Or use full path
C:\path\to\your\project\backend\venv\Scripts\activate
```

#### Path Issues
Use forward slashes `/` or double backslashes `\\` in paths:
```env
MEDIA_ROOT=C:/Users/YourName/project/backend/media/
# OR
MEDIA_ROOT=C:\\Users\\YourName\\project\\backend\\media\\
```

## 🚀 Production Deployment

### Environment Variables for Production
```env
DEBUG=False
SECRET_KEY=your-super-secure-production-key
ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
```

### Static Files Collection
```bash
python manage.py collectstatic
```

### Frontend Build
```bash
cd frontend
npm run build
```

## 📞 Support

If you encounter issues:

1. **Check the logs** in the terminal for error messages
2. **Verify all prerequisites** are installed correctly
3. **Ensure all services are running** (PostgreSQL, Django, React)
4. **Check environment variables** are set correctly

For additional help:
- **Email**: hr@gnpcghana.com
- **Phone**: +233 (0) 302 666 000

## ✅ Success Checklist

- [ ] PostgreSQL installed and running
- [ ] Database `nsp_portal_db` created
- [ ] User `nsp_user` created with proper permissions
- [ ] Python virtual environment activated
- [ ] All Python dependencies installed
- [ ] Environment variables configured
- [ ] Database migrations completed
- [ ] Superuser created
- [ ] Backend server running on port 8000
- [ ] Node.js dependencies installed
- [ ] Frontend server running on port 3000
- [ ] Can access homepage at localhost:3000
- [ ] Can access admin panel at localhost:8000/admin

**🎉 Once all items are checked, your NSP Portal is ready to use!**