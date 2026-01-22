const { MongoClient } = require('mongodb');

async function activateAdmin() {
  const client = new MongoClient('mongodb+srv://Cyberbot_db_user:admin123@cluster0.0x1zpys.mongodb.net/?appName=Cluster0');
  
  try {
    await client.connect();
    const db = client.db('safedoc_db');
    const users = db.collection('users');
    
    // Update admin user status to active
    const result = await users.updateOne(
      { email: 'admin@safedoc.uz' },
      { $set: { status: 'active' } }
    );
    
    console.log('Admin user activated:', result.modifiedCount);
    
    // Show user info
    const user = await users.findOne({ email: 'admin@safedoc.uz' });
    console.log('User info:', user);
    
  } finally {
    await client.close();
  }
}

activateAdmin().catch(console.error);