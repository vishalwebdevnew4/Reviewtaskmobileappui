// Browser-based Task Seeder
// Run this in the browser console after logging in as admin
// Or add this as a temporary admin function

// Copy and paste this into your browser console while logged in

const sampleTasks = [
  {
    title: 'Samsung Galaxy S24 Ultra Review',
    brand: 'Samsung Electronics',
    description: 'Share your experience with the latest Samsung flagship smartphone. Review the camera quality, battery life, display, and overall performance.',
    image: 'https://images.unsplash.com/photo-1678164235182-bc7e9beef2a8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
    reward: 250,
    deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
    category: 'tech',
    tag: 'Hot Task',
    status: 'active',
    createdAt: new Date(),
    updatedAt: new Date(),
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
    deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    category: 'food',
    tag: 'Quick Task',
    status: 'active',
    createdAt: new Date(),
    updatedAt: new Date(),
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
    deadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    category: 'health',
    tag: 'New',
    status: 'active',
    createdAt: new Date(),
    updatedAt: new Date(),
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
    deadline: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
    category: 'tech',
    status: 'active',
    createdAt: new Date(),
    updatedAt: new Date(),
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
    deadline: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000),
    category: 'fashion',
    tag: 'Popular',
    status: 'active',
    createdAt: new Date(),
    updatedAt: new Date(),
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
    deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    category: 'health',
    status: 'active',
    createdAt: new Date(),
    updatedAt: new Date(),
    requirements: [
      'Activity tracking test',
      'App interface review',
      'Accuracy testing'
    ]
  }
];

// Function to seed tasks (run this in browser console)
async function seedTasksInBrowser() {
  const { db, Timestamp } = await import('/src/config/firebase.ts');
  const { collection, addDoc } = await import('firebase/firestore');
  
  try {
    console.log('Starting to seed tasks...');
    
    for (const task of sampleTasks) {
      await addDoc(collection(db, 'tasks'), {
        ...task,
        deadline: Timestamp.fromDate(task.deadline),
        createdAt: Timestamp.fromDate(task.createdAt),
        updatedAt: Timestamp.fromDate(task.updatedAt),
      });
      console.log(`✓ Added: ${task.title}`);
    }
    
    console.log(`\n✅ Successfully seeded ${sampleTasks.length} tasks!`);
  } catch (error) {
    console.error('Error seeding tasks:', error);
  }
}

// Export for use
if (typeof window !== 'undefined') {
  window.seedTasks = seedTasksInBrowser;
  console.log('Run seedTasks() in the console to seed tasks');
}

