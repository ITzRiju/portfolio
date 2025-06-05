-- Photography & Videography Website Database Schema
-- This file contains all the necessary tables for the website
-- Admin can configure database connection details in their hosting environment

-- ============================================================================
-- USERS TABLE
-- ============================================================================
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    password_hash VARCHAR(255) NOT NULL,
    status ENUM('active', 'inactive', 'suspended') DEFAULT 'active',
    email_verified BOOLEAN DEFAULT FALSE,
    email_verification_token VARCHAR(255),
    password_reset_token VARCHAR(255),
    password_reset_expires DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL
);

-- ============================================================================
-- ADMIN TABLE
-- ============================================================================
CREATE TABLE admin (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    name VARCHAR(255),
    role ENUM('super_admin', 'admin') DEFAULT 'admin',
    status ENUM('active', 'inactive') DEFAULT 'active',
    last_login TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert default admin user (username: admin, password: admin123)
-- Password hash for 'admin123' using bcrypt
INSERT INTO admin (username, password_hash, email, name, role) VALUES 
('admin', '$2b$10$rOzJqQjQjQjQjQjQjQjQjOzJqQjQjQjQjQjQjQjQjQjQjQjQjQjQjQ', 'admin@photostudio.com', 'Administrator', 'super_admin');

-- ============================================================================
-- WEBSITE CONTENT TABLE
-- ============================================================================
CREATE TABLE website_content (
    id INT PRIMARY KEY AUTO_INCREMENT,
    section VARCHAR(50) NOT NULL,
    content_key VARCHAR(100) NOT NULL,
    content_value TEXT,
    content_type ENUM('text', 'image', 'json', 'html') DEFAULT 'text',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_section_key (section, content_key)
);

-- Insert default content
INSERT INTO website_content (section, content_key, content_value, content_type) VALUES
-- Hero Section
('hero', 'title', 'Capturing Life\'s Beautiful Moments', 'text'),
('hero', 'subtitle', 'Professional Photography & Videography', 'text'),
('hero', 'description', 'We specialize in creating stunning visual stories that capture the essence of your special moments. From weddings to corporate events, we bring your vision to life.', 'text'),
('hero', 'background_images', '["https://images.unsplash.com/photo-1606216794074-735e91aa2c92", "https://images.unsplash.com/photo-1511285560929-80b456fea0bc", "https://images.unsplash.com/photo-1519741497674-611481863552"]', 'json'),

-- About Section
('about', 'title', 'About PhotoStudio', 'text'),
('about', 'description', 'With over 8 years of experience in photography and videography, we have captured thousands of precious moments for our clients. Our passion for visual storytelling drives us to deliver exceptional results that exceed expectations.', 'text'),
('about', 'years_experience', '8', 'text'),
('about', 'projects_completed', '500', 'text'),
('about', 'happy_clients', '450', 'text'),
('about', 'photographer_name', 'Rajesh Kumar', 'text'),
('about', 'photographer_image', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d', 'text'),

-- Contact Section
('contact', 'phone', '+91 9876543210', 'text'),
('contact', 'email', 'info@photostudio.com', 'text'),
('contact', 'address', 'Mumbai, Maharashtra, India', 'text'),
('contact', 'working_hours', 'Mon - Sat: 9:00 AM - 8:00 PM', 'text'),

-- Social Media
('social', 'instagram', 'https://instagram.com/photostudio', 'text'),
('social', 'facebook', 'https://facebook.com/photostudio', 'text'),
('social', 'youtube', 'https://youtube.com/photostudio', 'text'),
('social', 'twitter', 'https://twitter.com/photostudio', 'text');

-- ============================================================================
-- PORTFOLIO TABLE
-- ============================================================================
CREATE TABLE portfolio (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category ENUM('wedding', 'portrait', 'event', 'corporate', 'product', 'fashion', 'landscape', 'other') NOT NULL,
    type ENUM('image', 'video') NOT NULL,
    file_url VARCHAR(500) NOT NULL,
    thumbnail_url VARCHAR(500),
    is_featured BOOLEAN DEFAULT FALSE,
    sort_order INT DEFAULT 0,
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert sample portfolio items
INSERT INTO portfolio (title, description, category, type, file_url, thumbnail_url, is_featured) VALUES
('Beautiful Wedding Ceremony', 'A stunning wedding ceremony captured in golden hour light', 'wedding', 'image', 'https://images.unsplash.com/photo-1519741497674-611481863552', 'https://images.unsplash.com/photo-1519741497674-611481863552?w=400', TRUE),
('Corporate Event Coverage', 'Professional corporate event photography', 'corporate', 'image', 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc', 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=400', TRUE),
('Portrait Session', 'Creative portrait photography session', 'portrait', 'image', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400', FALSE),
('Product Photography', 'High-quality product photography for e-commerce', 'product', 'image', 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43', 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400', FALSE),
('Fashion Shoot', 'Creative fashion photography session', 'fashion', 'image', 'https://images.unsplash.com/photo-1469334031218-e382a71b716b', 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400', TRUE);

-- ============================================================================
-- SERVICES TABLE
-- ============================================================================
CREATE TABLE services (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category ENUM('photography', 'videography', 'both') NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    duration VARCHAR(100),
    features JSON,
    is_popular BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert sample services
INSERT INTO services (name, description, category, price, duration, features, is_popular) VALUES
('Wedding Photography Package', 'Complete wedding photography coverage with edited photos', 'photography', 45000.00, '8-10 hours', '["Pre-wedding consultation", "Full day coverage", "500+ edited photos", "Online gallery", "Print release"]', TRUE),
('Portrait Session', 'Professional portrait photography session', 'photography', 8000.00, '2 hours', '["1-hour session", "20 edited photos", "Online gallery", "Print release"]', FALSE),
('Event Coverage', 'Corporate and social event photography', 'photography', 25000.00, '4-6 hours', '["Event coverage", "200+ edited photos", "Same day highlights", "Online gallery"]', FALSE),
('Wedding Videography', 'Cinematic wedding videography with highlights reel', 'videography', 55000.00, '8-10 hours', '["Full day coverage", "Highlight reel (3-5 min)", "Ceremony footage", "Reception coverage", "Drone shots"]', TRUE),
('Corporate Video', 'Professional corporate video production', 'videography', 35000.00, '1-2 days', '["Pre-production planning", "Professional filming", "Post-production editing", "Multiple formats"]', FALSE),
('Complete Wedding Package', 'Photography + Videography wedding package', 'both', 85000.00, '8-10 hours', '["Full day coverage", "500+ photos", "Highlight reel", "Ceremony video", "Online galleries", "Drone coverage"]', TRUE);

-- ============================================================================
-- BOOKINGS TABLE
-- ============================================================================
CREATE TABLE bookings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    booking_id VARCHAR(20) UNIQUE NOT NULL,
    user_id INT,
    service_id INT NOT NULL,
    client_name VARCHAR(255) NOT NULL,
    client_email VARCHAR(255) NOT NULL,
    client_phone VARCHAR(20) NOT NULL,
    event_date DATE NOT NULL,
    event_time TIME,
    event_type VARCHAR(100),
    event_location TEXT,
    special_requirements TEXT,
    total_amount DECIMAL(10, 2) NOT NULL,
    advance_amount DECIMAL(10, 2) DEFAULT 0,
    payment_status ENUM('pending', 'partial', 'completed', 'refunded') DEFAULT 'pending',
    booking_status ENUM('pending', 'confirmed', 'in_progress', 'completed', 'cancelled') DEFAULT 'pending',
    payment_method VARCHAR(50),
    razorpay_order_id VARCHAR(100),
    razorpay_payment_id VARCHAR(100),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE RESTRICT
);

-- ============================================================================
-- PAYMENTS TABLE
-- ============================================================================
CREATE TABLE payments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    booking_id INT NOT NULL,
    payment_id VARCHAR(100) UNIQUE NOT NULL,
    razorpay_order_id VARCHAR(100),
    razorpay_payment_id VARCHAR(100),
    razorpay_signature VARCHAR(255),
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'INR',
    status ENUM('created', 'authorized', 'captured', 'refunded', 'failed') DEFAULT 'created',
    payment_method VARCHAR(50),
    payment_date TIMESTAMP NULL,
    refund_amount DECIMAL(10, 2) DEFAULT 0,
    refund_date TIMESTAMP NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE
);

-- ============================================================================
-- CONTACT MESSAGES TABLE
-- ============================================================================
CREATE TABLE contact_messages (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    subject VARCHAR(255),
    message TEXT NOT NULL,
    event_date DATE,
    event_type VARCHAR(100),
    status ENUM('new', 'read', 'replied', 'archived') DEFAULT 'new',
    admin_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ============================================================================
-- NEWSLETTER SUBSCRIBERS TABLE
-- ============================================================================
CREATE TABLE newsletter_subscribers (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255),
    status ENUM('active', 'unsubscribed') DEFAULT 'active',
    subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    unsubscribed_at TIMESTAMP NULL
);

-- ============================================================================
-- WEBSITE SETTINGS TABLE
-- ============================================================================
CREATE TABLE website_settings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT,
    setting_type ENUM('text', 'number', 'boolean', 'json') DEFAULT 'text',
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert default settings
INSERT INTO website_settings (setting_key, setting_value, setting_type, description) VALUES
('site_name', 'PhotoStudio', 'text', 'Website name'),
('site_description', 'Professional Photography & Videography Services', 'text', 'Website description'),
('contact_email', 'info@photostudio.com', 'text', 'Primary contact email'),
('contact_phone', '+91 9876543210', 'text', 'Primary contact phone'),
('address', 'Mumbai, Maharashtra, India', 'text', 'Business address'),
('razorpay_key_id', '', 'text', 'Razorpay API Key ID'),
('razorpay_key_secret', '', 'text', 'Razorpay API Key Secret'),
('smtp_host', '', 'text', 'SMTP server host'),
('smtp_port', '587', 'number', 'SMTP server port'),
('smtp_username', '', 'text', 'SMTP username'),
('smtp_password', '', 'text', 'SMTP password'),
('google_analytics_id', '', 'text', 'Google Analytics tracking ID'),
('facebook_pixel_id', '', 'text', 'Facebook Pixel ID'),
('maintenance_mode', 'false', 'boolean', 'Enable maintenance mode'),
('allow_registrations', 'true', 'boolean', 'Allow new user registrations');

-- ============================================================================
-- ANALYTICS TABLE
-- ============================================================================
CREATE TABLE analytics (
    id INT PRIMARY KEY AUTO_INCREMENT,
    date DATE NOT NULL,
    page_views INT DEFAULT 0,
    unique_visitors INT DEFAULT 0,
    bounce_rate DECIMAL(5, 2) DEFAULT 0,
    avg_session_duration INT DEFAULT 0,
    new_users INT DEFAULT 0,
    returning_users INT DEFAULT 0,
    mobile_users INT DEFAULT 0,
    desktop_users INT DEFAULT 0,
    tablet_users INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_date (date)
);

-- ============================================================================
-- FILE UPLOADS TABLE
-- ============================================================================
CREATE TABLE file_uploads (
    id INT PRIMARY KEY AUTO_INCREMENT,
    original_name VARCHAR(255) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size INT NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    upload_type ENUM('portfolio', 'content', 'profile', 'other') DEFAULT 'other',
    uploaded_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (uploaded_by) REFERENCES admin(id) ON DELETE SET NULL
);

-- ============================================================================
-- ACTIVITY LOGS TABLE
-- ============================================================================
CREATE TABLE activity_logs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_type ENUM('admin', 'user') NOT NULL,
    user_id INT NOT NULL,
    action VARCHAR(100) NOT NULL,
    description TEXT,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- INDEXES FOR BETTER PERFORMANCE
-- ============================================================================

-- Users table indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_status ON users(status);
CREATE INDEX idx_users_created_at ON users(created_at);

-- Portfolio table indexes
CREATE INDEX idx_portfolio_category ON portfolio(category);
CREATE INDEX idx_portfolio_type ON portfolio(type);
CREATE INDEX idx_portfolio_status ON portfolio(status);
CREATE INDEX idx_portfolio_featured ON portfolio(is_featured);

-- Services table indexes
CREATE INDEX idx_services_category ON services(category);
CREATE INDEX idx_services_active ON services(is_active);
CREATE INDEX idx_services_popular ON services(is_popular);

-- Bookings table indexes
CREATE INDEX idx_bookings_user_id ON bookings(user_id);
CREATE INDEX idx_bookings_service_id ON bookings(service_id);
CREATE INDEX idx_bookings_event_date ON bookings(event_date);
CREATE INDEX idx_bookings_status ON bookings(booking_status);
CREATE INDEX idx_bookings_payment_status ON bookings(payment_status);
CREATE INDEX idx_bookings_created_at ON bookings(created_at);

-- Payments table indexes
CREATE INDEX idx_payments_booking_id ON payments(booking_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_date ON payments(payment_date);

-- Contact messages indexes
CREATE INDEX idx_contact_status ON contact_messages(status);
CREATE INDEX idx_contact_created_at ON contact_messages(created_at);

-- Analytics indexes
CREATE INDEX idx_analytics_date ON analytics(date);

-- Activity logs indexes
CREATE INDEX idx_activity_user_type ON activity_logs(user_type);
CREATE INDEX idx_activity_user_id ON activity_logs(user_id);
CREATE INDEX idx_activity_action ON activity_logs(action);
CREATE INDEX idx_activity_created_at ON activity_logs(created_at);

-- ============================================================================
-- VIEWS FOR COMMON QUERIES
-- ============================================================================

-- View for booking details with service and user information
CREATE VIEW booking_details AS
SELECT 
    b.*,
    s.name as service_name,
    s.category as service_category,
    u.name as user_name,
    u.email as user_email
FROM bookings b
LEFT JOIN services s ON b.service_id = s.id
LEFT JOIN users u ON b.user_id = u.id;

-- View for portfolio with category counts
CREATE VIEW portfolio_stats AS
SELECT 
    category,
    COUNT(*) as total_items,
    SUM(CASE WHEN type = 'image' THEN 1 ELSE 0 END) as image_count,
    SUM(CASE WHEN type = 'video' THEN 1 ELSE 0 END) as video_count,
    SUM(CASE WHEN is_featured = 1 THEN 1 ELSE 0 END) as featured_count
FROM portfolio 
WHERE status = 'active'
GROUP BY category;

-- ============================================================================
-- STORED PROCEDURES
-- ============================================================================

DELIMITER //

-- Procedure to get dashboard statistics
CREATE PROCEDURE GetDashboardStats()
BEGIN
    SELECT 
        (SELECT COUNT(*) FROM bookings WHERE booking_status != 'cancelled') as total_bookings,
        (SELECT COUNT(*) FROM bookings WHERE booking_status = 'pending') as pending_bookings,
        (SELECT COUNT(*) FROM bookings WHERE booking_status = 'confirmed') as confirmed_bookings,
        (SELECT COUNT(*) FROM bookings WHERE booking_status = 'completed') as completed_bookings,
        (SELECT COALESCE(SUM(total_amount), 0) FROM bookings WHERE payment_status = 'completed') as total_revenue,
        (SELECT COUNT(*) FROM users WHERE status = 'active') as total_users,
        (SELECT COUNT(*) FROM portfolio WHERE status = 'active') as total_portfolio_items,
        (SELECT COUNT(*) FROM services WHERE is_active = 1) as total_services;
END //

-- Procedure to update booking status
CREATE PROCEDURE UpdateBookingStatus(
    IN booking_id_param INT,
    IN new_status VARCHAR(20),
    IN admin_id_param INT
)
BEGIN
    UPDATE bookings 
    SET booking_status = new_status, 
        updated_at = CURRENT_TIMESTAMP 
    WHERE id = booking_id_param;
    
    INSERT INTO activity_logs (user_type, user_id, action, description)
    VALUES ('admin', admin_id_param, 'booking_status_update', 
            CONCAT('Updated booking #', booking_id_param, ' status to ', new_status));
END //

DELIMITER ;

-- ============================================================================
-- TRIGGERS
-- ============================================================================

DELIMITER //

-- Trigger to generate booking ID
CREATE TRIGGER generate_booking_id 
BEFORE INSERT ON bookings
FOR EACH ROW
BEGIN
    IF NEW.booking_id IS NULL OR NEW.booking_id = '' THEN
        SET NEW.booking_id = CONCAT('BK', YEAR(CURDATE()), LPAD(MONTH(CURDATE()), 2, '0'), LPAD(DAY(CURDATE()), 2, '0'), LPAD((SELECT COALESCE(MAX(id), 0) + 1 FROM bookings), 4, '0'));
    END IF;
END //

-- Trigger to log user registration
CREATE TRIGGER log_user_registration
AFTER INSERT ON users
FOR EACH ROW
BEGIN
    INSERT INTO activity_logs (user_type, user_id, action, description)
    VALUES ('user', NEW.id, 'user_registration', CONCAT('New user registered: ', NEW.email));
END //

DELIMITER ;

-- ============================================================================
-- SAMPLE DATA FOR TESTING (OPTIONAL)
-- ============================================================================

-- Insert sample users (passwords are hashed for 'password123')
INSERT INTO users (name, email, phone, password_hash, status, email_verified) VALUES
('Rajesh Kumar', 'rajesh@example.com', '+91 9876543210', '$2b$10$rOzJqQjQjQjQjQjQjQjQjOzJqQjQjQjQjQjQjQjQjQjQjQjQjQjQjQ', 'active', TRUE),
('Priya Sharma', 'priya@example.com', '+91 9876543211', '$2b$10$rOzJqQjQjQjQjQjQjQjQjOzJqQjQjQjQjQjQjQjQjQjQjQjQjQjQjQ', 'active', TRUE),
('Amit Patel', 'amit@example.com', '+91 9876543212', '$2b$10$rOzJqQjQjQjQjQjQjQjQjOzJqQjQjQjQjQjQjQjQjQjQjQjQjQjQjQ', 'active', TRUE);

-- Insert sample bookings
INSERT INTO bookings (user_id, service_id, client_name, client_email, client_phone, event_date, event_time, event_type, event_location, total_amount, booking_status, payment_status) VALUES
(1, 1, 'Rajesh Kumar', 'rajesh@example.com', '+91 9876543210', '2024-02-15', '10:00:00', 'Wedding', 'Mumbai, Maharashtra', 45000.00, 'confirmed', 'partial'),
(2, 2, 'Priya Sharma', 'priya@example.com', '+91 9876543211', '2024-02-20', '14:00:00', 'Portrait Session', 'Delhi, India', 8000.00, 'pending', 'pending'),
(3, 3, 'Amit Patel', 'amit@example.com', '+91 9876543212', '2024-02-25', '16:00:00', 'Corporate Event', 'Bangalore, Karnataka', 25000.00, 'confirmed', 'completed');

-- Insert sample contact messages
INSERT INTO contact_messages (name, email, phone, subject, message, event_date, event_type, status) VALUES
('Sneha Gupta', 'sneha@example.com', '+91 9876543213', 'Wedding Photography Inquiry', 'Hi, I am looking for wedding photography services for my wedding in March. Please contact me.', '2024-03-15', 'Wedding', 'new'),
('Vikram Singh', 'vikram@example.com', '+91 9876543214', 'Corporate Event Coverage', 'We need photography coverage for our annual corporate event. Please send me a quote.', '2024-02-28', 'Corporate Event', 'new');

-- ============================================================================
-- NOTES FOR ADMIN
-- ============================================================================
/*
DEFAULT ADMIN CREDENTIALS:
Username: admin
Password: admin123

IMPORTANT SETUP INSTRUCTIONS:
1. Update the admin password after first login
2. Configure Razorpay API keys in website_settings table
3. Set up SMTP settings for email notifications
4. Update contact information in website_content table
5. Add your portfolio items and services
6. Configure Google Analytics and Facebook Pixel IDs if needed

SECURITY RECOMMENDATIONS:
1. Use strong passwords for admin accounts
2. Enable SSL/HTTPS for the website
3. Regularly backup the database
4. Keep the application updated
5. Monitor activity logs for suspicious activities

DATABASE MAINTENANCE:
1. Regularly clean up old activity logs
2. Archive completed bookings older than 1 year
3. Optimize database tables periodically
4. Monitor database performance

FOR PRODUCTION USE:
1. Remove or modify sample data
2. Set up proper database user with limited privileges
3. Configure database backups
4. Set up monitoring and alerts
*/