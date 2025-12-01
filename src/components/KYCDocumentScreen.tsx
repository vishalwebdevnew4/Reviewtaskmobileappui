import React, { useState } from 'react';
import { ArrowLeft, Upload, Check, CreditCard, FileText, BookOpen, IdCard, X } from 'lucide-react';
import { Button } from './Button';
import { useAuth } from '../contexts/AuthContext';
import { kycQueries } from '../db/queries';

interface KYCDocumentScreenProps {
  onNavigate: (screen: string, data?: any) => void;
  onBack: () => void;
}

type DocumentType = 'aadhaar' | 'pan' | 'passport' | 'license' | null;

export function KYCDocumentScreen({ onNavigate, onBack }: KYCDocumentScreenProps) {
  const { user } = useAuth();
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [documentNumber, setDocumentNumber] = useState('');
  const [uploadedFront, setUploadedFront] = useState(false);
  const [uploadedBack, setUploadedBack] = useState(false);
  const [frontImage, setFrontImage] = useState(null);
  const [backImage, setBackImage] = useState(null);
  const [error, setError] = useState('');

  const documents = [
    {
      id: 'aadhaar' as DocumentType,
      name: 'Aadhaar Card',
      icon: <IdCard className="w-6 h-6" />,
      description: 'Government-issued ID card',
      requiresBoth: true,
      numberPlaceholder: 'XXXX XXXX XXXX'
    },
    {
      id: 'pan' as DocumentType,
      name: 'PAN Card',
      icon: <CreditCard className="w-6 h-6" />,
      description: 'Permanent Account Number',
      requiresBoth: false,
      numberPlaceholder: 'ABCDE1234F'
    },
    {
      id: 'passport' as DocumentType,
      name: 'Passport',
      icon: <BookOpen className="w-6 h-6" />,
      description: 'Valid Indian passport',
      requiresBoth: false,
      numberPlaceholder: 'A1234567'
    },
    {
      id: 'license' as DocumentType,
      name: 'Driver\'s License',
      icon: <FileText className="w-6 h-6" />,
      description: 'Valid driving license',
      requiresBoth: true,
      numberPlaceholder: 'DL-XX-YYYY-XXXXXXX'
    }
  ];

  const handleFileUpload = (side: 'front' | 'back', event: any) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
    if (!validTypes.includes(file.type)) {
      setError('Please upload JPG, PNG or PDF file');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      return;
    }

    setError('');

    // Convert to base64 for storage (in production, upload to server)
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      if (side === 'front') {
        setFrontImage(base64String);
        setUploadedFront(true);
      } else {
        setBackImage(base64String);
        setUploadedBack(true);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleContinue = () => {
    if (!user?.id) {
      setError('User not found. Please login again.');
      return;
    }

    if (!selectedDocument) {
      setError('Please select a document type');
      return;
    }

    if (!documentNumber.trim()) {
      setError('Please enter document number');
      return;
    }

    setError('');

    try {
      // Save document info to database (photos are optional)
      const selectedDoc = documents.find(d => d.id === selectedDocument);
      const documentImage = (uploadedFront || uploadedBack) 
        ? (selectedDoc?.requiresBoth && uploadedBack
          ? JSON.stringify({ front: frontImage || null, back: backImage || null })
          : JSON.stringify({ front: frontImage || null }))
        : undefined;

      kycQueries.saveKYCInfo(user.id, {
        document_type: selectedDocument,
        document_number: documentNumber.trim(),
        document_image: documentImage,
        status: 'pending'
      });

      // Navigate to verification method screen
      onNavigate('kycVerificationMethod', { 
        documentType: selectedDocument,
        documentNumber: documentNumber.trim()
      });
    } catch (err: any) {
      setError(err.message || 'Failed to save document');
    }
  };

  const handleSkip = () => {
    if (!user?.id) {
      setError('User not found. Please login again.');
      return;
    }
    
    setError('');
    
    try {
      // Save basic info only, skip document verification
      kycQueries.saveKYCInfo(user.id, {
        status: 'basic_info_complete'
      });
      // Navigate to status screen
      onNavigate('kycStatus');
    } catch (err: any) {
      setError(err.message || 'Failed to save');
    }
  };

  const selectedDoc = documents.find(d => d.id === selectedDocument);
  const canContinue = selectedDocument && documentNumber.trim();

  return (
    <div className="h-full bg-[#F6F6F9] flex flex-col">
      {/* Header */}
      <div className="bg-white px-6 pt-8 pb-6">
        <button onClick={onBack} className="mb-4">
          <ArrowLeft className="w-6 h-6 text-[#111111]" />
        </button>
        <h1 className="text-[#111111] mb-2">Document Verification</h1>
        <p className="text-[#666666] text-sm">Enter your document number (photo upload optional)</p>
        
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
        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-[16px]">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

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
                  setDocumentNumber('');
                  setFrontImage(null);
                  setBackImage(null);
                  setError('');
                }}
                className="text-sm text-[#6B4BFF]"
              >
                Change
              </button>
            </div>

            {/* Document Number */}
            <div className="bg-white rounded-[20px] p-6 shadow-md mb-4">
              <label className="block text-sm text-[#666666] mb-2">
                Document Number <span className="text-[#EF4444]">*</span>
              </label>
              <input
                type="text"
                value={documentNumber}
                onChange={(e) => setDocumentNumber(e.target.value.toUpperCase())}
                placeholder={selectedDoc?.numberPlaceholder}
                className="w-full px-4 py-3 bg-[#F6F6F9] rounded-[12px] text-[#111111] placeholder:text-[#999999] border-none outline-none focus:ring-2 focus:ring-[#6B4BFF]/20"
              />
              <p className="text-xs text-[#666666] mt-2">
                Enter your {selectedDoc?.name} number. Photo upload is optional.
              </p>
            </div>

            {/* Upload Areas */}
            <div className="space-y-4">
              {/* Front Side */}
              <div className="bg-white rounded-[20px] p-6 shadow-md">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[#111111]">Front Side <span className="text-xs text-[#666666] font-normal">(Optional)</span></h3>
                  {uploadedFront && (
                    <div className="flex items-center gap-2 text-[#22C55E]">
                      <Check className="w-5 h-5" />
                      <span className="text-sm">Uploaded</span>
                    </div>
                  )}
                </div>
                
                {!uploadedFront ? (
                  <label className="block w-full aspect-[3/2] border-2 border-dashed border-[#E5E5E5] rounded-[12px] flex flex-col items-center justify-center gap-3 hover:border-[#6B4BFF] hover:bg-[#6B4BFF]/5 transition-colors cursor-pointer">
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={(e) => handleFileUpload('front', e)}
                      className="hidden"
                    />
                    <div className="w-12 h-12 bg-[#6B4BFF]/10 rounded-full flex items-center justify-center">
                      <Upload className="w-6 h-6 text-[#6B4BFF]" />
                    </div>
                    <div className="text-center">
                      <p className="text-[#111111] mb-1">Tap to upload</p>
                      <p className="text-xs text-[#666666]">JPG, PNG or PDF (Max 5MB)</p>
                    </div>
                  </label>
                ) : (
                  <div className="w-full aspect-[3/2] bg-[#F6F6F9] rounded-[12px] flex items-center justify-center relative">
                    {frontImage && frontImage.startsWith('data:image') ? (
                      <img 
                        src={frontImage} 
                        alt="Front document" 
                        className="w-full h-full object-contain rounded-[12px]"
                      />
                    ) : (
                      <div className="text-center">
                        <div className="w-16 h-16 bg-[#22C55E]/10 rounded-full flex items-center justify-center mx-auto mb-3">
                          <Check className="w-8 h-8 text-[#22C55E]" />
                        </div>
                        <p className="text-[#111111]">Document uploaded</p>
                      </div>
                    )}
                    <button
                      onClick={() => {
                        setUploadedFront(false);
                        setFrontImage(null);
                      }}
                      className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              {/* Back Side (if required) */}
              {selectedDoc?.requiresBoth && (
                <div className="bg-white rounded-[20px] p-6 shadow-md">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-[#111111]">Back Side <span className="text-xs text-[#666666] font-normal">(Optional)</span></h3>
                    {uploadedBack && (
                      <div className="flex items-center gap-2 text-[#22C55E]">
                        <Check className="w-5 h-5" />
                        <span className="text-sm">Uploaded</span>
                      </div>
                    )}
                  </div>
                  
                  {!uploadedBack ? (
                    <label className="block w-full aspect-[3/2] border-2 border-dashed border-[#E5E5E5] rounded-[12px] flex flex-col items-center justify-center gap-3 hover:border-[#6B4BFF] hover:bg-[#6B4BFF]/5 transition-colors cursor-pointer">
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        onChange={(e) => handleFileUpload('back', e)}
                        className="hidden"
                      />
                      <div className="w-12 h-12 bg-[#6B4BFF]/10 rounded-full flex items-center justify-center">
                        <Upload className="w-6 h-6 text-[#6B4BFF]" />
                      </div>
                      <div className="text-center">
                        <p className="text-[#111111] mb-1">Tap to upload</p>
                        <p className="text-xs text-[#666666]">JPG, PNG or PDF (Max 5MB)</p>
                      </div>
                    </label>
                  ) : (
                    <div className="w-full aspect-[3/2] bg-[#F6F6F9] rounded-[12px] flex items-center justify-center relative">
                      {backImage && backImage.startsWith('data:image') ? (
                        <img 
                          src={backImage} 
                          alt="Back document" 
                          className="w-full h-full object-contain rounded-[12px]"
                        />
                      ) : (
                        <div className="text-center">
                          <div className="w-16 h-16 bg-[#22C55E]/10 rounded-full flex items-center justify-center mx-auto mb-3">
                            <Check className="w-8 h-8 text-[#22C55E]" />
                          </div>
                          <p className="text-[#111111]">Document uploaded</p>
                        </div>
                      )}
                      <button
                        onClick={() => {
                          setUploadedBack(false);
                          setBackImage(null);
                        }}
                        className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Info Box */}
            <div className="mt-4 bg-[#EEF2FF] rounded-[12px] p-4">
              <p className="text-xs text-[#6B4BFF]">
                ℹ️ Document number is required. Photo uploads are optional but recommended for faster verification.
              </p>
            </div>

            {/* Tips (if photos uploaded) */}
            {(uploadedFront || uploadedBack) && (
              <div className="mt-4 bg-[#FFF7ED] rounded-[12px] p-4">
                <p className="text-sm text-[#111111] mb-2">📸 Tips for better results:</p>
                <ul className="text-xs text-[#666666] space-y-1 pl-4">
                  <li>• Ensure all corners are visible</li>
                  <li>• Avoid glare and shadows</li>
                  <li>• Text should be clear and readable</li>
                  <li>• Use good lighting</li>
                </ul>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom Buttons */}
      <div className="bg-white px-6 py-4 shadow-lg space-y-3">
        {selectedDocument && (
          <Button
            fullWidth
            onClick={handleContinue}
            disabled={!canContinue}
          >
            Continue to Verification
          </Button>
        )}
        <Button
          fullWidth
          onClick={() => {
            // Skip document upload and go directly to status
            if (!user?.id) {
              setError('User not found. Please login again.');
              return;
            }
            
            try {
              // Update KYC status to pending (without document)
              kycQueries.saveKYCInfo(user.id, {
                status: 'pending',
                verification_method: 'basic_info_only'
              });
              
              onNavigate('kycStatus', { skipDocument: true });
            } catch (err: any) {
              setError(err.message || 'Failed to save');
            }
          }}
          variant="secondary"
        >
          {selectedDocument ? 'Skip Document Upload' : 'Continue Without Document'}
        </Button>
      </div>
    </div>
  );
}
