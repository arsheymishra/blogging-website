import React, { useEffect } from 'react';
import { Link, AlertCircle } from 'lucide-react';

const SlugGenerator = ({ title, value, onChange, isEditable, error }) => {
  useEffect(() => {
    if (!isEditable && title) {
      const generatedSlug = title
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
      onChange(generatedSlug);
    }
  }, [title, isEditable, onChange]);

  return (
    <div className="space-y-3">
      <div className="flex items-center space-x-2">
        <Link size={16} className="text-blue-500" />
        <label className="text-sm font-medium text-gray-700">
          URL Slug
        </label>
        {value && (
          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
            /{value}
          </span>
        )}
      </div>
      
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="url-friendly-slug"
        className={`w-full px-4 py-3 border rounded-lg transition-all duration-200 ${
          error 
            ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
            : isEditable 
              ? 'border-gray-300 focus:ring-blue-500 focus:border-blue-500' 
              : 'bg-gray-50 border-gray-300 cursor-not-allowed'
        } focus:ring-2 focus:outline-none`}
        readOnly={!isEditable}
      />
      
      {error && (
        <div className="flex items-center space-x-2 text-red-600">
          <AlertCircle size={16} />
          <span className="text-sm">{error}</span>
        </div>
      )}
      
      {!isEditable && (
        <p className="text-xs text-gray-500 flex items-center space-x-1">
          <span>🔄</span>
          <span>Automatically generated from title</span>
        </p>
      )}
      
      {value && (
        <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded border">
          <strong>Preview URL:</strong> <code>/{value}</code>
        </div>
      )}
    </div>
  );
};

export default SlugGenerator;
