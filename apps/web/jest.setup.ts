import '@testing-library/jest-dom';
import 'whatwg-fetch';
process.env.NEXT_PUBLIC_API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';
