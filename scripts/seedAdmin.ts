import { connectToDatabase, Collections } from '../lib/mongodb';
import { User } from '../types';

async function seedAdmin() {
  console.log('👤 Creating admin user...');

  try {
    const { db } = await connectToDatabase();

    const adminUser: User = {
      email: 'admin@blumea.com',
      name: 'Admin User',
      role: 'admin',
      status: 'active',
      // In production, this should be a properly hashed password using bcrypt
      // For demo purposes, using plain text (DO NOT DO THIS IN PRODUCTION)
      passwordHash: 'admin123',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Check if admin already exists
    const existing = await db.collection(Collections.USERS).findOne({ email: adminUser.email });

    if (existing) {
      console.log('⚠️  Admin user already exists');
      process.exit(0);
    }

    await db.collection(Collections.USERS).insertOne(adminUser);

    console.log('✅ Admin user created successfully');
    console.log(`   Email: ${adminUser.email}`);
    console.log(`   Password: admin123`);
    console.log('   ⚠️  CHANGE THIS PASSWORD IMMEDIATELY IN PRODUCTION!');

    process.exit(0);
  } catch (error) {
    console.error('❌ Failed to create admin user:', error);
    process.exit(1);
  }
}

seedAdmin();
