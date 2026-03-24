import { useEffect, useRef, useState } from 'react';
import type { ChangeEvent, DragEvent, KeyboardEvent } from 'react';
import toast from 'react-hot-toast';
import DashboardLayout from '../components/layout/DashboardLayout';
import { useDispatch, useSelector } from 'react-redux';
import { uploadResume } from '../features/DashboardSlice';

import type { AppDispatch, RootState } from '../app/Store';
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
  BadgeCheck,
  X,
  type LucideIcon,
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

const normalizeSkill = (value: string) => value.trim().replace(/\s+/g, ' ');
const toSkillKey = (value: string) => normalizeSkill(value).toLowerCase();

const uniqueSkills = (skills: string[]) => {
  const seen = new Set<string>();
  const result: string[] = [];

  for (const skill of skills) {
    const normalized = normalizeSkill(skill);
    if (!normalized) continue;

    const key = toSkillKey(normalized);
    if (seen.has(key)) continue;

    seen.add(key);
    result.push(normalized);
  }

  return result;
};

const readSkillsFromResume = (resumeData: unknown) => {
  if (!resumeData || typeof resumeData !== 'object') return [];

  const maybeSkills = (resumeData as { skills?: unknown }).skills;
  if (!Array.isArray(maybeSkills)) return [];

  const stringSkills = maybeSkills.filter((skill): skill is string => typeof skill === 'string');
  return uniqueSkills(stringSkills);
};

const getSkillIcon = (skillName: string): LucideIcon => {
  const skill = skillName.toLowerCase();

  if (/(express|node|nestjs|backend|server|api)/.test(skill)) return Code2;
  if (/(react|next|frontend|ui|html|css|tailwind|bootstrap)/.test(skill)) return Monitor;
  if (/(mongo|postgres|mysql|sql|database|redis)/.test(skill)) return Database;
  if (/(aws|azure|gcp|cloud|docker|kubernetes|devops)/.test(skill)) return Cpu;
  if (/(figma|design|ux|wireframe|prototype)/.test(skill)) return Layout;
  if (/(power bi|tableau|analytics|analysis|excel|data)/.test(skill)) return LineChart;
  if (/(scrum|agile|management|leadership|jira|kanban)/.test(skill)) return ClipboardList;
  if (/(javascript|typescript|python|java|c\+\+|c#|go|rust|php)/.test(skill)) return Code;

  return BadgeCheck;
};

const UploadResume = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSkillInputVisible, setIsSkillInputVisible] = useState(false);
  const [skillDraft, setSkillDraft] = useState('');
  const [manualSkills, setManualSkills] = useState<string[]>([]);
  const [removedSkillKeys, setRemovedSkillKeys] = useState<string[]>([]);
  const [showSkills, setShowSkills] = useState(false);

  const dispatch = useDispatch<AppDispatch>();
  const { resume, loading, error } = useSelector((state: RootState) => state.dashboard);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const skillInputRef = useRef<HTMLInputElement | null>(null);
  const dragDepthRef = useRef(0);

  useEffect(() => {
    if (isSkillInputVisible) {
      skillInputRef.current?.focus();
    }
  }, [isSkillInputVisible]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const extractedSkills = readSkillsFromResume(resume);
  const baseSkills = uniqueSkills(extractedSkills);
  const visibleSkills = uniqueSkills([...baseSkills, ...manualSkills]).filter(
    (skill) => !removedSkillKeys.includes(toSkillKey(skill)),
  );

  const handleUpload = () => {
    if (!selectedFile) {
      toast.error('Please select a file to upload.');
      return;
    }
    
    setShowSkills(false);
    
    dispatch(uploadResume(selectedFile)).then((result: any) => {
      if (uploadResume.fulfilled.match(result)) {
        setShowSkills(true);
      }
    });
  };

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

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    processFile(file);
  };

  const handleDragEnter = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    dragDepthRef.current += 1;
    setIsDragging(true);
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    event.dataTransfer.dropEffect = 'copy';
    setIsDragging(true);
  };

  const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    dragDepthRef.current -= 1;
    if (dragDepthRef.current <= 0) {
      setIsDragging(false);
    }
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
    dragDepthRef.current = 0;

    const file = event.dataTransfer.files?.[0];
    if (!file) return;
    processFile(file);
  };

  const openSkillInput = () => {
    setIsSkillInputVisible(true);
  };

  const closeSkillInput = () => {
    setSkillDraft('');
    setIsSkillInputVisible(false);
  };

  const handleAddSkill = () => {
    const nextSkill = normalizeSkill(skillDraft);
    if (!nextSkill) {
      toast.error('Please enter a skill name.');
      return;
    }

    const nextSkillKey = toSkillKey(nextSkill);
    const alreadyVisible = visibleSkills.some((skill) => toSkillKey(skill) === nextSkillKey);
    if (alreadyVisible) {
      toast.error('That skill already exists.');
      return;
    }

    const existsInBaseSkills = baseSkills.some((skill) => toSkillKey(skill) === nextSkillKey);
    if (existsInBaseSkills) {
      setRemovedSkillKeys((previous) => previous.filter((key) => key !== nextSkillKey));
      setSkillDraft('');
      toast.success(`${nextSkill} added back.`);
      return;
    }

    setManualSkills((previous) => {
      const exists = previous.some((skill) => toSkillKey(skill) === nextSkillKey);
      if (exists) return previous;
      return [...previous, nextSkill];
    });
    setRemovedSkillKeys((previous) => previous.filter((key) => key !== nextSkillKey));
    setSkillDraft('');
    toast.success(`${nextSkill} added.`);
  };

  const handleRemoveSkill = (skillName: string) => {
    const skillKey = toSkillKey(skillName);

    setManualSkills((previous) => previous.filter((skill) => toSkillKey(skill) !== skillKey));
    setRemovedSkillKeys((previous) => {
      if (previous.includes(skillKey)) return previous;
      return [...previous, skillKey];
    });
  };

  const handleSkillInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleAddSkill();
    }

    if (event.key === 'Escape') {
      closeSkillInput();
    }
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col h-full">
        <h1 className="text-[28px] font-extrabold text-gray-900 mb-2 tracking-tight">Upload your Resume</h1>
        <p className="text-[15px] text-gray-500 mb-8 font-medium">
          Our AI will scan your profile to find the perfect job matches for your career path.
        </p>

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

        <div className="flex justify-end mb-8 mx-1">
          <button
            disabled={loading}
            onClick={handleUpload}
            className="bg-[#2563EB] disabled:bg-blue-400 disabled:cursor-not-allowed hover:bg-blue-600 text-white px-8 py-3.5 rounded-lg font-semibold text-[15px] transition-all shadow-sm flex items-center gap-2.5"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 text-white" width="20" height="20" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Analyzing...
              </>
            ) : (
              'Analyze Resume'
            )}
          </button>
        </div>

        {showSkills && (
          <div style={{ animation: 'fadeIn 0.5s ease-out' }} className="bg-white border border-gray-200/60 rounded-xl p-6 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] mx-1">
            <style>{`
              @keyframes fadeIn {
                from { opacity: 0; transform: translateY(15px); }
                to { opacity: 1; transform: translateY(0); }
              }
            `}</style>
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
              {visibleSkills.length > 0 ? (
                visibleSkills.map((skill) => {
                  const SkillIcon = getSkillIcon(skill);
                  return (
                    <div
                      key={toSkillKey(skill)}
                      className="bg-[#F8F9FB] border border-gray-100 rounded-lg px-4 py-2.5 flex items-center gap-2 text-[14px] font-semibold text-gray-700"
                    >
                      <SkillIcon size={16} className="text-[#2563EB]" />
                      <span>{skill}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(skill)}
                        className="ml-1 text-gray-400 hover:text-gray-700 transition-colors"
                        aria-label={`Remove ${skill}`}
                      >
                        <X size={14} />
                      </button>
                    </div>
                  );
                })
              ) : (
                <div className="text-[14px] text-gray-500 italic py-2">No skills detected from resume</div>
              )}

              <button
                type="button"
                onClick={openSkillInput}
                className="bg-transparent border border-dashed border-gray-300 rounded-lg px-4 py-2.5 flex items-center gap-2 text-[14px] font-semibold text-gray-500 hover:bg-gray-50 transition-colors"
              >
                <Plus size={16} /> Add Skill
              </button>
            </div>

            {isSkillInputVisible && (
              <div className="mt-4 flex flex-col sm:flex-row gap-2">
                <input
                  ref={skillInputRef}
                  type="text"
                  value={skillDraft}
                  onChange={(event) => setSkillDraft(event.target.value)}
                  onKeyDown={handleSkillInputKeyDown}
                  placeholder="Type a skill (e.g. Express)"
                  className="flex-1 border border-gray-300 rounded-lg px-4 py-2.5 text-[14px] text-gray-800 outline-none focus:ring-2 focus:ring-[#2563EB]/30 focus:border-[#2563EB]"
                />
                <button
                  type="button"
                  onClick={handleAddSkill}
                  className="bg-[#2563EB] hover:bg-blue-600 text-white px-5 py-2.5 rounded-lg text-[14px] font-semibold transition-colors"
                >
                  Add
                </button>
                <button
                  type="button"
                  onClick={closeSkillInput}
                  className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-5 py-2.5 rounded-lg text-[14px] font-semibold transition-colors"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        )}

        <div className="mt-auto pt-16">
          <div className="flex justify-between items-center text-[12px] font-semibold text-gray-400">
            <p>(c) 2024 AutoJob AI. Secure and Encrypted.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-gray-600 transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-gray-600 transition-colors">
                Terms of Service
              </a>
              <a href="#" className="hover:text-gray-600 transition-colors">
                Support
              </a>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default UploadResume;
