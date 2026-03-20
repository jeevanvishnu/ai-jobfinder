import { useRef, useState } from 'react';
import toast from 'react-hot-toast';
import DashboardLayout from '../components/layout/DashboardLayout';
import {
  CloudUpload,
  FolderOpen,
  Code,
  Monitor,
  Layout,
  Database,
  Cpu,
  ClipboardList,
  LineChart,
  Code2,
  Plus,
  BadgeCheck
} from 'lucide-react';

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;
const ACCEPT_ATTRIBUTE =
  '.pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document';
const ACCEPTED_EXTENSIONS = new Set(['pdf', 'doc', 'docx']);
const ACCEPTED_MIME_TYPES = new Set([
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]);

const formatFileSize = (fileSize: number) => {
  if (fileSize < 1024) {
    return `${fileSize} B`;
  }

  if (fileSize < 1024 * 1024) {
    return `${(fileSize / 1024).toFixed(1)} KB`;
  }

  return `${(fileSize / (1024 * 1024)).toFixed(2)} MB`;
};

const UploadResume = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const dragDepthRef = useRef(0);

  const validateFile = (file: File) => {
    const extension = file.name.split('.').pop()?.toLowerCase() ?? '';
    const isValidType = ACCEPTED_EXTENSIONS.has(extension) || ACCEPTED_MIME_TYPES.has(file.type);

    if (!isValidType) {
      return 'Only PDF, DOC, and DOCX files are supported.';
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      return 'File is too large. Maximum size is 5MB.';
    }

    return null;
  };

  const processFile = (file: File) => {
    const validationError = validateFile(file);

    if (validationError) {
      toast.error(validationError);
      return;
    }

    setSelectedFile(file);
    toast.success('Resume selected successfully.');
  };

  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  const clearSelectedFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    processFile(file);
  };

  const handleDragEnter = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    dragDepthRef.current += 1;
    setIsDragging(true);
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    event.dataTransfer.dropEffect = 'copy';
    setIsDragging(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    dragDepthRef.current -= 1;
    if (dragDepthRef.current <= 0) {
      setIsDragging(false);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
    dragDepthRef.current = 0;

    const file = event.dataTransfer.files?.[0];
    if (!file) return;
    processFile(file);
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col h-full">
        <h1 className="text-[28px] font-extrabold text-gray-900 mb-2 tracking-tight">Upload your Resume</h1>
        <p className="text-[15px] text-gray-500 mb-8 font-medium">
          Our AI will scan your profile to find the perfect job matches for your career path.
        </p>

        {/* Upload Area */}
        <div
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border border-dashed rounded-[18px] p-24 flex flex-col items-center justify-center mb-8 mx-1 transition-colors ${
            isDragging ? 'border-[#2563EB] bg-[#EDF2FE]' : 'border-[#B8C4DB] bg-transparent'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={ACCEPT_ATTRIBUTE}
            className="hidden"
            onChange={handleFileChange}
          />
          <div className="w-[60px] h-[60px] bg-[#EDF2FE] rounded-full flex items-center justify-center text-[#2563EB] mb-5">
            <CloudUpload size={28} strokeWidth={2.5} />
          </div>
          <h2 className="text-[20px] font-bold text-gray-900 mb-2">Drag and drop your resume here</h2>
          <p className="text-[14px] text-gray-500 font-medium mb-6">Support for PDF, DOCX (Max 5MB)</p>
          <button
            type="button"
            onClick={openFilePicker}
            className="bg-[#2563EB] hover:bg-blue-600 text-white px-7 py-3 rounded-lg flex items-center gap-2 font-semibold text-[15px] transition-colors shadow-sm"
          >
            <FolderOpen size={18} strokeWidth={2.5} />
            Browse Files
          </button>

          {selectedFile && (
            <div className="mt-6 w-full max-w-xl bg-white border border-gray-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <p className="text-sm font-bold text-gray-900 break-all">{selectedFile.name}</p>
                <p className="text-xs text-gray-500 mt-1">{formatFileSize(selectedFile.size)}</p>
              </div>
              <button
                type="button"
                onClick={clearSelectedFile}
                className="text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors self-start sm:self-center"
              >
                Remove file
              </button>
            </div>
          )}
        </div>

        {/* Extracted Skills */}
        <div className="bg-white border border-gray-200/60 rounded-xl p-6 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] mx-1">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className="text-[#2563EB]">
                <BadgeCheck size={22} className="fill-[#2563EB] text-white" />
              </div>
              <h3 className="text-[17px] font-bold text-gray-900">Extracted Skills</h3>
            </div>
            <span className="bg-[#ECFDF3] text-[#027A48] px-3.5 py-1.5 rounded-full text-[12px] font-bold tracking-wide">
              AI Updated
            </span>
          </div>

          <div className="flex flex-wrap gap-3 mt-6">
            <div className="bg-[#F8F9FB] border border-gray-100 rounded-lg px-4 py-2.5 flex items-center gap-2.5 text-[14px] font-semibold text-gray-700">
              <Code size={16} className="text-gray-500" /> Python
            </div>
            <div className="bg-[#F8F9FB] border border-gray-100 rounded-lg px-4 py-2.5 flex items-center gap-2.5 text-[14px] font-semibold text-gray-700">
              <Monitor size={16} className="text-gray-500" /> React
            </div>
            <div className="bg-[#F8F9FB] border border-gray-100 rounded-lg px-4 py-2.5 flex items-center gap-2.5 text-[14px] font-semibold text-gray-700">
              <Layout size={16} className="text-gray-500" /> UI Design
            </div>
            <div className="bg-[#F8F9FB] border border-gray-100 rounded-lg px-4 py-2.5 flex items-center gap-2.5 text-[14px] font-semibold text-gray-700">
              <Database size={16} className="text-gray-500" /> SQL
            </div>
            <div className="bg-[#F8F9FB] border border-gray-100 rounded-lg px-4 py-2.5 flex items-center gap-2.5 text-[14px] font-semibold text-gray-700">
              <Cpu size={16} className="text-gray-500" /> Machine Learning
            </div>
            <div className="bg-[#F8F9FB] border border-gray-100 rounded-lg px-4 py-2.5 flex items-center gap-2.5 text-[14px] font-semibold text-gray-700">
              <ClipboardList size={16} className="text-gray-500" /> Project Management
            </div>
            <div className="bg-[#F8F9FB] border border-gray-100 rounded-lg px-4 py-2.5 flex items-center gap-2.5 text-[14px] font-semibold text-gray-700">
              <LineChart size={16} className="text-gray-500" /> Data Analysis
            </div>
            <div className="bg-[#F8F9FB] border border-gray-100 rounded-lg px-4 py-2.5 flex items-center gap-2.5 text-[14px] font-semibold text-gray-700">
              <Code2 size={16} className="text-gray-500" /> TypeScript
            </div>
            <button className="bg-transparent border border-dashed border-gray-300 rounded-lg px-4 py-2.5 flex items-center gap-2 text-[14px] font-semibold text-gray-500 hover:bg-gray-50 transition-colors">
              <Plus size={16} /> Add Skill
            </button>
          </div>
        </div>

        {/* Footer Content Wrapper */}
        <div className="mt-auto pt-16">
          <div className="flex justify-between items-center text-[12px] font-semibold text-gray-400">
            <p>(c) 2024 AutoJob AI. Secure and Encrypted.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-gray-600 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-gray-600 transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-gray-600 transition-colors">Support</a>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default UploadResume;
