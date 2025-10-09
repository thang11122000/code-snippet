// Big-O Complexity notation
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

  // O(2ⁿ) - Exponential time (recursive without memoization)
  if (
    /fibonacci|fib\s*\(/.test(lowerCode) &&
    !/memo|cache|dp/.test(lowerCode)
  ) {
    return "O(2ⁿ)";
  }

  // O(n²) - Quadratic time (nested loops)
  const forLoops = (code.match(/for\s*\(/g) || []).length;
  const whileLoops = (code.match(/while\s*\(/g) || []).length;
  const totalLoops = forLoops + whileLoops;

  if (totalLoops >= 2) {
    return "O(n²)";
  }

  // O(n log n) - Linearithmic time (efficient sorting)
  if (/quicksort|mergesort|heapsort/.test(lowerCode)) {
    return "O(n log n)";
  }

  // O(log n) - Logarithmic time (binary search, divide and conquer)
  if (
    /binary\s*search|binarysearch/.test(lowerCode) ||
    (/while|for/.test(lowerCode) && /\/\s*2|>>|<</.test(code))
  ) {
    return "O(log n)";
  }

  // O(n) - Linear time (single loop, array methods)
  if (
    totalLoops === 1 ||
    /\.map\(|\.filter\(|\.reduce\(|\.foreach\(/i.test(lowerCode)
  ) {
    return "O(n)";
  }

  // O(1) - Constant time (no loops, simple operations)
  if (totalLoops === 0 && !/\.map\(|\.filter\(|\.reduce\(/.test(lowerCode)) {
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

export function getComplexityLabel(complexity: ComplexityLevel): string {
  return complexity;
}
