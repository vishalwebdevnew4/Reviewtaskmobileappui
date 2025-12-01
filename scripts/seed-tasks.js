// Seed Tasks Script
// Run this script to add sample tasks to Firestore
// Usage: node scripts/seed-tasks.js

const admin = require('firebase-admin');
const path = require('path');

// Initialize Firebase Admin
// Make sure to set GOOGLE_APPLICATION_CREDENTIALS environment variable
// or use service account key file
if (!admin.apps.length) {
  try {
    // Try to use service account from environment or default location
    const serviceAccount = process.env.GOOGLE_APPLICATION_CREDENTIALS 
      ? require(process.env.GOOGLE_APPLICATION_CREDENTIALS)
      : require(path.join(__dirname, '../serviceAccountKey.json'));
    
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
  } catch (error) {
    console.error('Error initializing Firebase Admin:', error);
    console.log('\nTo use this script, you need to:');
    console.log('1. Download service account key from Firebase Console');
    console.log('2. Save it as serviceAccountKey.json in the project root');
    console.log('3. Or set GOOGLE_APPLICATION_CREDENTIALS environment variable');
    process.exit(1);
  }
}

const db = admin.firestore();

const sampleTasks = [
  {
    title: 'Samsung Galaxy S24 Ultra Review',
    brand: 'Samsung Electronics',
    description: 'Share your experience with the latest Samsung flagship smartphone. Review the camera quality, battery life, display, and overall performance.',
    image: 'https://images.unsplash.com/photo-1678164235182-bc7e9beef2a8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
    reward: 250,
    deadline: admin.firestore.Timestamp.fromDate(new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)), // 3 days from now
    category: 'tech',
    tag: 'Hot Task',
    status: 'active',
    createdAt: admin.firestore.Timestamp.now(),
    updatedAt: admin.firestore.Timestamp.now(),
    requirements: [
      'Minimum 50 words review',
      'At least 2 product images',
      'Honest feedback required'
    ]
  },
  {
    title: 'Organic Restaurant Experience',
    brand: 'Green Bistro',
    description: 'Visit Green Bistro and review your dining experience. Share photos of the food, ambiance, and service quality.',
    image: 'https://images.unsplash.com/photo-1600555379885-08a02224726d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
    reward: 180,
    deadline: admin.firestore.Timestamp.fromDate(new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)), // 5 days from now
    category: 'food',
    tag: 'Quick Task',
    status: 'active',
    createdAt: admin.firestore.Timestamp.now(),
    updatedAt: admin.firestore.Timestamp.now(),
    requirements: [
      'Food photos required',
      'Review service and ambiance',
      'Minimum 50 words'
    ]
  },
  {
    title: 'Premium Skincare Product',
    brand: 'GlowUp Beauty',
    description: 'Test and review our new premium skincare line. Share your before/after photos and detailed feedback.',
    image: 'https://images.unsplash.com/photo-1609097164673-7cfafb51b926?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
    reward: 200,
    deadline: admin.firestore.Timestamp.fromDate(new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)), // 2 days from now
    category: 'health',
    tag: 'New',
    status: 'active',
    createdAt: admin.firestore.Timestamp.now(),
    updatedAt: admin.firestore.Timestamp.now(),
    requirements: [
      'Before/after photos',
      'Detailed skin analysis',
      'Minimum 2 weeks usage'
    ]
  },
  {
    title: 'Wireless Noise Cancelling Headphones',
    brand: 'SoundMax Audio',
    description: 'Review our premium wireless headphones. Test sound quality, noise cancellation, battery life, and comfort.',
    image: 'https://images.unsplash.com/photo-1583373351761-fa9e3a19c99d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
    reward: 220,
    deadline: admin.firestore.Timestamp.fromDate(new Date(Date.now() + 4 * 24 * 60 * 60 * 1000)), // 4 days from now
    category: 'tech',
    status: 'active',
    createdAt: admin.firestore.Timestamp.now(),
    updatedAt: admin.firestore.Timestamp.now(),
    requirements: [
      'Sound quality test',
      'Comfort and fit review',
      'Battery life testing'
    ]
  },
  {
    title: 'Designer Fashion Collection Review',
    brand: 'Urban Style Co.',
    description: 'Review our latest fashion collection. Share outfit photos and styling tips.',
    image: 'https://images.unsplash.com/photo-1599012307530-d163bd04ecab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
    reward: 190,
    deadline: admin.firestore.Timestamp.fromDate(new Date(Date.now() + 6 * 24 * 60 * 60 * 1000)), // 6 days from now
    category: 'fashion',
    tag: 'Popular',
    status: 'active',
    createdAt: admin.firestore.Timestamp.now(),
    updatedAt: admin.firestore.Timestamp.now(),
    requirements: [
      'Outfit photos',
      'Styling tips',
      'Quality and fit review'
    ]
  },
  {
    title: 'Fitness Tracker & Health App',
    brand: 'FitLife Tech',
    description: 'Review our fitness tracker and companion app. Test activity tracking, heart rate monitoring, and app features.',
    image: 'https://images.unsplash.com/photo-1666979290238-2d862b573345?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
    reward: 170,
    deadline: admin.firestore.Timestamp.fromDate(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)), // 7 days from now
    category: 'health',
    status: 'active',
    createdAt: admin.firestore.Timestamp.now(),
    updatedAt: admin.firestore.Timestamp.now(),
    requirements: [
      'Activity tracking test',
      'App interface review',
      'Accuracy testing'
    ]
  },
  {
    title: 'iPhone 15 Pro Max Review',
    brand: 'Apple Inc.',
    description: 'Review the latest iPhone model. Test camera, performance, battery, and new features.',
    image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
    reward: 300,
    deadline: admin.firestore.Timestamp.fromDate(new Date(Date.now() + 10 * 24 * 60 * 60 * 1000)), // 10 days from now
    category: 'tech',
    tag: 'Hot Task',
    status: 'active',
    createdAt: admin.firestore.Timestamp.now(),
    updatedAt: admin.firestore.Timestamp.now(),
    requirements: [
      'Camera quality test',
      'Performance benchmarks',
      'Battery life review'
    ]
  },
  {
    title: 'Gourmet Coffee Subscription',
    brand: 'Bean Masters',
    description: 'Review our monthly coffee subscription. Share your brewing experience and flavor notes.',
    image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
    reward: 150,
    deadline: admin.firestore.Timestamp.fromDate(new Date(Date.now() + 8 * 24 * 60 * 60 * 1000)), // 8 days from now
    category: 'food',
    status: 'active',
    createdAt: admin.firestore.Timestamp.now(),
    updatedAt: admin.firestore.Timestamp.now(),
    requirements: [
      'Brewing photos',
      'Flavor profile review',
      'Packaging review'
    ]
  }
];

async function seedTasks() {
  try {
    console.log('Starting to seed tasks...\n');
    
    const batch = db.batch();
    const tasksRef = db.collection('tasks');
    
    for (const task of sampleTasks) {
      const docRef = tasksRef.doc();
      batch.set(docRef, task);
      console.log(`✓ Added: ${task.title}`);
    }
    
    await batch.commit();
    console.log(`\n✅ Successfully seeded ${sampleTasks.length} tasks!`);
    console.log('\nYou can now view them in your app.');
    
  } catch (error) {
    console.error('Error seeding tasks:', error);
    process.exit(1);
  }
}

// Run the seed function
seedTasks()
  .then(() => {
    console.log('\nDone!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });

