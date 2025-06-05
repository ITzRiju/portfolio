# Production Deployment Guide

## Server Configuration

### Database Details
- **Database Name**: u918308740_sridurga
- **Database Username**: u918308740_sridurga
- **Database Password**: Johnme@2580
- **Site URL**: https://rideie.in
- **Admin URL**: https://rideie.in/admin

## Pre-Deployment Steps

### 1. Database Setup
1. Import the `database.sql` file to your MySQL database:
   ```sql
   mysql -u u918308740_sridurga -p u918308740_sridurga < database.sql
   ```

2. Verify database connection and tables are created properly.

### 2. Environment Variables
The `.env.local` file has been configured with production settings. Ensure these environment variables are set on your server:

```bash
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_NAME=u918308740_sridurga
DB_USER=u918308740_sridurga
DB_PASSWORD=Johnme@2580

# Site Configuration
NEXT_PUBLIC_API_URL=https://rideie.in/api
NEXT_PUBLIC_SITE_URL=https://rideie.in
NEXTAUTH_URL=https://rideie.in

# Admin Configuration
ADMIN_EMAIL=admin@rideie.in
ADMIN_PASSWORD=admin123
JWT_SECRET=rideie-jwt-secret-2024-production
NEXTAUTH_SECRET=rideie-nextauth-secret-2024-production
```

### 3. Build for Production
```bash
npm install
npm run build
npm start
```

## Deployment Steps

### 1. Upload Files
1. Upload all project files to your server's web directory
2. Ensure `.env.local` is uploaded and contains the production configuration
3. Make sure `node_modules` is excluded (will be installed on server)

### 2. Server Setup
1. Install Node.js (version 18 or higher)
2. Install dependencies:
   ```bash
   npm install
   ```
3. Build the application:
   ```bash
   npm run build
   ```
4. Start the production server:
   ```bash
   npm start
   ```

### 3. Web Server Configuration
If using Apache/Nginx, configure reverse proxy to point to the Next.js application running on port 3000.

#### Nginx Configuration Example:
```nginx
server {
    listen 80;
    server_name rideie.in www.rideie.in;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 4. SSL Certificate
Ensure SSL certificate is properly configured for HTTPS access.

## Post-Deployment Checklist

- [ ] Database connection is working
- [ ] Admin panel is accessible at https://rideie.in/admin
- [ ] Default admin credentials work (admin@rideie.in / admin123)
- [ ] Image uploads are working
- [ ] Contact forms are functional
- [ ] Booking system is operational
- [ ] All pages load without errors
- [ ] Mobile responsiveness is working

## Security Recommendations

1. **Change Default Admin Password**: Immediately change the default admin password after first login
2. **Update JWT Secrets**: Use strong, unique secrets for production
3. **Configure SMTP**: Set up proper email configuration for contact forms and notifications
4. **Regular Backups**: Schedule regular database backups
5. **Monitor Logs**: Set up logging and monitoring for the application

## Troubleshooting

### Common Issues:
1. **Database Connection Error**: Verify database credentials and server connectivity
2. **404 Errors**: Check web server configuration and routing
3. **Image Upload Issues**: Verify file permissions and upload directory
4. **Email Not Working**: Configure SMTP settings in environment variables

### Log Files:
- Application logs: Check server console output
- Web server logs: Check Apache/Nginx error logs
- Database logs: Check MySQL error logs

## Support

For technical support or issues:
1. Check the troubleshooting section above
2. Verify all environment variables are correctly set
3. Ensure all dependencies are installed
4. Check server logs for specific error messages

---

**Note**: This application is now configured for production deployment on rideie.in with the specified database credentials.