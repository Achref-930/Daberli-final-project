import { ArrowLeft, SearchX } from 'lucide-react';
import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage: React.FC = () => (
  <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 text-center">
    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-blue-100 text-blue-500 mb-6">
      <SearchX className="w-10 h-10" />
    </div>
    <h1 className="text-6xl font-extrabold text-gray-900 mb-2">404</h1>
    <h2 className="text-2xl font-bold text-gray-700 mb-3">Page not found</h2>
    <p className="text-gray-500 max-w-sm mb-8">
      The page you're looking for doesn't exist or has been moved.
    </p>
    <Link
      to="/"
      className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
    >
      <ArrowLeft className="w-4 h-4" />
      Back to Home
    </Link>
  </div>
);

export default NotFoundPage;
