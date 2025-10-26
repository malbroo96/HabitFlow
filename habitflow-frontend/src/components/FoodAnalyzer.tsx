import React, { useState, useRef } from 'react';
import Button from './Button';

interface FoodAnalysis {
  name: string;
  calories: string;
  protein: string;
  description: string;
  healthTips: string;
  raw?: string;
}

const FoodAnalyzer = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [analysis, setAnalysis] = useState<FoodAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setError('Image size should be less than 5MB');
        return;
      }
      
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setError('');
      setAnalysis(null);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedImage) {
      setError('Please select an image first');
      return;
    }

    setIsLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('image', selectedImage);

    try {
      const response = await fetch('http://localhost:3000/api/gemini/analyze-food', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();
      setAnalysis(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to analyze image');
      setAnalysis(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setSelectedImage(null);
    setImagePreview('');
    setAnalysis(null);
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Food Analyzer</h2>

        <div className="space-y-6">
          {/* Image Upload Section */}
          <div className="space-y-4">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              className="hidden"
              id="food-image-input"
            />
            <div className="flex gap-4">
              <Button
                label="Select Image"
                onClick={() => fileInputRef.current?.click()}
              />
              {selectedImage && (
                <>
                  <Button
                    label="Analyze"
                    onClick={handleAnalyze}
                    disabled={isLoading}
                  />
                  <Button
                    label="Reset"
                    onClick={handleReset}
                    bgColor="bg-red-500"
                    hoverColor="hover:bg-red-600"
                  />
                </>
              )}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="text-red-500 bg-red-50 p-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-500 mx-auto"></div>
              <p className="text-gray-600 mt-2">Analyzing your food image...</p>
            </div>
          )}

          {/* Image Preview */}
          {imagePreview && (
            <div className="mt-4">
              <img
                src={imagePreview}
                alt="Selected food"
                className="max-h-64 rounded-lg mx-auto"
              />
            </div>
          )}

          {/* Analysis Results */}
          {analysis && (
            <div className="mt-6 space-y-4">
              {analysis.raw ? (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <pre className="whitespace-pre-wrap">{analysis.raw}</pre>
                </div>
              ) : (
                <div className="bg-emerald-50 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold text-emerald-900 mb-4">
                    {analysis.name}
                  </h3>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-white p-4 rounded-lg shadow">
                      <p className="text-sm text-gray-600">Calories</p>
                      <p className="text-lg font-bold text-emerald-600">
                        {analysis.calories}
                      </p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow">
                      <p className="text-sm text-gray-600">Protein</p>
                      <p className="text-lg font-bold text-emerald-600">
                        {analysis.protein}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <h4 className="font-medium text-emerald-800">Description</h4>
                      <p className="text-gray-700">{analysis.description}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-emerald-800">Health Tips</h4>
                      <p className="text-gray-700">{analysis.healthTips}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FoodAnalyzer;