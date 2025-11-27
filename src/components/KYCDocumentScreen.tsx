import { ArrowLeft, Upload, Check, CreditCard, FileText, BookOpen, IdCard } from 'lucide-react';
import { Button } from './Button';
import { useState, useRef } from 'react';
import { submitKYC } from '../services/kycService';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';

interface KYCDocumentScreenProps {
  onNavigate: (screen: string, data?: any) => void;
  onBack: () => void;
  basicInfo?: {
    fullName: string;
    dob: string;
    phone: string;
    email: string;
  };
}

type DocumentType = 'aadhaar' | 'pan' | null;

export function KYCDocumentScreen({ onNavigate, onBack, basicInfo }: KYCDocumentScreenProps) {
  const { user } = useAuth();
  const [selectedDocument, setSelectedDocument] = useState<DocumentType>(null);
  const [frontFile, setFrontFile] = useState<File | null>(null);
  const [backFile, setBackFile] = useState<File | null>(null);
  const [frontPreview, setFrontPreview] = useState<string | null>(null);
  const [backPreview, setBackPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const frontInputRef = useRef<HTMLInputElement>(null);
  const backInputRef = useRef<HTMLInputElement>(null);

  const documents = [
    {
      id: 'aadhaar' as DocumentType,
      name: 'Aadhaar Card',
      icon: <IdCard className="w-6 h-6" />,
      description: 'Government-issued ID card',
      requiresBoth: true
    },
    {
      id: 'pan' as DocumentType,
      name: 'PAN Card',
      icon: <CreditCard className="w-6 h-6" />,
      description: 'Permanent Account Number',
      requiresBoth: false
    },
  ];

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, side: 'front' | 'back') => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
    if (!validTypes.includes(file.type)) {
      toast.error('Please upload JPG, PNG or PDF file');
      return;
    }

    if (side === 'front') {
      setFrontFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setFrontPreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setBackFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setBackPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!user || !basicInfo) {
      toast.error('Please login and complete basic info first');
      onBack();
      return;
    }

    if (!selectedDocument) {
      toast.error('Please select a document type');
      return;
    }

    if (!frontFile) {
      toast.error('Please upload front side of document');
      return;
    }

    const selectedDoc = documents.find(d => d.id === selectedDocument);
    if (selectedDoc?.requiresBoth && !backFile) {
      toast.error('Please upload back side of document');
      return;
    }

    setLoading(true);
    try {
      await submitKYC(
        user.uid,
        basicInfo.fullName,
        basicInfo.dob,
        basicInfo.phone,
        basicInfo.email,
        selectedDocument,
        frontFile,
        backFile || frontFile // Use front file if back not required
      );
      toast.success('KYC submitted successfully!');
      onNavigate('kycStatus', { status: 'pending' });
    } catch (error: any) {
      toast.error(error.message || 'Failed to submit KYC');
    } finally {
      setLoading(false);
    }
  };

  const selectedDoc = documents.find(d => d.id === selectedDocument);
  const canContinue = selectedDocument && frontFile && (!selectedDoc?.requiresBoth || backFile);

  return (
    <div className="h-full bg-[#F6F6F9] flex flex-col">
      {/* Header */}
      <div className="bg-white px-6 pt-8 pb-6">
        <button onClick={onBack} className="mb-4">
          <ArrowLeft className="w-6 h-6 text-[#111111]" />
        </button>
        <h1 className="text-[#111111] mb-2">Document Verification</h1>
        <p className="text-[#666666] text-sm">Upload a valid government ID</p>
        
        {/* Progress Indicator */}
        <div className="flex items-center gap-2 mt-6">
          <div className="flex-1 h-1 bg-[#6B4BFF] rounded-full"></div>
          <div className="flex-1 h-1 bg-[#6B4BFF] rounded-full"></div>
          <div className="flex-1 h-1 bg-[#E5E5E5] rounded-full"></div>
        </div>
        <p className="text-xs text-[#666666] mt-2">Step 2 of 3</p>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 py-6 overflow-y-auto">
        {/* Document Selection */}
        {!selectedDocument ? (
          <div>
            <h2 className="text-[#111111] mb-4">Select Document Type</h2>
            <div className="space-y-3">
              {documents.map((doc) => (
                <button
                  key={doc.id}
                  onClick={() => setSelectedDocument(doc.id)}
                  className="w-full bg-white rounded-[20px] p-4 shadow-md text-left hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#6B4BFF]/10 rounded-full flex items-center justify-center text-[#6B4BFF]">
                      {doc.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-[#111111] mb-1">{doc.name}</h3>
                      <p className="text-sm text-[#666666]">{doc.description}</p>
                    </div>
                    <div className="w-6 h-6 rounded-full border-2 border-[#E5E5E5]"></div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[#111111]">Upload {selectedDoc?.name}</h2>
              <button
                onClick={() => {
                  setSelectedDocument(null);
                  setUploadedFront(false);
                  setUploadedBack(false);
                }}
                className="text-sm text-[#6B4BFF]"
              >
                Change
              </button>
            </div>

            {/* Upload Areas */}
            <div className="space-y-4">
              {/* Front Side */}
              <div className="bg-white rounded-[20px] p-6 shadow-md">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[#111111]">Front Side</h3>
                  {frontFile && (
                    <div className="flex items-center gap-2 text-[#22C55E]">
                      <Check className="w-5 h-5" />
                      <span className="text-sm">Uploaded</span>
                    </div>
                  )}
                </div>
                
                <input
                  ref={frontInputRef}
                  type="file"
                  accept="image/*,.pdf"
                  onChange={(e) => handleFileSelect(e, 'front')}
                  className="hidden"
                />
                {!frontFile ? (
                  <button
                    onClick={() => frontInputRef.current?.click()}
                    className="w-full aspect-[3/2] border-2 border-dashed border-[#E5E5E5] rounded-[12px] flex flex-col items-center justify-center gap-3 hover:border-[#6B4BFF] hover:bg-[#6B4BFF]/5 transition-colors"
                  >
                    <div className="w-12 h-12 bg-[#6B4BFF]/10 rounded-full flex items-center justify-center">
                      <Upload className="w-6 h-6 text-[#6B4BFF]" />
                    </div>
                    <div className="text-center">
                      <p className="text-[#111111] mb-1">Tap to upload</p>
                      <p className="text-xs text-[#666666]">JPG, PNG or PDF (Max 5MB)</p>
                    </div>
                  </button>
                ) : (
                  <div className="w-full aspect-[3/2] bg-[#F6F6F9] rounded-[12px] overflow-hidden relative">
                    {frontPreview && (
                      <img
                        src={frontPreview}
                        alt="Front document"
                        className="w-full h-full object-contain"
                      />
                    )}
                    <div className="absolute bottom-2 right-2 flex gap-2">
                      <button
                        onClick={() => {
                          setFrontFile(null);
                          setFrontPreview(null);
                        }}
                        className="px-3 py-1 bg-[#EF4444] text-white rounded-[8px] text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Back Side (if required) */}
              {selectedDoc?.requiresBoth && (
                <div className="bg-white rounded-[20px] p-6 shadow-md">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-[#111111]">Back Side</h3>
                    {backFile && (
                      <div className="flex items-center gap-2 text-[#22C55E]">
                        <Check className="w-5 h-5" />
                        <span className="text-sm">Uploaded</span>
                      </div>
                    )}
                  </div>
                  
                  <input
                    ref={backInputRef}
                    type="file"
                    accept="image/*,.pdf"
                    onChange={(e) => handleFileSelect(e, 'back')}
                    className="hidden"
                  />
                  {!backFile ? (
                    <button
                      onClick={() => backInputRef.current?.click()}
                      className="w-full aspect-[3/2] border-2 border-dashed border-[#E5E5E5] rounded-[12px] flex flex-col items-center justify-center gap-3 hover:border-[#6B4BFF] hover:bg-[#6B4BFF]/5 transition-colors"
                    >
                      <div className="w-12 h-12 bg-[#6B4BFF]/10 rounded-full flex items-center justify-center">
                        <Upload className="w-6 h-6 text-[#6B4BFF]" />
                      </div>
                      <div className="text-center">
                        <p className="text-[#111111] mb-1">Tap to upload</p>
                        <p className="text-xs text-[#666666]">JPG, PNG or PDF (Max 5MB)</p>
                      </div>
                    </button>
                  ) : (
                    <div className="w-full aspect-[3/2] bg-[#F6F6F9] rounded-[12px] overflow-hidden relative">
                      {backPreview && (
                        <img
                          src={backPreview}
                          alt="Back document"
                          className="w-full h-full object-contain"
                        />
                      )}
                      <div className="absolute bottom-2 right-2 flex gap-2">
                        <button
                          onClick={() => {
                            setBackFile(null);
                            setBackPreview(null);
                          }}
                          className="px-3 py-1 bg-[#EF4444] text-white rounded-[8px] text-sm"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Tips */}
            <div className="mt-4 bg-[#FFF7ED] rounded-[12px] p-4">
              <p className="text-sm text-[#111111] mb-2">📸 Tips for better results:</p>
              <ul className="text-xs text-[#666666] space-y-1 pl-4">
                <li>• Ensure all corners are visible</li>
                <li>• Avoid glare and shadows</li>
                <li>• Text should be clear and readable</li>
                <li>• Use good lighting</li>
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Button */}
      {selectedDocument && (
        <div className="bg-white px-6 py-4 shadow-lg">
          <Button
            fullWidth
            onClick={handleSubmit}
            disabled={loading || !canContinue}
          >
            {loading ? 'Submitting...' : 'Submit KYC'}
          </Button>
        </div>
      )}
    </div>
  );
}