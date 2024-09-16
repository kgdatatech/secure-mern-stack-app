import React, { useState, useEffect } from 'react';
import RichTextEditor from '../../common/RichTextEditor';
import ImageUploader from '../../common/ImageUploader';
import useCmsContent from '../../../hooks/useCmsContent';

const HomePageEditor = () => {
  const { content, loading, error, saveContent } = useCmsContent('homepage');
  const [previewContent, setPreviewContent] = useState(null);

  useEffect(() => {
    if (content) {
      setPreviewContent(content.sections);
    }
  }, [content]);

  const handleTextChange = (newText, sectionKey, fieldKey, index = null) => {
    const updatedSections = { ...content.sections };

    if (index !== null) {
      updatedSections[sectionKey][index][fieldKey] = newText;
    } else {
      updatedSections[sectionKey][fieldKey] = newText;
    }

    saveContent({ ...content, sections: updatedSections });
    setPreviewContent(updatedSections);
  };

  const handleImageUpload = (imageUrl, sectionKey, index) => {
    const updatedSections = { ...content.sections };
    if (updatedSections[sectionKey] && Array.isArray(updatedSections[sectionKey])) {
      updatedSections[sectionKey][index].imageUrl = imageUrl;
    } else {
      updatedSections[sectionKey].imageUrl = imageUrl;
    }
    saveContent({ ...content, sections: updatedSections });
    setPreviewContent(updatedSections);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="flex space-x-4">
      <div className="w-2/3">
        <h1 className="text-2xl font-semibold mb-4">Edit Home Page</h1>

        {/* Slider Section */}
        <h2 className="text-xl font-semibold mb-2">Slider Section</h2>
        {previewContent?.slider?.map((slide, index) => (
          <div key={index} className="mb-6">
            <RichTextEditor
              content={slide.title}
              setContent={(newText) => handleTextChange(newText, 'slider', 'title', index)}
            />
            <RichTextEditor
              content={slide.subtitle}
              setContent={(newText) => handleTextChange(newText, 'slider', 'subtitle', index)}
            />
            <ImageUploader
              onUpload={(imageUrl) => handleImageUpload(imageUrl, 'slider', index)}
            />
          </div>
        ))}

        {/* Features Section */}
        <h2 className="text-xl font-semibold mb-2">Features Section</h2>
        {previewContent?.features?.map((feature, index) => (
          <div key={index} className="mb-6">
            <RichTextEditor
              content={feature.title}
              setContent={(newText) => handleTextChange(newText, 'features', 'title', index)}
            />
            <RichTextEditor
              content={feature.description}
              setContent={(newText) => handleTextChange(newText, 'features', 'description', index)}
            />
          </div>
        ))}

        {/* Join Us Section */}
        <h2 className="text-xl font-semibold mb-2">Join Us Section</h2>
        <RichTextEditor
          content={previewContent?.joinUs?.title || ''}
          setContent={(newText) => handleTextChange(newText, 'joinUs', 'title')}
        />
        <RichTextEditor
          content={previewContent?.joinUs?.description || ''}
          setContent={(newText) => handleTextChange(newText, 'joinUs', 'description')}
        />
      </div>

      <div className="w-1/3 p-4 border rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Live Preview</h2>
        <div className="space-y-4">
          {/* Render Preview of Slider Section */}
          {previewContent?.slider?.map((slide, index) => (
            <div key={index} className="p-4 mb-4 border rounded-lg shadow">
              <h3 className="text-lg font-bold">{slide.title}</h3>
              <p>{slide.subtitle}</p>
              {slide.imageUrl && (
                <img src={slide.imageUrl} alt={slide.title} className="mt-2 rounded" />
              )}
            </div>
          ))}

          {/* Render Preview of Features Section */}
          {previewContent?.features?.map((feature, index) => (
            <div key={index} className="p-4 mb-4 border rounded-lg shadow">
              <h3 className="text-lg font-bold">{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}

          {/* Render Preview of Join Us Section */}
          <div className="p-4 mb-4 border rounded-lg shadow">
            <h3 className="text-lg font-bold">{previewContent?.joinUs?.title || 'Join Us'}</h3>
            <p>{previewContent?.joinUs?.description || 'Description goes here...'}</p>
            <button className="mt-2 py-2 px-4 bg-teal-600 text-white rounded-md">
              {previewContent?.joinUs?.buttonText || 'Join Now'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePageEditor;
