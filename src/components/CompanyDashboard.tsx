import { useState } from 'react';
import { Button } from './Button';
import { ArrowLeft, Plus, Eye, CheckCircle2, XCircle, TrendingUp, Upload, IndianRupee } from 'lucide-react';

interface CompanyDashboardProps {
  onNavigate: (screen: string, data?: any) => void;
}

export function CompanyDashboard({ onNavigate }: CompanyDashboardProps) {
  const [showCreateTask, setShowCreateTask] = useState(false);

  const analytics = {
    views: 1250,
    submissions: 48,
    approved: 32,
    budgetUsed: 6400
  };

  const campaigns = [
    {
      id: '1',
      title: 'Samsung Galaxy S24 Ultra Review',
      category: 'Tech',
      reward: 250,
      submissions: 15,
      approved: 10,
      budget: 5000,
      status: 'active'
    },
    {
      id: '2',
      title: 'Wireless Headphones Review',
      category: 'Tech',
      reward: 220,
      submissions: 12,
      approved: 8,
      budget: 3000,
      status: 'active'
    }
  ];

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
          {/* Upload Product Image */}
          <div className="bg-white rounded-[20px] p-6">
            <h3 className="text-[#111111] mb-4">Product Images</h3>
            <button className="w-full bg-[#F6F6F9] rounded-[16px] p-8 border-2 border-dashed border-gray-300 hover:border-[#6B4BFF] transition-all">
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 bg-[#6B4BFF]/10 rounded-full flex items-center justify-center">
                  <Upload className="w-6 h-6 text-[#6B4BFF]" />
                </div>
                <p className="text-[#111111]">Upload Product Images</p>
                <p className="text-sm text-[#666666]">JPG, PNG (Max 5 images)</p>
              </div>
            </button>
          </div>

          {/* Task Title */}
          <div className="bg-white rounded-[20px] p-6">
            <label className="block text-[#111111] mb-3">Task Title</label>
            <input
              type="text"
              placeholder="e.g., Samsung Galaxy S24 Ultra Review"
              className="w-full bg-[#F6F6F9] rounded-[16px] px-4 py-4 outline-none text-[#111111]"
            />
          </div>

          {/* Brand Name */}
          <div className="bg-white rounded-[20px] p-6">
            <label className="block text-[#111111] mb-3">Brand/Company Name</label>
            <input
              type="text"
              placeholder="e.g., Samsung Electronics"
              className="w-full bg-[#F6F6F9] rounded-[16px] px-4 py-4 outline-none text-[#111111]"
            />
          </div>

          {/* Task Description */}
          <div className="bg-white rounded-[20px] p-6">
            <label className="block text-[#111111] mb-3">Task Description</label>
            <textarea
              placeholder="Describe what reviewers need to focus on..."
              className="w-full h-32 bg-[#F6F6F9] rounded-[16px] p-4 outline-none resize-none text-[#111111]"
            />
          </div>

          {/* Category Dropdown */}
          <div className="bg-white rounded-[20px] p-6">
            <label className="block text-[#111111] mb-3">Category</label>
            <select className="w-full bg-[#F6F6F9] rounded-[16px] px-4 py-4 outline-none text-[#111111]">
              <option>Select Category</option>
              <option>Tech</option>
              <option>Food</option>
              <option>Health</option>
              <option>Fashion</option>
              <option>Apps</option>
              <option>Services</option>
            </select>
          </div>

          {/* Reward Amount */}
          <div className="bg-white rounded-[20px] p-6">
            <label className="block text-[#111111] mb-3">Reward Amount per Review</label>
            <div className="flex items-center gap-3 bg-[#F6F6F9] rounded-[16px] px-4 py-4">
              <IndianRupee className="w-5 h-5 text-[#666666]" />
              <input
                type="number"
                placeholder="250"
                className="flex-1 bg-transparent outline-none text-[#111111]"
              />
            </div>
          </div>

          {/* Total Budget */}
          <div className="bg-white rounded-[20px] p-6">
            <label className="block text-[#111111] mb-3">Total Campaign Budget</label>
            <div className="flex items-center gap-3 bg-[#F6F6F9] rounded-[16px] px-4 py-4">
              <IndianRupee className="w-5 h-5 text-[#666666]" />
              <input
                type="number"
                placeholder="5000"
                className="flex-1 bg-transparent outline-none text-[#111111]"
              />
            </div>
            <p className="text-sm text-[#666666] mt-2">
              Estimated reviews: 20 (₹5000 / ₹250)
            </p>
          </div>

          {/* Deadline */}
          <div className="bg-white rounded-[20px] p-6">
            <label className="block text-[#111111] mb-3">Campaign Deadline</label>
            <input
              type="date"
              className="w-full bg-[#F6F6F9] rounded-[16px] px-4 py-4 outline-none text-[#111111]"
            />
          </div>
        </div>

        {/* Bottom Action */}
        <div className="fixed bottom-0 left-0 right-0 bg-white px-6 py-4 shadow-lg">
          <div className="max-w-[414px] mx-auto">
            <Button fullWidth>
              Create Task Campaign
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
            <p className="text-[#666666]">Manage your review campaigns</p>
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
                <span className="bg-[#22C55E]/10 text-[#22C55E] px-3 py-1 rounded-full text-xs">
                  Active
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-[#666666]">Reward per review</span>
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
                  <span className="text-[#666666]">Budget remaining</span>
                  <span className="text-[#111111]">₹{campaign.budget}</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" fullWidth>
                    View Details
                  </Button>
                  <Button size="sm" fullWidth>
                    Review Submissions
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
