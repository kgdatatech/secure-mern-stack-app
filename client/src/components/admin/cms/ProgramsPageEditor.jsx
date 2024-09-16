// src/components/admin/cms/ProgramsPageEditor.jsx

import React from 'react';
import RichTextEditor from '../../common/RichTextEditor';
import ImageUploader from '../../common/ImageUploader';
import useCmsContent from '../../../hooks/useCmsContent';

const ProgramsPageEditor = () => {
  const { content, loading, error, saveContent } = useCmsContent('programs');

  const handleContentChange = (newContent) => {
    saveContent({ ...content, text: newContent });
  };

  const handleImageUpload = (imageUrl) => {
    saveContent({ ...content, image: imageUrl });
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Edit Programs Page</h1>
      <RichTextEditor value={content.text} onChange={handleContentChange} />
      <ImageUploader onUpload={handleImageUpload} />
    </div>
  );
};

export default ProgramsPageEditor;
