// Basic time complexity estimation based on code patterns
export type ComplexityLevel =
  | "O(1)"
  | "O(log n)"
  | "O(n)"
  | "O(n log n)"
  | "O(n²)"
  | "O(2ⁿ)"
  | "Unknown";

export function estimateComplexity(code: string): ComplexityLevel {
  const lowerCode = code.toLowerCase();

  // Check for exponential patterns (recursive fibonacci, etc)
  if (
    /fibonacci|fib\s*\(/.test(lowerCode) ||
    /2\s*\*\*\s*n/.test(lowerCode) ||
    /pow\s*\(\s*2/.test(lowerCode)
  ) {
    return "O(2ⁿ)";
  }

  // Check for nested loops (quadratic)
  const forLoops = (code.match(/for\s*\(/g) || []).length;
  const whileLoops = (code.match(/while\s*\(/g) || []).length;
  const totalLoops = forLoops + whileLoops;

  if (totalLoops >= 2) {
    return "O(n²)";
  }

  // Check for sorting or divide-and-conquer patterns
  if (
    /\.sort\s*\(/.test(lowerCode) ||
    /quicksort|mergesort|heapsort/.test(lowerCode) ||
    (/recursion|recursive/.test(lowerCode) && /divide/.test(lowerCode))
  ) {
    return "O(n log n)";
  }

  // Check for binary search or logarithmic patterns
  if (
    /binary\s*search|binarysearch/.test(lowerCode) ||
    (/while|for/.test(lowerCode) && /\/\s*2|>>|>>>/.test(code))
  ) {
    return "O(log n)";
  }

  // Check for single loop (linear)
  if (
    totalLoops === 1 ||
    /\.map\(|\.filter\(|\.reduce\(|\.foreach\(/i.test(lowerCode)
  ) {
    return "O(n)";
  }

  // If no loops or iterations detected (constant)
  if (totalLoops === 0 && !/recursion|recursive/.test(lowerCode)) {
    return "O(1)";
  }

  return "Unknown";
}

export function getComplexityColor(complexity: ComplexityLevel): string {
  switch (complexity) {
    case "O(1)":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
    case "O(log n)":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
    case "O(n)":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
    case "O(n log n)":
      return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200";
    case "O(n²)":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
    case "O(2ⁿ)":
      return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
  }
}
