// Utility function to seed tasks in Firestore
// Run this in browser console or add to admin panel

import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '../config/firebase';

export const sampleTasks = [
  {
    title: 'Samsung Galaxy S24 Ultra Review',
    brand: 'Samsung Electronics',
    description: 'Share your experience with the latest Samsung flagship smartphone. Review the camera quality, battery life, display, and overall performance.',
    image: 'https://images.unsplash.com/photo-1678164235182-bc7e9beef2a8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
    reward: 250,
    deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
    category: 'tech',
    tag: 'Hot Task',
    status: 'active' as const,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    title: 'Organic Restaurant Experience',
    brand: 'Green Bistro',
    description: 'Visit Green Bistro and review your dining experience. Share photos of the food, ambiance, and service quality.',
    image: 'https://images.unsplash.com/photo-1600555379885-08a02224726d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
    reward: 180,
    deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    category: 'food' as const,
    tag: 'Quick Task',
    status: 'active' as const,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    title: 'Premium Skincare Product',
    brand: 'GlowUp Beauty',
    description: 'Test and review our new premium skincare line. Share your before/after photos and detailed feedback.',
    image: 'https://images.unsplash.com/photo-1609097164673-7cfafb51b926?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
    reward: 200,
    deadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    category: 'health' as const,
    tag: 'New',
    status: 'active' as const,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    title: 'Wireless Noise Cancelling Headphones',
    brand: 'SoundMax Audio',
    description: 'Review our premium wireless headphones. Test sound quality, noise cancellation, battery life, and comfort.',
    image: 'https://images.unsplash.com/photo-1583373351761-fa9e3a19c99d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
    reward: 220,
    deadline: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
    category: 'tech' as const,
    status: 'active' as const,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    title: 'Designer Fashion Collection Review',
    brand: 'Urban Style Co.',
    description: 'Review our latest fashion collection. Share outfit photos and styling tips.',
    image: 'https://images.unsplash.com/photo-1599012307530-d163bd04ecab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
    reward: 190,
    deadline: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000),
    category: 'fashion' as const,
    tag: 'Popular',
    status: 'active' as const,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    title: 'Fitness Tracker & Health App',
    brand: 'FitLife Tech',
    description: 'Review our fitness tracker and companion app. Test activity tracking, heart rate monitoring, and app features.',
    image: 'https://images.unsplash.com/photo-1666979290238-2d862b573345?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
    reward: 170,
    deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    category: 'health' as const,
    status: 'active' as const,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export async function seedTasks() {
  try {
    console.log('Starting to seed tasks...\n');
    
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
    console.log('Refresh the page to see the tasks.');
    return true;
  } catch (error: any) {
    console.error('Error seeding tasks:', error);
    if (error.code === 'permission-denied') {
      console.error('Permission denied. Make sure you are logged in as an admin user.');
    }
    return false;
  }
}

// Make available globally for browser console
if (typeof window !== 'undefined') {
  (window as any).seedTasks = seedTasks;
  console.log('💡 Tip: Run seedTasks() in the console to add sample tasks (admin required)');
}

