import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const email = 'mohitkumart2x@gmail.com';

async function makeAdmin() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected!');

    const result = await mongoose.connection.collection('users').updateOne(
      { email },
      { $set: { role: 'admin' } }
    );

    if (result.matchedCount === 0) {
      console.log(`❌ No user found with email: ${email}`);
      console.log('   Please register this account at /signup first.');
    } else {
      console.log(`✅ Success! "${email}" has been promoted to admin.`);
      console.log('   Log in and you will be redirected to /admin/dashboard');
    }
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

makeAdmin();
