import { useState, useRef } from 'react';
import { Button } from './Button';
import { ArrowLeft, Star, Upload, X, Camera } from 'lucide-react';
import { submitReview } from '../services/reviewService';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';

interface SubmitReviewScreenProps {
  task: any;
  onNavigate: (screen: string, data?: any) => void;
}

export function SubmitReviewScreen({ task, onNavigate }: SubmitReviewScreenProps) {
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + uploadedFiles.length > 10) {
      toast.error('Maximum 10 files allowed');
      return;
    }

    // Validate file size (max 10MB)
    const validFiles = files.filter((file) => {
      if (file.size > 10 * 1024 * 1024) {
        toast.error(`${file.name} is too large. Max size is 10MB.`);
        return false;
      }
      return true;
    });

    setUploadedFiles([...uploadedFiles, ...validFiles]);

    // Create preview URLs
    validFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrls((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveFile = (index: number) => {
    setUploadedFiles(uploadedFiles.filter((_, i) => i !== index));
    setPreviewUrls(previewUrls.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!user) {
      toast.error('Please login to submit a review');
      onNavigate('login');
      return;
    }

    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }

    if (reviewText.length < 50) {
      toast.error('Review text must be at least 50 characters');
      return;
    }

    if (uploadedFiles.length < 2) {
      toast.error('At least 2 images are required');
      return;
    }

    setLoading(true);
    try {
      await submitReview(user.uid, task.id, rating, reviewText, uploadedFiles);
      toast.success('Review submitted successfully! It will be reviewed by our team.');
    onNavigate('myTasks');
    } catch (error: any) {
      toast.error(error.message || 'Failed to submit review');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full bg-[#F6F6F9] overflow-y-auto pb-24">
      {/* Header */}
      <div className="sticky top-0 bg-white px-6 py-4 flex items-center gap-4 z-10 shadow-sm">
        <button 
          onClick={() => onNavigate('taskDetails', { task })}
          className="w-10 h-10 bg-[#F6F6F9] rounded-full flex items-center justify-center"
        >
          <ArrowLeft className="w-5 h-5 text-[#111111]" />
        </button>
        <h2 className="text-[#111111]">Submit Review</h2>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* Task Info */}
        <div className="bg-white rounded-[20px] p-4">
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 bg-[#F6F6F9] rounded-[16px] flex items-center justify-center">
              <span className="text-2xl">📦</span>
            </div>
            <div className="flex-1">
              <h3 className="text-[#111111]">{task?.title}</h3>
              <p className="text-[#666666] text-sm">{task?.brand}</p>
            </div>
            <div className="text-right">
              <p className="text-[#22C55E]">₹{task?.reward}</p>
            </div>
          </div>
        </div>

        {/* Rating */}
        <div className="bg-white rounded-[20px] p-6">
          <h3 className="text-[#111111] mb-4">Rate this product</h3>
          <div className="flex gap-2 justify-center">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                className="transition-transform hover:scale-110"
              >
                <Star
                  className={`w-12 h-12 ${
                    star <= rating
                      ? 'fill-[#FFB93F] text-[#FFB93F]'
                      : 'text-gray-300'
                  }`}
                />
              </button>
            ))}
          </div>
          {rating > 0 && (
            <p className="text-center text-[#666666] mt-3">
              {rating === 5 ? 'Excellent!' : rating === 4 ? 'Great!' : rating === 3 ? 'Good' : rating === 2 ? 'Fair' : 'Poor'}
            </p>
          )}
        </div>

        {/* Review Text */}
        <div className="bg-white rounded-[20px] p-6">
          <h3 className="text-[#111111] mb-4">Write your review</h3>
          <textarea
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            placeholder="Share your honest experience with this product. What did you like? What could be improved?"
            className="w-full h-40 bg-[#F6F6F9] rounded-[16px] p-4 outline-none resize-none text-[#111111] placeholder:text-[#666666]"
          />
          <p className="text-sm text-[#666666] mt-2">
            {reviewText.length} / 50 minimum characters
          </p>
        </div>

        {/* Upload Photos */}
        <div className="bg-white rounded-[20px] p-6">
          <h3 className="text-[#111111] mb-4">Upload photos/videos</h3>
          
          {/* Upload Button */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,video/*"
            multiple
            onChange={handleFileSelect}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full bg-[#F6F6F9] rounded-[16px] p-8 border-2 border-dashed border-gray-300 hover:border-[#6B4BFF] transition-all mb-4"
          >
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 bg-[#6B4BFF]/10 rounded-full flex items-center justify-center">
                <Camera className="w-6 h-6 text-[#6B4BFF]" />
              </div>
              <p className="text-[#111111]">Upload Media</p>
              <p className="text-sm text-[#666666]">JPG, PNG or MP4 (Max 10MB)</p>
            </div>
          </button>

          {/* Preview uploaded files */}
          {uploadedFiles.length > 0 && (
            <div className="grid grid-cols-3 gap-3">
              {uploadedFiles.map((file, index) => (
                <div key={index} className="relative">
                  {previewUrls[index] ? (
                    <img
                      src={previewUrls[index]}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-24 object-cover rounded-[12px]"
                    />
                  ) : (
                  <div className="w-full h-24 bg-gray-200 rounded-[12px]"></div>
                  )}
                  <button
                    onClick={() => handleRemoveFile(index)}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-[#EF4444] rounded-full flex items-center justify-center"
                  >
                    <X className="w-4 h-4 text-white" />
                  </button>
                </div>
              ))}
            </div>
          )}
          
          <p className="text-sm text-[#666666] mt-3">
            Minimum 2 photos required ({uploadedFiles.length} uploaded)
          </p>
        </div>

        {/* Guidelines */}
        <div className="bg-[#6B4BFF]/10 rounded-[20px] p-6">
          <h3 className="text-[#6B4BFF] mb-3">Review Guidelines</h3>
          <ul className="space-y-2 text-sm text-[#666666]">
            <li>• Be honest and specific</li>
            <li>• Focus on product features</li>
            <li>• Avoid offensive language</li>
            <li>• Don't include personal information</li>
          </ul>
        </div>
      </div>

      {/* Bottom Action */}
      <div className="fixed bottom-0 left-0 right-0 bg-white px-6 py-4 shadow-lg">
        <div className="max-w-[414px] mx-auto">
          <Button 
            fullWidth
            onClick={handleSubmit}
            disabled={loading || rating === 0 || reviewText.length < 50 || uploadedFiles.length < 2}
          >
            {loading ? 'Submitting...' : 'Submit Review'}
          </Button>
        </div>
      </div>
    </div>
  );
}
