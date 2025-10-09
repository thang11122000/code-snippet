import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Snippet from './models/Snippet';

// Load environment variables
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/code-snippet';

const sampleSnippets = [
  {
    title: 'React useState Hook Example',
    description: 'A simple example of using useState hook in React functional components',
    code: `import React, { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}`,
    languageCode: 'javascript',
    tags: ['react', 'hooks', 'state'],
    authorId: 'user1',
    authorName: 'John Doe',
    authorImage: 'https://via.placeholder.com/40',
    isPublic: true,
    complexity: 'beginner',
  },
  {
    title: 'Python List Comprehension',
    description: 'Efficient way to create lists in Python using list comprehension',
    code: `# Traditional way
numbers = []
for i in range(10):
    if i % 2 == 0:
        numbers.append(i * 2)

# List comprehension way
numbers = [i * 2 for i in range(10) if i % 2 == 0]

print(numbers)  # [0, 4, 8, 12, 16]`,
    languageCode: 'python',
    tags: ['python', 'list', 'comprehension'],
    authorId: 'user2',
    authorName: 'Jane Smith',
    authorImage: 'https://via.placeholder.com/40',
    isPublic: true,
    complexity: 'intermediate',
  },
  {
    title: 'TypeScript Interface Example',
    description: 'Defining and using interfaces in TypeScript for better type safety',
    code: `interface User {
  id: number;
  name: string;
  email: string;
  isActive?: boolean;
}

const user: User = {
  id: 1,
  name: 'John Doe',
  email: 'john@example.com',
  isActive: true
};

function getUserInfo(user: User): string {
  return \`\${user.name} (\${user.email})\`;
}`,
    languageCode: 'typescript',
    tags: ['typescript', 'interface', 'types'],
    authorId: 'user3',
    authorName: 'Mike Johnson',
    authorImage: 'https://via.placeholder.com/40',
    isPublic: true,
    complexity: 'intermediate',
  },
  {
    title: 'CSS Grid Layout',
    description: 'Modern CSS Grid layout for responsive web design',
    code: `.container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  padding: 20px;
}

.item {
  background: #f0f0f0;
  padding: 20px;
  border-radius: 8px;
}

@media (max-width: 768px) {
  .container {
    grid-template-columns: 1fr;
  }
}`,
    languageCode: 'css',
    tags: ['css', 'grid', 'responsive', 'layout'],
    authorId: 'user4',
    authorName: 'Sarah Wilson',
    authorImage: 'https://via.placeholder.com/40',
    isPublic: true,
    complexity: 'intermediate',
  },
  {
    title: 'Node.js Express API',
    description: 'Basic Express.js API setup with middleware and routes',
    code: `const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/api/users', (req, res) => {
  res.json({ message: 'Get all users' });
});

app.post('/api/users', (req, res) => {
  const { name, email } = req.body;
  res.json({ message: 'User created', user: { name, email } });
});

app.listen(PORT, () => {
  console.log(\`Server running on port \${PORT}\`);
});`,
    languageCode: 'javascript',
    tags: ['nodejs', 'express', 'api', 'backend'],
    authorId: 'user5',
    authorName: 'Alex Brown',
    authorImage: 'https://via.placeholder.com/40',
    isPublic: true,
    complexity: 'intermediate',
  },
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing snippets
    await Snippet.deleteMany({});
    console.log('🗑️  Cleared existing snippets');

    // Insert sample snippets
    const snippets = await Snippet.insertMany(sampleSnippets);
    console.log(`✅ Inserted ${snippets.length} sample snippets`);

    console.log('🎉 Database seeded successfully!');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('👋 Disconnected from MongoDB');
  }
}

seedDatabase();