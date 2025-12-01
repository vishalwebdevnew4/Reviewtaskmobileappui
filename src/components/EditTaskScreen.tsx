import React, { useState, useEffect } from 'react';
import { ArrowLeft, Upload, XCircle, IndianRupee, Plus, X, Trash } from 'lucide-react';
import { Button } from './Button';
import { taskQueries } from '../db/queries';

interface EditTaskScreenProps {
  onNavigate: (screen: string, data?: any) => void;
  onBack: () => void;
  taskId: number;
}

export function EditTaskScreen({ onNavigate, onBack, taskId }: EditTaskScreenProps) {
  const [formData, setFormData] = useState({
    title: '',
    brand: '',
    image: '',
    description: '',
    category: '',
    reward: '',
    deadline: '',
    status: 'active' as 'active' | 'paused' | 'completed'
  });
  const [surveyFields, setSurveyFields] = useState<Array<{id: string, type: string, label: string, required: boolean, options?: string[]}>>([]);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const task = taskQueries.getTaskById(taskId);
    if (task) {
      setFormData({
        title: task.title || '',
        brand: task.brand || '',
        image: task.image || '',
        description: task.description || '',
        category: task.category || '',
        reward: task.reward?.toString() || '',
        deadline: task.deadline ? (task.deadline.includes('Due in') ? '' : task.deadline) : '',
        status: (task.status as 'active' | 'paused' | 'completed') || 'active'
      });
      if (task.image) {
        setUploadedImage(task.image);
      }
      if (task.survey_fields) {
        try {
          const fields = JSON.parse(task.survey_fields);
          setSurveyFields(Array.isArray(fields) ? fields : []);
        } catch {
          setSurveyFields([]);
        }
      }
    }
  }, [taskId]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setUploadedImage(base64);
      setFormData({ ...formData, image: base64 });
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = () => {
    if (!formData.title.trim() || !formData.brand.trim() || !formData.reward || !formData.category) {
      setError('Please fill all required fields');
      return;
    }

    const rewardNum = parseFloat(formData.reward);
    if (isNaN(rewardNum) || rewardNum <= 0) {
      setError('Reward must be a positive number');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const surveyFieldsJson = surveyFields.length > 0 ? JSON.stringify(surveyFields) : null;
      taskQueries.updateTask(taskId, {
        title: formData.title.trim(),
        brand: formData.brand.trim(),
        image: formData.image || undefined,
        description: formData.description.trim() || undefined,
        category: formData.category,
        reward: rewardNum,
        deadline: formData.deadline || undefined,
        status: formData.status,
        survey_fields: surveyFieldsJson
      });

      setSuccess(true);
      setTimeout(() => {
        onBack();
      }, 1000);
    } catch (err: any) {
      setError(err.message || 'Failed to update task');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full bg-[#F6F6F9] overflow-y-auto pb-24">
      {/* Header */}
      <div className="sticky top-0 bg-white px-6 py-4 flex items-center gap-4 z-10 shadow-sm">
        <button 
          onClick={onBack}
          className="w-10 h-10 bg-[#F6F6F9] rounded-full flex items-center justify-center"
        >
          <ArrowLeft className="w-5 h-5 text-[#111111]" />
        </button>
        <h2 className="text-[#111111]">Edit Task</h2>
      </div>

      <div className="px-6 py-6 space-y-6">
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-[16px]">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}
        {success && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-[16px]">
            <p className="text-green-600 text-sm">Task updated successfully!</p>
          </div>
        )}

        {/* Task Status */}
        <div className="bg-white rounded-[20px] p-6">
          <label className="block text-[#111111] mb-3">Task Status</label>
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'paused' | 'completed' })}
            className="w-full bg-[#F6F6F9] rounded-[16px] px-4 py-4 outline-none text-[#111111]"
          >
            <option value="active">Active</option>
            <option value="paused">Paused</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        {/* Upload Product Image */}
        <div className="bg-white rounded-[20px] p-6">
          <h3 className="text-[#111111] mb-4">Product Image</h3>
          {uploadedImage ? (
            <div className="relative">
              <img src={uploadedImage} alt="Product" className="w-full h-48 object-cover rounded-[16px]" />
              <button
                onClick={() => {
                  setUploadedImage(null);
                  setFormData({ ...formData, image: '' });
                }}
                className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <label className="block w-full bg-[#F6F6F9] rounded-[16px] p-8 border-2 border-dashed border-gray-300 hover:border-[#6B4BFF] transition-all cursor-pointer">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 bg-[#6B4BFF]/10 rounded-full flex items-center justify-center">
                  <Upload className="w-6 h-6 text-[#6B4BFF]" />
                </div>
                <p className="text-[#111111]">Upload Product Image</p>
                <p className="text-sm text-[#666666]">JPG, PNG (Max 5MB)</p>
              </div>
            </label>
          )}
        </div>

        {/* Task Title */}
        <div className="bg-white rounded-[20px] p-6">
          <label className="block text-[#111111] mb-3">Task Title <span className="text-red-500">*</span></label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="e.g., Samsung Galaxy S24 Ultra Review"
            className="w-full bg-[#F6F6F9] rounded-[16px] px-4 py-4 outline-none text-[#111111]"
          />
        </div>

        {/* Brand Name */}
        <div className="bg-white rounded-[20px] p-6">
          <label className="block text-[#111111] mb-3">Brand/Company Name <span className="text-red-500">*</span></label>
          <input
            type="text"
            value={formData.brand}
            onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
            placeholder="e.g., Samsung Electronics"
            className="w-full bg-[#F6F6F9] rounded-[16px] px-4 py-4 outline-none text-[#111111]"
          />
        </div>

        {/* Task Description */}
        <div className="bg-white rounded-[20px] p-6">
          <label className="block text-[#111111] mb-3">Task Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Describe what reviewers need to focus on..."
            className="w-full h-32 bg-[#F6F6F9] rounded-[16px] p-4 outline-none resize-none text-[#111111]"
          />
        </div>

        {/* Category Dropdown */}
        <div className="bg-white rounded-[20px] p-6">
          <label className="block text-[#111111] mb-3">Category <span className="text-red-500">*</span></label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full bg-[#F6F6F9] rounded-[16px] px-4 py-4 outline-none text-[#111111]"
          >
            <option value="">Select Category</option>
            <option value="tech">Tech</option>
            <option value="food">Food</option>
            <option value="health">Health</option>
            <option value="fashion">Fashion</option>
            <option value="apps">Apps</option>
            <option value="services">Services</option>
          </select>
        </div>

        {/* Reward Amount */}
        <div className="bg-white rounded-[20px] p-6">
          <label className="block text-[#111111] mb-3">Reward Amount per Review <span className="text-red-500">*</span></label>
          <div className="flex items-center gap-3 bg-[#F6F6F9] rounded-[16px] px-4 py-4">
            <IndianRupee className="w-5 h-5 text-[#666666]" />
            <input
              type="number"
              value={formData.reward}
              onChange={(e) => setFormData({ ...formData, reward: e.target.value })}
              placeholder="250"
              min="1"
              className="flex-1 bg-transparent outline-none text-[#111111]"
            />
          </div>
        </div>

        {/* Deadline */}
        <div className="bg-white rounded-[20px] p-6">
          <label className="block text-[#111111] mb-3">Campaign Deadline</label>
          <input
            type="date"
            value={formData.deadline}
            onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
            min={new Date().toISOString().split('T')[0]}
            className="w-full bg-[#F6F6F9] rounded-[16px] px-4 py-4 outline-none text-[#111111]"
          />
        </div>

        {/* Custom Survey Questions */}
        <div className="bg-white rounded-[20px] p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[#111111]">Custom Survey Questions</h3>
            <button
              onClick={() => {
                const newField = {
                  id: Date.now().toString(),
                  type: 'text',
                  label: '',
                  required: false
                };
                setSurveyFields([...surveyFields, newField]);
              }}
              className="flex items-center gap-2 text-[#6B4BFF] text-sm font-medium"
            >
              <Plus className="w-4 h-4" />
              Add Question
            </button>
          </div>

          {surveyFields.length === 0 ? (
            <p className="text-[#666666] text-sm">No custom questions added. Surveyors will use the default format (rating, text, images).</p>
          ) : (
            <div className="space-y-4">
              {surveyFields.map((field, index) => (
                <div key={field.id} className="bg-[#F6F6F9] rounded-[16px] p-4">
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-sm text-[#666666]">Question {index + 1}</span>
                    <button
                      onClick={() => setSurveyFields(surveyFields.filter(f => f.id !== field.id))}
                      className="text-[#EF4444] hover:text-[#dc2626]"
                    >
                      <Trash className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm text-[#666666] mb-2">Question Label</label>
                      <input
                        type="text"
                        value={field.label}
                        onChange={(e) => {
                          const updated = [...surveyFields];
                          updated[index].label = e.target.value;
                          setSurveyFields(updated);
                        }}
                        placeholder="e.g., What is your age?"
                        className="w-full bg-white rounded-[12px] px-3 py-2 outline-none text-[#111111] text-sm"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm text-[#666666] mb-2">Field Type</label>
                      <select
                        value={field.type}
                        onChange={(e) => {
                          const updated = [...surveyFields];
                          updated[index].type = e.target.value;
                          if (e.target.value !== 'select' && e.target.value !== 'radio') {
                            delete updated[index].options;
                          } else if (!updated[index].options) {
                            updated[index].options = ['Option 1', 'Option 2'];
                          }
                          setSurveyFields(updated);
                        }}
                        className="w-full bg-white rounded-[12px] px-3 py-2 outline-none text-[#111111] text-sm"
                      >
                        <option value="text">Text Input</option>
                        <option value="textarea">Long Text</option>
                        <option value="number">Number</option>
                        <option value="email">Email</option>
                        <option value="select">Dropdown</option>
                        <option value="radio">Radio Buttons</option>
                        <option value="checkbox">Checkbox</option>
                      </select>
                    </div>

                    {(field.type === 'select' || field.type === 'radio') && (
                      <div>
                        <label className="block text-sm text-[#666666] mb-2">Options (one per line)</label>
                        <textarea
                          value={field.options?.join('\n') || ''}
                          onChange={(e) => {
                            const updated = [...surveyFields];
                            updated[index].options = e.target.value.split('\n').filter(o => o.trim());
                            setSurveyFields(updated);
                          }}
                          placeholder="Option 1&#10;Option 2&#10;Option 3"
                          className="w-full bg-white rounded-[12px] px-3 py-2 outline-none text-[#111111] text-sm min-h-[80px]"
                        />
                      </div>
                    )}

                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={field.required}
                        onChange={(e) => {
                          const updated = [...surveyFields];
                          updated[index].required = e.target.checked;
                          setSurveyFields(updated);
                        }}
                        className="w-4 h-4 text-[#6B4BFF] rounded"
                      />
                      <label className="text-sm text-[#666666]">Required field</label>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Bottom Action */}
      <div className="fixed bottom-0 left-0 right-0 bg-white px-6 py-4 shadow-lg">
        <div className="max-w-[414px] mx-auto">
          <Button
            fullWidth
            onClick={handleSubmit}
            disabled={loading || !formData.title || !formData.brand || !formData.reward || !formData.category}
          >
            {loading ? 'Updating...' : 'Update Task'}
          </Button>
        </div>
      </div>
    </div>
  );
}

