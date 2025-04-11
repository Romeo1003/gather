import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import User from './models/User.js';
import sequelize from './config/database.js';

// Load environment variables
dotenv.config();

// Security check to prevent unauthorized admin creation
// Only allows running in development mode or with explicit ALLOW_ADMIN_CREATION env var
const securityCheck = () => {
  const isDevelopment = process.env.NODE_ENV === 'development';
  const isAllowed = process.env.ALLOW_ADMIN_CREATION === 'true';
  
  if (!isDevelopment && !isAllowed) {
    console.error('❌ This script is only allowed in development environment or with ALLOW_ADMIN_CREATION=true');
    console.error('For security reasons, admin creation is restricted in production environments.');
    process.exit(1);
  }
  
  // Additional check - only allow on localhost or with authorization
  const isLocalhost = process.env.SERVER_HOST === 'localhost' || !process.env.SERVER_HOST;
  if (!isLocalhost && !isAllowed) {
    console.error('❌ This script is only allowed to run on localhost or with explicit authorization');
    process.exit(1);
  }
  
  console.log('✅ Security check passed. Proceeding with admin creation...');
};

// Admin account details
const adminData = {
  name: 'Admin User',
  email: 'admin@gather.com',
  password: 'admin123',
  role: 'admin'
};

// Create admin user
async function createAdmin() {
  try {
    // Run security check
    securityCheck();
    
    console.log('Connecting to database...');
    await sequelize.authenticate();
    console.log('✅ Database connected');
    
    // Check if admin already exists
    const existingAdmin = await User.findOne({ where: { email: adminData.email } });
    
    if (existingAdmin) {
      console.log('Admin account already exists');
      process.exit(0);
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(adminData.password, 10);
    
    // Create admin user
    const admin = await User.create({
      name: adminData.name,
      email: adminData.email,
      password: hashedPassword,
      role: adminData.role
    });
    
    console.log('✅ Admin account created successfully');
    console.log('Email:', admin.email);
    console.log('Password:', adminData.password); // Only showing for demonstration
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin:', error);
    process.exit(1);
  }
}

// Run the function
createAdmin(); 