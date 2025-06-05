# PhotoStudio - Professional Photography & Videography Website

A modern, responsive portfolio website for professional photography and videography services with a complete booking system, payment integration, and admin panel.

## 🌟 Features

### Frontend Features
- **Responsive Design**: Beautiful, modern UI that works on all devices
- **Portfolio Gallery**: Filterable image and video gallery with lightbox
- **Service Packages**: Detailed service listings with pricing in INR
- **Booking System**: Multi-step booking process with date selection
- **Payment Integration**: Razorpay payment gateway integration
- **User Authentication**: Login/signup for booking services
- **Contact Forms**: Multiple contact forms with validation
- **Smooth Animations**: Framer Motion animations throughout
- **SEO Optimized**: Meta tags and structured data

### Admin Panel Features
- **Dashboard**: Overview of bookings, revenue, and statistics
- **Content Management**: Edit all website content dynamically
- **Portfolio Management**: Upload and manage images/videos
- **Service Management**: Create and edit service packages
- **Booking Management**: View and manage client bookings
- **User Management**: Manage registered users
- **Analytics**: Website traffic and performance metrics
- **Settings**: Site configuration and admin password change

### Backend Features
- **Secure Authentication**: JWT-based authentication
- **Payment Processing**: Razorpay integration for secure payments
- **Email Notifications**: Automated booking confirmations
- **File Upload**: Secure image and video upload system
- **Database Management**: Comprehensive MySQL database schema
- **API Endpoints**: RESTful API for all operations

## 🛠️ Technology Stack

### Frontend
- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **Framer Motion**: Animation library
- **Heroicons**: Beautiful SVG icons
- **React Hook Form**: Form handling and validation
- **React Hot Toast**: Toast notifications

### Backend
- **PHP**: Server-side scripting
- **MySQL**: Relational database
- **Razorpay**: Payment gateway
- **JWT**: JSON Web Tokens for authentication
- **PHPMailer**: Email sending

## 📋 Prerequisites

- Node.js 18+ and npm/yarn
- PHP 8.0+
- MySQL 8.0+
- Web server (Apache/Nginx)
- Razorpay account for payments

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd photostudio-website
```

### 2. Frontend Setup
```bash
# Install dependencies
npm install

# Create environment file
cp .env.example .env.local

# Update environment variables
# NEXT_PUBLIC_API_URL=http://localhost/api
# NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key_id
```

### 3. Database Setup

```sql
-- For production (rideie.in)
mysql -u u918308740_sridurga -p u918308740_sridurga < database.sql

-- For local development
CREATE DATABASE photostudio_db;
mysql -u username -p photostudio_db < database.sql
```

### 4. Backend Configuration
```php
// Create config/database.php
<?php
$host = 'localhost';
$dbname = 'photostudio_db';
$username = 'your_db_username';
$password = 'your_db_password';

// Update Razorpay credentials in website_settings table
// Update SMTP settings for email notifications
```

### 5. Run the Application
```bash
# Development mode
npm run dev

# Production build
npm run build
npm start
```

## 🔧 Configuration

### Admin Access
- **URL**: `http://yoursite.com/admin`
- **Default Username**: `admin`
- **Default Password**: `admin123`
- **⚠️ Change the password immediately after first login**

### Payment Gateway Setup
1. Create a Razorpay account at [razorpay.com](https://razorpay.com)
2. Get your API Key ID and Secret
3. Update the credentials in the admin settings panel
4. Test with Razorpay test mode before going live

### Email Configuration
1. Configure SMTP settings in the admin panel
2. Update email templates as needed
3. Test email delivery for booking confirmations

## 📁 Project Structure

```
photostudio-website/
├── app/                    # Next.js app directory
│   ├── admin/             # Admin panel pages
│   ├── booking/           # Booking system
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── About.tsx
│   ├── Contact.tsx
│   ├── Footer.tsx
│   ├── Header.tsx
│   ├── Hero.tsx
│   ├── LoadingSpinner.tsx
│   ├── Portfolio.tsx
│   └── Services.tsx
├── public/               # Static assets
├── api/                  # PHP backend (deploy separately)
├── database.sql          # Database schema
├── tailwind.config.js    # Tailwind configuration
├── next.config.js        # Next.js configuration
└── package.json          # Dependencies
```

## 🎨 Customization

### Styling
- Edit `tailwind.config.js` for theme customization
- Update colors, fonts, and spacing in the config
- Modify component styles in individual files

### Content
- All content is editable through the admin panel
- Update hero section, about page, contact info
- Add/remove portfolio items and services

### Features
- Add new service categories in the database
- Customize booking form fields
- Modify email templates
- Add new admin panel sections

## 🔒 Security Features

- **Input Validation**: All forms have client and server-side validation
- **SQL Injection Protection**: Prepared statements used throughout
- **XSS Protection**: Input sanitization and output encoding
- **CSRF Protection**: Token-based form protection
- **Secure File Upload**: File type and size validation
- **Password Hashing**: Bcrypt for secure password storage
- **JWT Authentication**: Secure token-based authentication

## 📱 Responsive Design

- **Mobile First**: Designed for mobile devices first
- **Tablet Optimized**: Perfect layout for tablets
- **Desktop Enhanced**: Rich experience on larger screens
- **Touch Friendly**: Optimized for touch interactions

## 🚀 Deployment

### Frontend Deployment (Vercel/Netlify)
```bash
# Build the project
npm run build

# Deploy to Vercel
npx vercel

# Or deploy to Netlify
npm run build && netlify deploy --prod --dir=out
```

### Backend Deployment (cPanel/VPS)
1. Upload PHP files to your web server
2. Import database.sql to your MySQL database
3. Update database connection settings
4. Configure web server (Apache/Nginx)
5. Set up SSL certificate
6. Configure cron jobs for maintenance tasks

### Environment Variables
```env
# Production Configuration (rideie.in)
DB_HOST=localhost
DB_NAME=u918308740_sridurga
DB_USER=u918308740_sridurga
DB_PASSWORD=Johnme@2580
NEXT_PUBLIC_API_URL=https://rideie.in/api
NEXT_PUBLIC_SITE_URL=https://rideie.in
NEXTAUTH_URL=https://rideie.in
NEXTAUTH_SECRET=rideie-nextauth-secret-2024-production
JWT_SECRET=rideie-jwt-secret-2024-production
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxx
RAZORPAY_KEY_SECRET=your_secret_key

# Local Development
# DB_HOST=localhost
# DB_NAME=photostudio_db
# DB_USER=username
# DB_PASSWORD=password
# NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

## 📊 Analytics & Monitoring

- **Google Analytics**: Add tracking ID in admin settings
- **Facebook Pixel**: Configure for social media tracking
- **Performance Monitoring**: Built-in analytics dashboard
- **Error Logging**: Comprehensive error tracking

## 🔧 Maintenance

### Regular Tasks
- **Database Backup**: Schedule regular backups
- **Log Cleanup**: Clean old activity logs
- **Security Updates**: Keep dependencies updated
- **Performance Monitoring**: Monitor site speed and uptime

### Troubleshooting
- Check browser console for JavaScript errors
- Verify database connection settings
- Ensure proper file permissions
- Check server error logs

## 📞 Support

### Common Issues
1. **Payment Gateway Errors**: Verify Razorpay credentials
2. **Email Not Sending**: Check SMTP configuration
3. **Image Upload Issues**: Verify file permissions
4. **Database Connection**: Check credentials and server status

### Getting Help
- Check the documentation thoroughly
- Review error logs for specific issues
- Test in a staging environment first
- Contact support with detailed error information

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 🙏 Acknowledgments

- **Unsplash**: For beautiful stock photography
- **Heroicons**: For the icon set
- **Tailwind CSS**: For the utility-first CSS framework
- **Framer Motion**: For smooth animations
- **Razorpay**: For payment processing

---

**Built with ❤️ for photographers and videographers worldwide**

For more information or support, please contact the development team.