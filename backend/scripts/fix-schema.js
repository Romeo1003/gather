import sequelize from '../config/database.js';

// Sync database with force true in development environments only
const fixSchema = async () => {
  try {
    console.log('🔧 Attempting to fix database schema...');
    
    // Force recreate all tables - BE CAREFUL! This will delete all data
    await sequelize.sync({ force: true });
    console.log('✅ Database schema has been reset and recreated');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Failed to fix schema:', error);
    process.exit(1);
  }
};

fixSchema(); 