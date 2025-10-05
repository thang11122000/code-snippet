import { Snippet, Tag, User } from "./types";

export const mockUsers: User[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
    bio: "Full-stack developer passionate about clean code",
    createdAt: "2024-01-15T10:00:00Z",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jane",
    bio: "Frontend enthusiast | React & TypeScript",
    createdAt: "2024-02-20T10:00:00Z",
  },
  {
    id: "3",
    name: "Mike Johnson",
    email: "mike@example.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike",
    bio: "Backend wizard | Python & Go",
    createdAt: "2024-03-10T10:00:00Z",
  },
];

export const mockSnippets: Snippet[] = [
  {
    id: "1",
    title: "Binary Search Implementation",
    description: "Efficient binary search algorithm in JavaScript",
    code: `function binarySearch(arr, target) {
  let left = 0;
  let right = arr.length - 1;
  
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    
    if (arr[mid] === target) {
      return mid;
    } else if (arr[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  
  return -1;
}`,
    language: "JavaScript",
    tags: ["algorithm", "search", "binary-search"],
    complexity: "O(log n)",
    author: mockUsers[0],
    createdAt: "2024-03-15T10:00:00Z",
    updatedAt: "2024-03-15T10:00:00Z",
    likes: 42,
    views: 156,
  },
  {
    id: "2",
    title: "React Custom Hook for API Calls",
    description:
      "Reusable hook for handling API requests with loading and error states",
    code: `import { useState, useEffect } from 'react';

export function useApi(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(url)
      .then(res => res.json())
      .then(data => {
        setData(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err);
        setLoading(false);
      });
  }, [url]);

  return { data, loading, error };
}`,
    language: "TypeScript",
    tags: ["react", "hooks", "api", "frontend"],
    complexity: "O(1)",
    author: mockUsers[1],
    createdAt: "2024-03-16T14:30:00Z",
    updatedAt: "2024-03-16T14:30:00Z",
    likes: 89,
    views: 234,
  },
  {
    id: "3",
    title: "Quick Sort Algorithm",
    description: "Classic quick sort implementation with partition",
    code: `def quicksort(arr):
    if len(arr) <= 1:
        return arr
    
    pivot = arr[len(arr) // 2]
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]
    
    return quicksort(left) + middle + quicksort(right)

# Example usage
numbers = [3, 6, 8, 10, 1, 2, 1]
sorted_numbers = quicksort(numbers)
print(sorted_numbers)`,
    language: "Python",
    tags: ["algorithm", "sorting", "quicksort", "recursion"],
    complexity: "O(n log n)",
    author: mockUsers[2],
    createdAt: "2024-03-17T09:15:00Z",
    updatedAt: "2024-03-17T09:15:00Z",
    likes: 67,
    views: 189,
  },
  {
    id: "4",
    title: "Debounce Function",
    description: "Utility function to debounce expensive operations",
    code: `function debounce(func, delay) {
  let timeoutId;
  
  return function(...args) {
    clearTimeout(timeoutId);
    
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}

// Usage example
const handleSearch = debounce((query) => {
  console.log('Searching for:', query);
}, 300);`,
    language: "JavaScript",
    tags: ["utility", "performance", "debounce"],
    complexity: "O(1)",
    author: mockUsers[0],
    createdAt: "2024-03-18T11:20:00Z",
    updatedAt: "2024-03-18T11:20:00Z",
    likes: 123,
    views: 456,
  },
  {
    id: "5",
    title: "Fibonacci with Memoization",
    description: "Optimized fibonacci using dynamic programming",
    code: `function fibonacci(n, memo = {}) {
  if (n in memo) return memo[n];
  if (n <= 2) return 1;
  
  memo[n] = fibonacci(n - 1, memo) + fibonacci(n - 2, memo);
  return memo[n];
}

console.log(fibonacci(50)); // Fast!`,
    language: "JavaScript",
    tags: ["algorithm", "dynamic-programming", "fibonacci", "memoization"],
    complexity: "O(n)",
    author: mockUsers[1],
    createdAt: "2024-03-19T16:45:00Z",
    updatedAt: "2024-03-19T16:45:00Z",
    likes: 78,
    views: 267,
  },
  {
    id: "6",
    title: "CSS Flexbox Centering",
    description: "Perfect centering with flexbox",
    code: `.container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}

.centered-content {
  /* Your content styles */
  padding: 2rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}`,
    language: "CSS",
    tags: ["css", "flexbox", "layout", "centering"],
    complexity: "O(1)",
    author: mockUsers[2],
    createdAt: "2024-03-20T08:30:00Z",
    updatedAt: "2024-03-20T08:30:00Z",
    likes: 45,
    views: 178,
  },
];

export const mockTags: Tag[] = [
  { name: "algorithm", count: 45 },
  { name: "react", count: 89 },
  { name: "javascript", count: 156 },
  { name: "python", count: 78 },
  { name: "typescript", count: 67 },
  { name: "css", count: 34 },
  { name: "api", count: 56 },
  { name: "hooks", count: 43 },
  { name: "sorting", count: 29 },
  { name: "search", count: 31 },
];
