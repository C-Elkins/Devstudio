# DevStudio Portfolio# DevStudio - Modern Full-Stack Portfolio Website



A comprehensive full-stack development environment with integrated service management.**Author:** [C-Elkins](https://github.com/C-Elkins)



## 🚀 Quick Start🚀 **A stunning, professional full-stack website built with React, Node.js, and MongoDB**



```bashThis is a complete portfolio/agency website with modern design, glassmorphism effects, smooth animations, and a fully functional admin dashboard. Perfect for showcasing your development work and managing client inquiries.

# 1. Setup (one time)

./scripts/setup/setup-project.sh## 🎛️ **DevStudio Control Center**



# 2. Start everything  **NEW:** Modern React+Material-UI control center for managing all DevStudio services!

./scripts/services/start-all.sh

### Quick Start - GUI

# 3. Open Control Center

# Visit: http://localhost:5173Launch the sleek new control center with one command:

```

```bash

## 📁 Project Structure# Using npm script (recommended)

npm run gui

```

📁 devstudio-portfolio/# Or using the bash script

├── 📁 backend/           # Main backend API (Node.js + MongoDB)./start-gui.sh

├── 📁 frontend/          # Main frontend app (React)```

├── 📁 control-center/    # Service management GUI (React + API)

├── 📁 scripts/           # All automation scriptsThe GUI provides:

│   ├── 📁 services/      # Service start/stop scripts- **Service Management**: Start/stop backend, frontend, and database with visual indicators

│   ├── 📁 setup/         # Project setup scripts- **Git Integration**: Status, pull, and push controls in the toolbar

│   └── 📁 legacy/        # Legacy scripts (archived)- **System Logs**: Real-time monitoring and debugging

├── 📁 docs/              # All documentation- **Quick Actions**: Launch VS Code, Finder, browser, and settings

├── 📁 config/            # Configuration files- **Modern Design**: Material-UI components with professional styling

└── 📁 apps/              # Additional applications

```### Alternative Launch Methods



## 🎛️ Service Management```bash

# Install dependencies for all apps

**Control Center**: http://localhost:5173 ← Start here!npm run install:all



The Control Center provides a unified interface to manage all services:# Start just the GUI

- Start/stop any service with one clicknpm run gui

- Real-time service status monitoring  

- System logs and debugging tools# Install GUI dependencies separately

- Git repository informationnpm run gui:install



### Service Ports# Use the legacy Electron GUI (if needed)

- **Control Center GUI**: 5173npm run old-gui

- **Control Center API**: 3001  ```

- **Frontend App**: 3000

- **Backend API**: 5002## ✨ Features

- **MongoDB**: 27017

### 🎨 **Frontend**

## 📋 Available Scripts

- **Modern Design**: Glassmorphism effects, gradient backgrounds, smooth animations

### Quick Commands- **Fully Responsive**: Works perfectly on desktop, tablet, and mobile

```bash- **Interactive Elements**: Hover effects, transitions, animated components

./scripts/services/start-all.sh      # Start complete environment- **Contact Form**: Enhanced form with project type, budget, timeline fields

./scripts/services/start-api.sh      # Control Center API only- **Portfolio Showcase**: Project gallery with modern card layouts

./scripts/services/start-gui.sh      # Control Center GUI only  - **Testimonials**: Client feedback section

./scripts/setup/setup-project.sh     # Project setup- **Performance Optimized**: Fast loading, efficient animations

```

### 🔧 **Backend API**

### Individual Services

```bash- **Contact Management**: Store and manage all contact form submissions

./scripts/services/start-backend.sh   # Main backend- **Email Integration**: Automatic email notifications for new contacts

./scripts/services/start-frontend.sh  # Main frontend  - **Rate Limiting**: Protection against spam and abuse

./scripts/services/start-database.sh  # MongoDB- **Input Validation**: Comprehensive form validation and sanitization

```- **MongoDB Integration**: Persistent data storage

- **Admin Statistics**: Contact analytics and reporting

## 📚 Documentation

## � Secret Admin Path (Portfolio Security)

- **[Setup Guide](docs/SETUP-GUIDE.md)** - Comprehensive setup and usage

- **[Security Audit](docs/SECURITY_AUDIT.md)** - Security considerations  **As of September 2025, this project uses a secret admin path for demo/portfolio security.**

- **[Contributing](docs/CONTRIBUTING.md)** - Development guidelines

- **[Project Structure](docs/PROJECT_STRUCTURE.md)** - Detailed architecture- The previous invite token system (see `backend/models/InviteToken.js`) has been fully removed for simplicity and demo-friendliness.

- Admin access is now protected by a secret path (e.g., `/admin-PORTFOLIO2025`). Only users who know this path can access the admin login screen.

## 🐛 Troubleshooting- All invite-related endpoints, models, and UI have been deleted.

- This approach is ideal for portfolio/demo use—just share the secret path with trusted viewers.

**API Server Won't Start Back Up?**

```bash**To change the secret path:**

cd control-center && node server.jsEdit the `REACT_APP_ADMIN_PATH` in your frontend environment or update the path in `App.jsx` as needed.

```

**Note:** For real production use, always combine this with strong authentication and consider additional access controls.

**Port Already in Use?**

```bash- **Comprehensive Overview**: Stats, recent contacts, system status

lsof -ti :PORT | xargs kill -9  # Replace PORT with actual port number- **Contact Management**: View, search, filter, and respond to inquiries

```- **Project Management**: Manage portfolio projects

- **Analytics**: Visual charts and trends

**Need Help?** Check the [Setup Guide](docs/SETUP-GUIDE.md) for detailed instructions.- **Settings Panel**: System configuration and maintenance

- **Real-time Updates**: Live data synchronization

## 🎯 Key Features

## 🛠️ Tech Stack

- 🎛️ **Unified Control Center** - Manage all services from one interface

- 🚀 **One-Command Setup** - Get running in minutes  - **Frontend**: React 18, Tailwind CSS, Lucide Icons

- 📊 **Real-time Monitoring** - Live service status updates- **Backend**: Node.js, Express.js, MongoDB, Mongoose

- 🔧 **Easy Development** - Hot reload, logging, debugging tools- **Security**: Helmet, CORS, Rate Limiting, Input Validation

- 📚 **Great Documentation** - Everything is explained- **Email**: Nodemailer with SMTP support

- 🧹 **Clean Organization** - Logical, maintainable structure- **Development**: Nodemon, ES6+, Modern JavaScript



---## 🚀 Quick Start



**Get started in 30 seconds:** `./scripts/services/start-all.sh` → http://localhost:5173### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- Git

### Installation

1. **Clone the repository**

   ```bash
   git clone <your-repo-url>
   cd Testing\ Grounds
   ```

2. **Run the setup script**

   ```bash
   chmod +x setup.sh
   ./setup.sh
   ```

3. **Configure environment variables**

   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start MongoDB**

   ```bash
   mongod
   ```

5. **Start the backend**

   ```bash
   cd backend
   npm run dev
   ```

6. **Start the frontend**

   ```bash
   cd frontend
   npm start
   ```

## 🖥️ Opening the Desktop GUI

To launch the DevStudio Electron GUI from the root directory:

```
npm run gui
```

This will open the modern desktop GUI for managing your backend, frontend, and database services.

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# Backend Configuration
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/devstudio
CLIENT_URL=http://localhost:3000

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=hello@devstudio.com
ADMIN_EMAIL=admin@devstudio.com

# Security
JWT_SECRET=your-super-secret-jwt-key-here
BCRYPT_ROUNDS=10
```

### Email Setup

1. **Gmail Setup** (recommended):
   - Enable 2-factor authentication
   - Generate an App Password
   - Use the App Password in `EMAIL_PASS`

2. **Other SMTP providers**:
   - Update `SMTP_HOST` and `SMTP_PORT`
   - Configure authentication credentials

## 📱 Usage

### Public Website

- Visit `http://localhost:3000`
- Browse the portfolio sections
- Submit contact forms
- View projects and testimonials

### Admin Dashboard

- Click "Admin Login" in the contact section
- **Demo Credentials**:
  - Username: `admin`
  - Password: `admin123`
- Manage contacts, projects, and view analytics

### API Endpoints

```http
POST /api/contact          - Submit contact form
GET  /api/contact          - Get all contacts (admin)
GET  /api/contact/stats    - Get contact statistics
PUT  /api/contact/:id/respond - Mark contact as responded

GET  /api/projects         - Get all projects
GET  /api/testimonials     - Get all testimonials
GET  /api/health          - Health check
```

## 🚢 Deployment

### Frontend (Netlify/Vercel)

1. Build the React app: `npm run build`
2. Deploy the `build` folder
3. Configure environment variables

### Backend (Heroku/Railway/DigitalOcean)

1. Push to your Git repository
2. Configure environment variables
3. Ensure MongoDB connection

### Database (MongoDB Atlas)

1. Create a MongoDB Atlas cluster
2. Update `MONGODB_URI` in environment variables
3. Configure IP whitelist and user permissions

## 📁 Project Structure

```text
Testing Grounds/
├── backend/                 # Node.js API server
│   ├── config/             # Database configuration
│   ├── models/             # MongoDB schemas
│   ├── routes/             # API endpoints
│   ├── server.js           # Express app setup
│   └── package.json
├── frontend/               # React application
│   ├── src/
│   ├── public/
│   └── package.json
├── .env                   # Environment variables
├── README.md              # This file
├── setup.sh              # Quick setup script
└── package.json          # Root package.json
```

## 🔒 Security Features

- **Rate Limiting**: Prevents spam and DDoS attacks
- **Input Validation**: Comprehensive form validation
- **CORS Configuration**: Controlled cross-origin requests
- **Helmet**: Security headers protection
- **Email Sanitization**: Clean and safe email handling
- **Environment Variables**: Secure configuration management

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running: `mongod`
   - Check connection string in `.env`

2. **Email Not Sending**
   - Verify SMTP credentials
   - Check Gmail App Password setup
   - Review firewall settings

3. **CORS Errors**
   - Verify `CLIENT_URL` in backend `.env`
   - Check frontend API base URL

4. **Port Conflicts**
   - Change `PORT` in `.env`
   - Ensure ports 3000 and 5000 are available

## 📄 License

MIT License - see LICENSE file for details

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📧 Support

For questions or support, please contact:

- Email: <hello@devstudio.com>
- GitHub Issues: [Create an issue](https://github.com/your-username/your-repo/issues/new)

## 🙋 About the Author

Created and maintained by [Chase Elkins](https://github.com/C-Elkins).

Feel free to connect, open issues, or contribute

---

### Built with ❤️ for modern web development

## 🚀 Features

### Frontend Features

- **Modern React Architecture** - Hooks-based components with clean state management
- **Stunning UI/UX** - Glassmorphism design with smooth animations
- **Responsive Design** - Mobile-first approach that works on all devices
- **Interactive Elements** - Hover effects, transitions, and micro-interactions
- **Real-time Form Validation** - Client-side validation with error handling

### Backend API

- **Express.js API** - RESTful endpoints with proper error handling
- **MongoDB Integration** - Mongoose ODM with schema validation
- **Email Integration** - Nodemailer for contact form notifications
- **Security Features** - Helmet, CORS, rate limiting
- **Input Validation** - Express-validator for robust data validation

### Key Sections

- **Hero Section** - Eye-catching landing with animated elements
- **About Section** - Company info with animated statistics
- **Projects Showcase** - Featured work with filtering and status indicators
- **Testimonials** - Client feedback with star ratings
- **Contact Form** - Full-featured contact system with email notifications

## 🛠 Tech Stack

### Frontend

- React 18
- Tailwind CSS
- Lucide React (icons)
- Axios (API calls)

### Backend

- Node.js
- Express.js
- MongoDB with Mongoose
- Nodemailer
- Express Validator
- Helmet (security)
- CORS
- Rate Limiting

## 📦 Installation

### Backend Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- Git

### Backend Setup

1. **Clone the repository**

```bash
git clone <repository-url>
cd "Testing Grounds"
```

1. **Install backend dependencies**

```bash
cd backend
npm install
```

1. **Environment Configuration**

```bash
# Edit .env with your configuration
# The .env file is already created with default values
```

1. **Start MongoDB**

```bash
# If using local MongoDB
mongod

# Or use MongoDB Atlas cloud service
```

1. **Run the backend server**

```bash
# Development mode
npm run dev

# Production mode
npm start
```

Backend will be running on `http://localhost:5000`

### Frontend Setup

1. **Install frontend dependencies**

```bash
cd ../frontend
npm install
```

1. **Start the React development server**

```bash
npm start
```

Frontend will be running on `http://localhost:3000`

## 🌐 API Endpoints

### Projects

- `GET /api/projects` - Get all projects with filtering
- `GET /api/projects/featured` - Get featured projects
- `GET /api/projects/:id` - Get single project
- `POST /api/projects` - Create new project (admin)

### Contact

- `POST /api/contact` - Submit contact form
- `GET /api/contact` - Get all contacts (admin)
- `GET /api/contact/stats` - Get contact statistics

### Testimonials

- `GET /api/testimonials` - Get all testimonials
- `GET /api/testimonials/featured` - Get featured testimonials
- `POST /api/testimonials` - Create testimonial (admin)

## 🎨 Design Features

- **Glassmorphism Effects** - Modern blur and transparency effects
- **Gradient Animations** - Smooth color transitions
- **Hover Interactions** - Engaging micro-interactions
- **Mobile Responsive** - Looks great on all screen sizes
- **Dark Theme** - Modern dark color scheme
- **Custom Scrollbar** - Styled scrollbar matching the theme

## 🔧 Configuration (Models & Deployment)

### Database Models

**Project Schema:**

- title, description, technologies
- image, liveUrl, githubUrl
- status, featured, category
- timestamps and virtual fields

**Contact Schema:**

- name, email, message, phone
- projectType, budget, timeline
- status, priority, source
- response tracking

### Email Setup (Deployment)

Configure SMTP settings in `.env`:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

## 📱 Mobile Features

- Hamburger navigation menu
- Touch-friendly interactions
- Responsive grid layouts
- Optimized images and loading states
- Mobile-optimized forms

## 🚀 Deployment

### Frontend (Deployment - Netlify/Vercel)

```bash
cd frontend
npm run build
# Deploy the 'build' folder
```

### Backend (Deployment - Heroku/Railway/DigitalOcean)

```bash
# Set environment variables
# Deploy with your preferred service
```

### Database (MongoDB Atlas - Deployment)

- Create cluster on MongoDB Atlas
- Update MONGODB_URI in environment variables
- Configure network access and database users

## 🔐 Security Features

- Input validation and sanitization
- Rate limiting to prevent abuse
- CORS configuration
- Helmet for security headers
- Environment variable protection

## 📊 Performance Optimizations

- Image lazy loading
- API response caching
- Optimized database queries
- Compressed assets
- CDN integration ready

## 🧪 Testing

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

## 🤝 Contributing (How to)

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License (Details)

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Team

Built with ❤️ by the DevStudio team

## 📞 Support

For support, email <hello@devstudio.com> or join our Slack channel.

---

**Note:** This is a complete full-stack application ready for production use. Make sure to configure all environment variables and security settings before deploying to production.
