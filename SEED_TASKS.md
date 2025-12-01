# How to Seed Tasks in Firestore

There are several ways to add sample tasks to your Firestore database:

## Method 1: Using Firebase Console (Easiest)

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to **Firestore Database**
4. Click on **tasks** collection (or create it if it doesn't exist)
5. Click **Add document**
6. Add the following fields:

```
title: "Samsung Galaxy S24 Ultra Review"
brand: "Samsung Electronics"
description: "Share your experience with the latest Samsung flagship smartphone."
image: "https://images.unsplash.com/photo-1678164235182-bc7e9beef2a8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400"
reward: 250
deadline: [Select Date - 3 days from today]
category: "tech"
tag: "Hot Task"
status: "active"
createdAt: [Timestamp - now]
updatedAt: [Timestamp - now]
```

7. Repeat for more tasks (see sample tasks below)

## Method 2: Using Browser Console (Quick)

1. Open your app in the browser
2. Log in as an admin user
3. Open browser console (F12)
4. Copy and paste this code:

```javascript
// Import Firebase functions
import { db } from './src/config/firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';

const sampleTasks = [
  {
    title: 'Samsung Galaxy S24 Ultra Review',
    brand: 'Samsung Electronics',
    description: 'Share your experience with the latest Samsung flagship smartphone.',
    image: 'https://images.unsplash.com/photo-1678164235182-bc7e9beef2a8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
    reward: 250,
    deadline: Timestamp.fromDate(new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)),
    category: 'tech',
    tag: 'Hot Task',
    status: 'active',
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  },
  {
    title: 'Organic Restaurant Experience',
    brand: 'Green Bistro',
    description: 'Visit Green Bistro and review your dining experience.',
    image: 'https://images.unsplash.com/photo-1600555379885-08a02224726d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
    reward: 180,
    deadline: Timestamp.fromDate(new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)),
    category: 'food',
    tag: 'Quick Task',
    status: 'active',
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  },
  {
    title: 'Premium Skincare Product',
    brand: 'GlowUp Beauty',
    description: 'Test and review our new premium skincare line.',
    image: 'https://images.unsplash.com/photo-1609097164673-7cfafb51b926?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
    reward: 200,
    deadline: Timestamp.fromDate(new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)),
    category: 'health',
    tag: 'New',
    status: 'active',
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  },
  {
    title: 'Wireless Noise Cancelling Headphones',
    brand: 'SoundMax Audio',
    description: 'Review our premium wireless headphones.',
    image: 'https://images.unsplash.com/photo-1583373351761-fa9e3a19c99d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
    reward: 220,
    deadline: Timestamp.fromDate(new Date(Date.now() + 4 * 24 * 60 * 60 * 1000)),
    category: 'tech',
    status: 'active',
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  },
  {
    title: 'Designer Fashion Collection Review',
    brand: 'Urban Style Co.',
    description: 'Review our latest fashion collection.',
    image: 'https://images.unsplash.com/photo-1599012307530-d163bd04ecab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
    reward: 190,
    deadline: Timestamp.fromDate(new Date(Date.now() + 6 * 24 * 60 * 60 * 1000)),
    category: 'fashion',
    tag: 'Popular',
    status: 'active',
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  },
  {
    title: 'Fitness Tracker & Health App',
    brand: 'FitLife Tech',
    description: 'Review our fitness tracker and companion app.',
    image: 'https://images.unsplash.com/photo-1666979290238-2d862b573345?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
    reward: 170,
    deadline: Timestamp.fromDate(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)),
    category: 'health',
    status: 'active',
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  }
];

// Seed tasks
async function seedTasks() {
  for (const task of sampleTasks) {
    try {
      await addDoc(collection(db, 'tasks'), task);
      console.log(`✓ Added: ${task.title}`);
    } catch (error) {
      console.error(`Error adding ${task.title}:`, error);
    }
  }
  console.log('✅ Done seeding tasks!');
}

seedTasks();
```

## Method 3: Using Node.js Script

1. Install Firebase Admin SDK:
```bash
npm install firebase-admin
```

2. Download service account key from Firebase Console:
   - Go to Project Settings > Service Accounts
   - Click "Generate new private key"
   - Save as `serviceAccountKey.json` in project root

3. Run the seed script:
```bash
node scripts/seed-tasks.js
```

## Sample Tasks Data

Here are sample tasks you can add:

### Task 1: Tech
- **Title**: Samsung Galaxy S24 Ultra Review
- **Brand**: Samsung Electronics
- **Reward**: 250
- **Category**: tech
- **Tag**: Hot Task

### Task 2: Food
- **Title**: Organic Restaurant Experience
- **Brand**: Green Bistro
- **Reward**: 180
- **Category**: food
- **Tag**: Quick Task

### Task 3: Health
- **Title**: Premium Skincare Product
- **Brand**: GlowUp Beauty
- **Reward**: 200
- **Category**: health
- **Tag**: New

### Task 4: Tech
- **Title**: Wireless Noise Cancelling Headphones
- **Brand**: SoundMax Audio
- **Reward**: 220
- **Category**: tech

### Task 5: Fashion
- **Title**: Designer Fashion Collection Review
- **Brand**: Urban Style Co.
- **Reward**: 190
- **Category**: fashion
- **Tag**: Popular

### Task 6: Health
- **Title**: Fitness Tracker & Health App
- **Brand**: FitLife Tech
- **Reward**: 170
- **Category**: health

## Important Notes

1. **Admin Required**: You need to be logged in as an admin to create tasks
2. **Timestamps**: Use Firestore Timestamp type for `deadline`, `createdAt`, `updatedAt`
3. **Status**: Set status to `"active"` for tasks to show up
4. **Categories**: Use: `tech`, `food`, `health`, `fashion`, `apps`, or `all`
5. **Tags**: Optional, but helps with featured tasks (e.g., "Hot Task", "New", "Popular")

## Troubleshooting

- **Tasks not showing**: Check that `status` is set to `"active"`
- **Permission denied**: Make sure your user has admin role in Firestore
- **Index errors**: Deploy Firestore indexes: `firebase deploy --only firestore:indexes`

