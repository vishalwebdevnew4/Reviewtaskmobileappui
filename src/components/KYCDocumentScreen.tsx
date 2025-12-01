import React, { useState } from 'react';
import { ArrowLeft, Upload, Check, CreditCard, FileText, BookOpen, IdCard, X } from 'lucide-react';
import { Button } from './Button';
<<<<<<< HEAD
import { useAuth } from '../contexts/AuthContext';
import { kycQueries } from '../db/queries';
=======
import { useState, useRef } from 'react';
import { submitKYC } from '../services/kycService';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';
>>>>>>> 95a7a5e7a05734a6107330862d5c52cfb36e0c4d

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

<<<<<<< HEAD
export function KYCDocumentScreen({ onNavigate, onBack }: KYCDocumentScreenProps) {
  const { user } = useAuth();
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [documentNumber, setDocumentNumber] = useState('');
  const [uploadedFront, setUploadedFront] = useState(false);
  const [uploadedBack, setUploadedBack] = useState(false);
  const [frontImage, setFrontImage] = useState(null);
  const [backImage, setBackImage] = useState(null);
  const [error, setError] = useState('');
=======
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
>>>>>>> 95a7a5e7a05734a6107330862d5c52cfb36e0c4d

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
<<<<<<< HEAD
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
=======
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
>>>>>>> 95a7a5e7a05734a6107330862d5c52cfb36e0c4d
      return;
    }

    if (!selectedDocument) {
<<<<<<< HEAD
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
=======
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
>>>>>>> 95a7a5e7a05734a6107330862d5c52cfb36e0c4d
    }
  };

  const selectedDoc = documents.find(d => d.id === selectedDocument);
<<<<<<< HEAD
  const canContinue = selectedDocument && documentNumber.trim();
=======
  const canContinue = selectedDocument && frontFile && (!selectedDoc?.requiresBoth || backFile);
>>>>>>> 95a7a5e7a05734a6107330862d5c52cfb36e0c4d

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
<<<<<<< HEAD
                  <h3 className="text-[#111111]">Front Side <span className="text-xs text-[#666666] font-normal">(Optional)</span></h3>
                  {uploadedFront && (
=======
                  <h3 className="text-[#111111]">Front Side</h3>
                  {frontFile && (
>>>>>>> 95a7a5e7a05734a6107330862d5c52cfb36e0c4d
                    <div className="flex items-center gap-2 text-[#22C55E]">
                      <Check className="w-5 h-5" />
                      <span className="text-sm">Uploaded</span>
                    </div>
                  )}
                </div>
                
<<<<<<< HEAD
                {!uploadedFront ? (
                  <label className="block w-full aspect-[3/2] border-2 border-dashed border-[#E5E5E5] rounded-[12px] flex flex-col items-center justify-center gap-3 hover:border-[#6B4BFF] hover:bg-[#6B4BFF]/5 transition-colors cursor-pointer">
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={(e) => handleFileUpload('front', e)}
                      className="hidden"
                    />
=======
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
>>>>>>> 95a7a5e7a05734a6107330862d5c52cfb36e0c4d
                    <div className="w-12 h-12 bg-[#6B4BFF]/10 rounded-full flex items-center justify-center">
                      <Upload className="w-6 h-6 text-[#6B4BFF]" />
                    </div>
                    <div className="text-center">
                      <p className="text-[#111111] mb-1">Tap to upload</p>
                      <p className="text-xs text-[#666666]">JPG, PNG or PDF (Max 5MB)</p>
                    </div>
                  </label>
                ) : (
<<<<<<< HEAD
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
=======
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
>>>>>>> 95a7a5e7a05734a6107330862d5c52cfb36e0c4d
                  </div>
                )}
              </div>

              {/* Back Side (if required) */}
              {selectedDoc?.requiresBoth && (
                <div className="bg-white rounded-[20px] p-6 shadow-md">
                  <div className="flex items-center justify-between mb-4">
<<<<<<< HEAD
                    <h3 className="text-[#111111]">Back Side <span className="text-xs text-[#666666] font-normal">(Optional)</span></h3>
                    {uploadedBack && (
=======
                    <h3 className="text-[#111111]">Back Side</h3>
                    {backFile && (
>>>>>>> 95a7a5e7a05734a6107330862d5c52cfb36e0c4d
                      <div className="flex items-center gap-2 text-[#22C55E]">
                        <Check className="w-5 h-5" />
                        <span className="text-sm">Uploaded</span>
                      </div>
                    )}
                  </div>
                  
<<<<<<< HEAD
                  {!uploadedBack ? (
                    <label className="block w-full aspect-[3/2] border-2 border-dashed border-[#E5E5E5] rounded-[12px] flex flex-col items-center justify-center gap-3 hover:border-[#6B4BFF] hover:bg-[#6B4BFF]/5 transition-colors cursor-pointer">
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        onChange={(e) => handleFileUpload('back', e)}
                        className="hidden"
                      />
=======
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
>>>>>>> 95a7a5e7a05734a6107330862d5c52cfb36e0c4d
                      <div className="w-12 h-12 bg-[#6B4BFF]/10 rounded-full flex items-center justify-center">
                        <Upload className="w-6 h-6 text-[#6B4BFF]" />
                      </div>
                      <div className="text-center">
                        <p className="text-[#111111] mb-1">Tap to upload</p>
                        <p className="text-xs text-[#666666]">JPG, PNG or PDF (Max 5MB)</p>
                      </div>
                    </label>
                  ) : (
<<<<<<< HEAD
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
=======
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
>>>>>>> 95a7a5e7a05734a6107330862d5c52cfb36e0c4d
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
            onClick={handleSubmit}
            disabled={loading || !canContinue}
          >
            {loading ? 'Submitting...' : 'Submit KYC'}
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
