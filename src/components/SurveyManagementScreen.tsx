import React, { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle2, XCircle, Clock, Star, Image as ImageIcon, MessageSquare } from 'lucide-react';
import { Button } from './Button';
import { useAuth } from '../contexts/AuthContext';
import { surveyQueries, taskQueries, userQueries } from '../db/queries';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { emailService } from '../config/email';

interface SurveyManagementScreenProps {
  onNavigate: (screen: string, data?: any) => void;
  onBack: () => void;
  taskId?: number;
}

export function SurveyManagementScreen({ onNavigate, onBack, taskId }: SurveyManagementScreenProps) {
  const { user } = useAuth();
  const [surveys, setSurveys] = useState<any[]>([]);
  const [task, setTask] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [processingId, setProcessingId] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState<number | null>(null);
  const [feedbackRating, setFeedbackRating] = useState<number>(0);
  const [feedbackText, setFeedbackText] = useState('');

  useEffect(() => {
    if (taskId) {
      loadSurveys();
      const taskData = taskQueries.getTaskById(taskId);
      setTask(taskData);
    } else {
      setLoading(false);
    }
  }, [taskId, filter]);

  const loadSurveys = () => {
    if (!taskId) return;
    
    setLoading(true);
    try {
      const allSurveys = surveyQueries.getSurveysByTask(taskId);
      const filtered = filter === 'all' 
        ? allSurveys 
        : allSurveys.filter(s => s.status === filter);
      setSurveys(filtered);
    } catch (error) {
      console.error('Error loading surveys:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (surveyId: number) => {
    if (!taskId) return;
    
    setProcessingId(surveyId);
    try {
      const survey = surveys.find(s => s.id === surveyId);
      if (survey) {
        const taskData = taskQueries.getTaskById(taskId);
        surveyQueries.updateSurveyStatus(surveyId, 'approved');
        
        // Send email notification
        const surveyor = userQueries.getUserById(survey.user_id);
        if (surveyor?.email && taskData) {
          emailService.sendSurveyApprovalEmail(surveyor.email, taskData.title, taskData.reward).catch(err => {
            console.error('Failed to send approval email:', err);
          });
        }
        
        loadSurveys();
      }
    } catch (error) {
      console.error('Error approving survey:', error);
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (surveyId: number) => {
    if (!taskId) return;
    
    // Show feedback form if not already shown
    if (showFeedback !== surveyId) {
      setShowFeedback(surveyId);
      setFeedbackText('');
      setFeedbackRating(0);
      return;
    }
    
    setProcessingId(surveyId);
    try {
      const survey = surveys.find(s => s.id === surveyId);
      if (survey) {
        const taskData = taskQueries.getTaskById(taskId);
        surveyQueries.updateSurveyStatus(
          surveyId, 
          'rejected', 
          feedbackText || undefined, 
          feedbackRating > 0 ? feedbackRating : undefined
        );
        
        // Send email notification
        const surveyor = userQueries.getUserById(survey.user_id);
        if (surveyor?.email && taskData) {
          emailService.sendSurveyRejectionEmail(
            surveyor.email, 
            taskData.title, 
            feedbackText || 'Survey did not meet requirements'
          ).catch(err => {
            console.error('Failed to send rejection email:', err);
          });
        }
        
        setShowFeedback(null);
        setFeedbackText('');
        setFeedbackRating(0);
        loadSurveys();
      }
    } catch (error) {
      console.error('Error rejecting survey:', error);
    } finally {
      setProcessingId(null);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle2 className="w-5 h-5 text-[#22C55E]" />;
      case 'rejected':
        return <XCircle className="w-5 h-5 text-[#EF4444]" />;
      default:
        return <Clock className="w-5 h-5 text-[#FFB93F]" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-[#22C55E]/10 text-[#22C55E]';
      case 'rejected':
        return 'bg-[#EF4444]/10 text-[#EF4444]';
      default:
        return 'bg-[#FFB93F]/10 text-[#FFB93F]';
    }
  };

  return (
    <div className="h-full bg-[#F6F6F9] flex flex-col">
      {/* Header */}
      <div className="bg-white px-6 pt-8 pb-6">
        <button onClick={onBack} className="mb-4">
          <ArrowLeft className="w-6 h-6 text-[#111111]" />
        </button>
        <h1 className="text-[#111111] mb-2">Survey Management</h1>
        {task && (
          <p className="text-[#666666] text-sm">{task.title}</p>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white px-6 py-4">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          {(['all', 'pending', 'approved', 'rejected'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-[12px] whitespace-nowrap transition-all ${
                filter === f
                  ? 'bg-[#6B4BFF] text-white'
                  : 'bg-[#F6F6F9] text-[#666666]'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)} ({surveys.filter(s => f === 'all' || s.status === f).length})
            </button>
          ))}
        </div>
      </div>

      {/* Surveys List */}
      <div className="flex-1 px-6 py-6 overflow-y-auto">
        {loading ? (
          <div className="text-center py-12">
            <div className="w-12 h-12 border-4 border-[#6B4BFF] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-[#666666]">Loading surveys...</p>
          </div>
        ) : surveys.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-[#F6F6F9] rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-10 h-10 text-[#666666]" />
            </div>
            <h3 className="text-[#111111] mb-2">No surveys found</h3>
            <p className="text-[#666666]">
              {filter === 'all' 
                ? 'No surveys have been submitted yet for this task.'
                : `No ${filter} surveys found.`}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {surveys.map((survey) => (
              <div key={survey.id} className="bg-white rounded-[20px] p-6 shadow-md">
                {/* Survey Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#6B4BFF]/10 rounded-full flex items-center justify-center">
                      <span className="text-[#6B4BFF] font-semibold">
                        {survey.user_name?.charAt(0).toUpperCase() || 'U'}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-[#111111]">{survey.user_name || 'Anonymous'}</h3>
                      <p className="text-sm text-[#666666]">
                        {new Date(survey.created_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                  <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${getStatusColor(survey.status)}`}>
                    {getStatusIcon(survey.status)}
                    <span className="text-xs font-medium capitalize">{survey.status}</span>
                  </div>
                </div>

                {/* Rating */}
                {survey.rating && (
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-4 h-4 ${
                            star <= survey.rating
                              ? 'fill-[#FFB93F] text-[#FFB93F]'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-[#666666]">{survey.rating}/5</span>
                  </div>
                )}

                {/* Survey Text */}
                {survey.survey_text && (
                  <p className="text-[#111111] mb-4">{survey.survey_text}</p>
                )}

                {/* Custom Field Responses */}
                {survey.custom_responses && (() => {
                  try {
                    const customResponses = JSON.parse(survey.custom_responses);
                    const taskFields = task?.survey_fields ? (() => {
                      try {
                        return JSON.parse(task.survey_fields);
                      } catch {
                        return [];
                      }
                    })() : [];
                    
                    if (Object.keys(customResponses).length > 0 && taskFields.length > 0) {
                      return (
                        <div className="mb-4 space-y-3">
                          <h4 className="text-sm font-semibold text-[#666666] mb-2">Custom Responses:</h4>
                          {taskFields.map((field: any) => {
                            const response = customResponses[field.id];
                            if (response === undefined || response === null || response === '') return null;
                            
                            return (
                              <div key={field.id} className="bg-[#F6F6F9] rounded-[12px] p-3">
                                <p className="text-sm font-medium text-[#666666] mb-1">{field.label || 'Question'}</p>
                                <p className="text-[#111111]">
                                  {field.type === 'checkbox' 
                                    ? (response === true || response === 'true' ? 'Yes' : 'No')
                                    : String(response)}
                                </p>
                              </div>
                            );
                          })}
                        </div>
                      );
                    }
                    return null;
                  } catch {
                    return null;
                  }
                })()}

                {/* Survey Images */}
                {survey.images && (() => {
                  try {
                    const images = JSON.parse(survey.images);
                    const imageArray = Array.isArray(images) ? images : [images];
                    return imageArray.length > 0 ? (
                      <div className="grid grid-cols-3 gap-2 mb-4">
                        {imageArray.map((img: string, idx: number) => (
                          <div key={idx} className="relative aspect-square rounded-[12px] overflow-hidden bg-[#F6F6F9]">
                            <ImageWithFallback
                              src={img}
                              alt={`Survey image ${idx + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    ) : null;
                  } catch {
                    return null;
                  }
                })()}

                {/* Actions */}
                {survey.status === 'pending' && (
                  <div className="pt-4 border-t border-gray-100">
                    {showFeedback === survey.id ? (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm text-[#666666] mb-2">Feedback (Optional)</label>
                          <textarea
                            value={feedbackText}
                            onChange={(e) => setFeedbackText(e.target.value)}
                            placeholder="e.g., Survey too short, photos unclear, etc."
                            className="w-full p-3 bg-[#F6F6F9] rounded-[12px] text-[#111111] placeholder:text-[#999999] border-none outline-none focus:ring-2 focus:ring-[#6B4BFF]/20 min-h-[100px]"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-[#666666] mb-2">Rate Surveyor (Optional)</label>
                          <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`w-6 h-6 cursor-pointer ${
                                  star <= feedbackRating ? 'fill-[#FFB93F] text-[#FFB93F]' : 'text-gray-300'
                                }`}
                                onClick={() => setFeedbackRating(star === feedbackRating ? 0 : star)}
                              />
                            ))}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            fullWidth
                            onClick={() => {
                              setShowFeedback(null);
                              setFeedbackText('');
                              setFeedbackRating(0);
                            }}
                            disabled={processingId === survey.id}
                          >
                            Cancel
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            fullWidth
                            onClick={() => handleReject(survey.id)}
                            disabled={processingId === survey.id}
                          >
                            {processingId === survey.id ? 'Rejecting...' : 'Confirm Reject'}
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          fullWidth
                          onClick={() => handleReject(survey.id)}
                          disabled={processingId === survey.id}
                          className="border-[#EF4444] text-[#EF4444] hover:bg-[#EF4444] hover:text-white"
                        >
                          Reject
                        </Button>
                        <Button
                          size="sm"
                          fullWidth
                          onClick={() => handleApprove(survey.id)}
                          disabled={processingId === survey.id}
                        >
                          {processingId === survey.id ? 'Approving...' : 'Approve'}
                        </Button>
                      </div>
                    )}
                  </div>
                )}

                {survey.status === 'approved' && (
                  <div className="pt-4 border-t border-gray-100 space-y-3">
                    <p className="text-sm text-[#22C55E]">
                      ✓ Approved - Reward of ₹{task?.reward || 0} credited to surveyor
                    </p>
                  </div>
                )}

                {survey.status === 'rejected' && (
                  <div className="pt-4 border-t border-gray-100 space-y-3">
                    <p className="text-sm text-[#EF4444]">
                      ✗ Rejected - Survey did not meet requirements
                    </p>
                    {survey.feedback_text && (
                      <div className="bg-[#F6F6F9] rounded-[12px] p-3">
                        <p className="text-sm text-[#666666] mb-1">Feedback:</p>
                        <p className="text-sm text-[#111111]">{survey.feedback_text}</p>
                      </div>
                    )}
                    {survey.company_rating && survey.company_rating > 0 && (
                      <div className="bg-[#F6F6F9] rounded-[12px] p-3">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-[#666666]">Surveyor Rating:</span>
                          <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`w-4 h-4 ${
                                  star <= survey.company_rating
                                    ? 'fill-[#FFB93F] text-[#FFB93F]'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-xs text-[#666666]">({survey.company_rating}/5)</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

