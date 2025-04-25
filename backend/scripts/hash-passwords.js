import bcrypt from 'bcrypt';
import User from '../models/User.js';
import sequelize from '../config/database.js';

const hashExistingPasswords = async () => {
  try {
    const users = await User.findAll();
    
    for (const user of users) {
      if (!user.password.startsWith('$2b$')) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
        await user.save();
      }
    }
    
    console.log('✅ Successfully migrated passwords for', users.length, 'users');
    process.exit(0);
  } catch (error) {
    console.error('❌ Password migration failed:', error);
    process.exit(1);
  }
};

sequelize.sync().then(() => {
  hashExistingPasswords();
});