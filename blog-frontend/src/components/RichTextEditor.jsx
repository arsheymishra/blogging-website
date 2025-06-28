import React, { useMemo } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { AlertCircle } from 'lucide-react';

const RichTextEditor = ({ value, onChange, error }) => {
  const modules = useMemo(() => ({
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'indent': '-1'}, { 'indent': '+1' }],
      ['link', 'image', 'video'],
      ['blockquote', 'code-block'],
      [{ 'align': [] }],
      ['clean']
    ],
  }), []);

  const formats = [
    'header', 'bold', 'italic', 'underline', 'strike',
    'color', 'background', 'list', 'bullet', 'indent',
    'link', 'image', 'video', 'blockquote', 'code-block', 'align'
  ];

  return (
    <div className="space-y-2">
      <div className={`rounded-lg overflow-hidden border-2 transition-colors ${
        error ? 'border-red-300' : 'border-gray-200 focus-within:border-blue-500'
      }`}>
        <ReactQuill 
          value={value} 
          onChange={onChange}
          modules={modules}
          formats={formats}
          theme="snow"
          placeholder="Start writing your amazing content here..."
          style={{ minHeight: '300px' }}
        />
      </div>
      
      {error && (
        <div className="flex items-center space-x-2 text-red-600">
          <AlertCircle size={16} />
          <span className="text-sm">{error}</span>
        </div>
      )}
      
      <div className="text-xs text-gray-500">
        💡 <strong>Tip:</strong> Use headings to structure your content and make it more readable
      </div>
    </div>
  );
};

export default RichTextEditor;
