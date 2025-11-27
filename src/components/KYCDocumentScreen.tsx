import { ArrowLeft, Upload, Check, CreditCard, FileText, BookOpen, IdCard } from 'lucide-react';
import { Button } from './Button';
import { useState } from 'react';

interface KYCDocumentScreenProps {
  onNavigate: (screen: string, data?: any) => void;
  onBack: () => void;
}

type DocumentType = 'aadhaar' | 'pan' | 'passport' | 'license' | null;

export function KYCDocumentScreen({ onNavigate, onBack }: KYCDocumentScreenProps) {
  const [selectedDocument, setSelectedDocument] = useState<DocumentType>(null);
  const [uploadedFront, setUploadedFront] = useState(false);
  const [uploadedBack, setUploadedBack] = useState(false);

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
    {
      id: 'passport' as DocumentType,
      name: 'Passport',
      icon: <BookOpen className="w-6 h-6" />,
      description: 'Valid Indian passport',
      requiresBoth: false
    },
    {
      id: 'license' as DocumentType,
      name: 'Driver\'s License',
      icon: <FileText className="w-6 h-6" />,
      description: 'Valid driving license',
      requiresBoth: true
    }
  ];

  const handleContinue = () => {
    onNavigate('kycVerificationMethod', { documentType: selectedDocument });
  };

  const handleFileUpload = (side: 'front' | 'back') => {
    // Simulate file upload
    if (side === 'front') {
      setUploadedFront(true);
    } else {
      setUploadedBack(true);
    }
  };

  const selectedDoc = documents.find(d => d.id === selectedDocument);
  const canContinue = selectedDocument && uploadedFront && (!selectedDoc?.requiresBoth || uploadedBack);

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
                  {uploadedFront && (
                    <div className="flex items-center gap-2 text-[#22C55E]">
                      <Check className="w-5 h-5" />
                      <span className="text-sm">Uploaded</span>
                    </div>
                  )}
                </div>
                
                {!uploadedFront ? (
                  <button
                    onClick={() => handleFileUpload('front')}
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
                  <div className="w-full aspect-[3/2] bg-[#F6F6F9] rounded-[12px] flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-[#22C55E]/10 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Check className="w-8 h-8 text-[#22C55E]" />
                      </div>
                      <p className="text-[#111111]">Document uploaded</p>
                      <button
                        onClick={() => setUploadedFront(false)}
                        className="text-sm text-[#6B4BFF] mt-2"
                      >
                        Replace
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
                    {uploadedBack && (
                      <div className="flex items-center gap-2 text-[#22C55E]">
                        <Check className="w-5 h-5" />
                        <span className="text-sm">Uploaded</span>
                      </div>
                    )}
                  </div>
                  
                  {!uploadedBack ? (
                    <button
                      onClick={() => handleFileUpload('back')}
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
                    <div className="w-full aspect-[3/2] bg-[#F6F6F9] rounded-[12px] flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-[#22C55E]/10 rounded-full flex items-center justify-center mx-auto mb-3">
                          <Check className="w-8 h-8 text-[#22C55E]" />
                        </div>
                        <p className="text-[#111111]">Document uploaded</p>
                        <button
                          onClick={() => setUploadedBack(false)}
                          className="text-sm text-[#6B4BFF] mt-2"
                        >
                          Replace
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
            onClick={handleContinue}
            disabled={!canContinue}
          >
            Continue to Verification
          </Button>
        </div>
      )}
    </div>
  );
}