import React, { useState, useEffect } from 'react';
import { Button } from './Button';
import { ArrowLeft, Plus, Eye, CheckCircle2, XCircle, TrendingUp, Upload, IndianRupee, Edit, Trash2, Pause, Play, CheckCircle, X, Trash } from 'lucide-react';
import { taskQueries, surveyQueries } from '../db/queries';

interface CompanyDashboardProps {
  onNavigate: (screen: string, data?: any) => void;
}

export function CompanyDashboard({ onNavigate }: CompanyDashboardProps) {
  const [showCreateTask, setShowCreateTask] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    brand: '',
    image: '',
    description: '',
    category: '',
    reward: '',
    deadline: ''
  });
  const [surveyFields, setSurveyFields] = useState<Array<{id: string, type: string, label: string, required: boolean, options?: string[]}>>([]);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [campaigns, setCampaigns] = useState<any[]>([]);

  useEffect(() => {
    loadCampaigns();
  }, []);

  const loadCampaigns = () => {
    const allTasks = taskQueries.getAllTasks();
    setCampaigns(allTasks.map(task => {
      // Get all surveys for this task
      const surveys = surveyQueries.getSurveysByTask(task.id);
      const submissions = surveys.length;
      const approved = surveys.filter(s => s.status === 'approved').length;
      const budgetUsed = approved * task.reward;
      const estimatedBudget = task.reward * 20; // Estimated total budget
      const budgetRemaining = Math.max(0, estimatedBudget - budgetUsed);
      
      return {
        id: task.id,
        title: task.title,
        category: task.category || 'General',
        reward: task.reward,
        submissions: submissions,
        approved: approved,
        budget: budgetRemaining,
        budgetUsed: budgetUsed,
        status: task.status
      };
    }));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setUploadedImage(reader.result as string);
      setFormData({ ...formData, image: reader.result as string });
    };
    reader.readAsDataURL(file);
  };

  const handleCreateTask = () => {
    if (!formData.title.trim()) {
      setError('Task title is required');
      return;
    }
    if (!formData.brand.trim()) {
      setError('Brand name is required');
      return;
    }
    if (!formData.reward || parseFloat(formData.reward) <= 0) {
      setError('Valid reward amount is required');
      return;
    }
    if (!formData.category) {
      setError('Please select a category');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Create task in database
      const surveyFieldsJson = surveyFields.length > 0 ? JSON.stringify(surveyFields) : null;
      const task = taskQueries.createTask({
        title: formData.title.trim(),
        brand: formData.brand.trim(),
        image: formData.image || null,
        reward: parseFloat(formData.reward),
        deadline: formData.deadline ? `Due in ${Math.ceil((new Date(formData.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24))} days` : null,
        category: formData.category.toLowerCase(),
        description: formData.description.trim() || null,
        survey_fields: surveyFieldsJson,
        tag: 'New'
      });

      // Reset form
      setFormData({
        title: '',
        brand: '',
        image: '',
        description: '',
        category: '',
        reward: '',
        deadline: ''
      });
      setSurveyFields([]);
      setUploadedImage(null);
      setShowCreateTask(false);
      loadCampaigns();
    } catch (err: any) {
      setError(err.message || 'Failed to create task');
    } finally {
      setLoading(false);
    }
  };

  // Calculate real analytics from campaigns
  const analytics = {
    views: campaigns.reduce((sum, c) => sum + (c.submissions || 0) * 25, 0), // Estimate views based on submissions
    submissions: campaigns.reduce((sum, c) => sum + (c.submissions || 0), 0),
    approved: campaigns.reduce((sum, c) => sum + (c.approved || 0), 0),
    budgetUsed: campaigns.reduce((sum, c) => sum + (c.budgetUsed || 0), 0)
  };

  if (showCreateTask) {
    return (
      <div className="h-full bg-[#F6F6F9] overflow-y-auto pb-24">
        {/* Header */}
        <div className="sticky top-0 bg-white px-6 py-4 flex items-center gap-4 z-10 shadow-sm">
          <button 
            onClick={() => setShowCreateTask(false)}
            className="w-10 h-10 bg-[#F6F6F9] rounded-full flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5 text-[#111111]" />
          </button>
          <h2 className="text-[#111111]">Create New Task</h2>
        </div>

        <div className="px-6 py-6 space-y-6">
          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-[16px] p-4">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

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
              placeholder="e.g., Samsung Galaxy S24 Ultra Survey"
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
              placeholder="Describe what surveyors need to focus on..."
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
            <label className="block text-[#111111] mb-3">Reward Amount per Survey <span className="text-red-500">*</span></label>
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
                        <X className="w-4 h-4" />
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
              onClick={handleCreateTask}
              disabled={loading || !formData.title || !formData.brand || !formData.reward || !formData.category}
            >
              {loading ? 'Creating...' : 'Create Task Campaign'}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-[#F6F6F9] overflow-y-auto pb-6">
      {/* Header */}
      <div className="bg-white px-6 pt-8 pb-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-[#111111] mb-1">Company Dashboard</h1>
            <p className="text-[#666666]">Manage your survey campaigns</p>
          </div>
          <button 
            onClick={() => onNavigate('home')}
            className="text-[#6B4BFF] text-sm"
          >
            Exit
          </button>
        </div>

        {/* Create Task Button */}
        <Button 
          fullWidth
          onClick={() => setShowCreateTask(true)}
          icon={<Plus className="w-5 h-5" />}
        >
          Create New Task
        </Button>
      </div>

      {/* Analytics Cards */}
      <div className="px-6 py-6">
        <h2 className="text-[#111111] mb-4">Live Analytics</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-[20px] p-6 shadow-md">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-10 h-10 bg-[#6B4BFF]/10 rounded-full flex items-center justify-center">
                <Eye className="w-5 h-5 text-[#6B4BFF]" />
              </div>
            </div>
            <p className="text-[#666666] text-sm mb-1">Total Views</p>
            <h3 className="text-[#111111]">{analytics.views.toLocaleString()}</h3>
          </div>

          <div className="bg-white rounded-[20px] p-6 shadow-md">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-10 h-10 bg-[#FFB93F]/10 rounded-full flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-[#FFB93F]" />
              </div>
            </div>
            <p className="text-[#666666] text-sm mb-1">Submissions</p>
            <h3 className="text-[#111111]">{analytics.submissions}</h3>
          </div>

          <div className="bg-white rounded-[20px] p-6 shadow-md">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-10 h-10 bg-[#22C55E]/10 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-[#22C55E]" />
              </div>
            </div>
            <p className="text-[#666666] text-sm mb-1">Approved</p>
            <h3 className="text-[#111111]">{analytics.approved}</h3>
          </div>

          <div className="bg-white rounded-[20px] p-6 shadow-md">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-10 h-10 bg-[#EF4444]/10 rounded-full flex items-center justify-center">
                <IndianRupee className="w-5 h-5 text-[#EF4444]" />
              </div>
            </div>
            <p className="text-[#666666] text-sm mb-1">Budget Used</p>
            <h3 className="text-[#111111]">₹{analytics.budgetUsed.toLocaleString()}</h3>
          </div>
        </div>
      </div>

      {/* Active Campaigns */}
      <div className="px-6 pb-6">
        <h2 className="text-[#111111] mb-4">Active Campaigns</h2>
        <div className="space-y-4">
          {campaigns.map((campaign) => (
            <div key={campaign.id} className="bg-white rounded-[20px] p-6 shadow-md">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-[#111111] mb-1">{campaign.title}</h3>
                  <p className="text-[#666666] text-sm">{campaign.category}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs ${
                  campaign.status === 'active' 
                    ? 'bg-[#22C55E]/10 text-[#22C55E]'
                    : campaign.status === 'paused'
                    ? 'bg-[#FFB93F]/10 text-[#FFB93F]'
                    : 'bg-[#666666]/10 text-[#666666]'
                }`}>
                  {campaign.status === 'active' ? 'Active' : campaign.status === 'paused' ? 'Paused' : 'Completed'}
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-[#666666]">Reward per survey</span>
                  <span className="text-[#111111]">₹{campaign.reward}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#666666]">Submissions</span>
                  <span className="text-[#111111]">{campaign.submissions}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#666666]">Approved</span>
                  <span className="text-[#22C55E]">{campaign.approved}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#666666]">Budget used</span>
                  <span className="text-[#111111]">₹{campaign.budgetUsed || 0}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#666666]">Budget remaining</span>
                  <span className="text-[#111111]">₹{campaign.budget}</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100 space-y-2">
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    fullWidth
                    onClick={() => {
                      const task = taskQueries.getTaskById(campaign.id);
                      if (task) {
                        onNavigate('taskDetails', { task });
                      }
                    }}
                  >
                    View Details
                  </Button>
                  <Button 
                    size="sm" 
                    fullWidth
                    onClick={() => onNavigate('surveyManagement', { taskId: campaign.id })}
                  >
                    Survey Submissions ({campaign.submissions})
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => onNavigate('editTask', { taskId: campaign.id })}
                    className="flex-1"
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                  {campaign.status === 'active' ? (
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => {
                        if (confirm('Pause this task campaign?')) {
                          taskQueries.updateTaskStatus(campaign.id, 'paused');
                          loadCampaigns();
                        }
                      }}
                      className="flex-1"
                    >
                      <Pause className="w-4 h-4 mr-1" />
                      Pause
                    </Button>
                  ) : campaign.status === 'paused' ? (
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => {
                        taskQueries.updateTaskStatus(campaign.id, 'active');
                        loadCampaigns();
                      }}
                      className="flex-1"
                    >
                      <Play className="w-4 h-4 mr-1" />
                      Resume
                    </Button>
                  ) : (
                    <Button 
                      size="sm" 
                      variant="outline"
                      disabled
                      className="flex-1"
                    >
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Completed
                    </Button>
                  )}
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => {
                      if (confirm('Are you sure you want to delete this task? This action cannot be undone.')) {
                        taskQueries.deleteTask(campaign.id);
                        loadCampaigns();
                      }
                    }}
                    className="flex-1 text-red-500 border-red-200 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
