// src/components/admin/cms/PolicyPageEditor.jsx

import React from 'react';
import RichTextEditor from '../../common/RichTextEditor';
import useCmsContent from '../../../hooks/useCmsContent';

const PolicyPageEditor = () => {
  const { content, loading, error, saveContent } = useCmsContent('policy');

  const handleContentChange = (newContent) => {
    saveContent({ ...content, text: newContent });
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Edit Policy Page</h1>
      <RichTextEditor value={content.text} onChange={handleContentChange} />
    </div>
  );
};

export default PolicyPageEditor;
