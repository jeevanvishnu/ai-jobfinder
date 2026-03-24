import DashboardLayout from '../components/layout/DashboardLayout';
import { Settings2, ArrowDownWideNarrow, Bookmark, ChevronLeft, ChevronRight } from 'lucide-react';

const JobMatches = () => {
  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <h1 className="text-[28px] font-extrabold text-gray-900 tracking-tight font-inter">Recommended Matches</h1>
          <p className="text-gray-500 mt-1 text-[15px]">We've found 12 new job opportunities that match your AI profile.</p>
        </div>
        
        <div className="flex items-center gap-3">
           <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-[13.5px] font-bold text-gray-700 bg-white hover:bg-gray-50 transition-colors shadow-sm">
             <Settings2 size={16} className="text-gray-500" strokeWidth={2.5} />
             Filters
           </button>
           <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-[13.5px] font-bold text-gray-700 bg-white hover:bg-gray-50 transition-colors shadow-sm">
             <ArrowDownWideNarrow size={16} className="text-gray-500" strokeWidth={2.5} />
             Sort: High Match
           </button>
        </div>
      </div>

      <div className="space-y-4">
        
        {/* Match Card 1 */}
        <div className="bg-white border border-gray-200/80 rounded-[18px] p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex flex-col lg:flex-row justify-between gap-6">
             <div className="flex gap-4">
               {/* Logo Block */}
               <div className="w-12 h-12 bg-[#0A1A2F] rounded-xl shrink-0 flex items-center justify-center">
                 <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center relative shadow-[0_0_10px_rgba(59,130,246,0.6)]">
                    <div className="w-2.5 h-2.5 bg-cyan-300 rounded-full" />
                 </div>
               </div>
               
               <div>
                 <h2 className="text-[17px] font-extrabold text-gray-900 leading-tight mb-1">Senior Full Stack Developer</h2>
                 <p className="text-[14px] font-semibold text-[#2563EB]">TechFlow Systems • San Francisco (Remote)</p>
                 
                 <div className="flex flex-wrap gap-2 mt-4">
                    <span className="bg-[#F3F4F6] text-gray-600 px-3 py-1.5 rounded-lg text-[12px] font-bold">React</span>
                    <span className="bg-[#F3F4F6] text-gray-600 px-3 py-1.5 rounded-lg text-[12px] font-bold">Node.js</span>
                    <span className="bg-[#F3F4F6] text-gray-600 px-3 py-1.5 rounded-lg text-[12px] font-bold">TypeScript</span>
                    <span className="bg-[#F3F4F6] text-gray-600 px-3 py-1.5 rounded-lg text-[12px] font-bold">AWS</span>
                    <span className="bg-[#EDF2FE] text-[#2563EB] px-3 py-1.5 rounded-lg text-[12px] font-bold">+2 more skills matched</span>
                 </div>
                 
                 <p className="text-gray-500 text-[14px] leading-relaxed mt-4 max-w-3xl">
                   Looking for a highly skilled engineer to lead our core product team. You'll be working on scaling our distributed infrastructure using modern web technologies...
                 </p>
               </div>
             </div>
             
             <div className="flex flex-col items-end justify-between min-w-[160px] gap-4">
                <div className="w-full sm:w-auto">
                   <div className="flex justify-between items-center mb-1.5">
                      <span className="text-[14px] font-extrabold text-[#059669] flex items-center gap-1.5">
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                        98% Match
                      </span>
                   </div>
                   <div className="w-32 sm:w-40 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                     <div className="h-full bg-[#10B981] rounded-full w-[98%]" />
                   </div>
                </div>
                
                <div className="flex flex-col gap-2.5 w-full sm:w-36">
                   <button className="bg-[#2563EB] hover:bg-blue-600 text-white font-bold py-2.5 px-4 rounded-xl text-[14px] shadow-[0_2px_10px_rgba(37,99,235,0.2)] transition-colors w-full">
                     Apply Now
                   </button>
                   <button className="bg-white border text-gray-400 hover:text-gray-900 border-gray-200 hover:bg-gray-50 font-bold py-2.5 px-4 rounded-xl text-[14px] shadow-sm transition-colors w-full flex items-center justify-center">
                     <Bookmark size={18} className="fill-current" strokeWidth={1} />
                   </button>
                </div>
             </div>
          </div>
        </div>

        {/* Match Card 2 */}
        <div className="bg-white border border-gray-200/80 rounded-[18px] p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex flex-col lg:flex-row justify-between gap-6">
             <div className="flex gap-4">
               {/* Logo Block */}
               <div className="w-12 h-12 bg-[#1A1A1A] rounded-xl shrink-0 flex items-center justify-center text-rose-500 font-black text-xl tracking-tighter">
                 N
               </div>
               
               <div>
                 <h2 className="text-[17px] font-extrabold text-gray-900 leading-tight mb-1">Product Designer (UI/UX)</h2>
                 <p className="text-[14px] font-semibold text-[#2563EB]">Nexus AI • London (Hybrid)</p>
                 
                 <div className="flex flex-wrap gap-2 mt-4">
                    <span className="bg-[#F3F4F6] text-gray-600 px-3 py-1.5 rounded-lg text-[12px] font-bold">Figma</span>
                    <span className="bg-[#F3F4F6] text-gray-600 px-3 py-1.5 rounded-lg text-[12px] font-bold">Design Systems</span>
                    <span className="bg-[#F3F4F6] text-gray-600 px-3 py-1.5 rounded-lg text-[12px] font-bold">Prototyping</span>
                    <span className="bg-[#EDF2FE] text-[#2563EB] px-3 py-1.5 rounded-lg text-[12px] font-bold">+4 more skills matched</span>
                 </div>
                 
                 <p className="text-gray-500 text-[14px] leading-relaxed mt-4 max-w-3xl">
                   Help us build the future of AI-driven creative tools. We're looking for someone who obsesses over details and user workflows...
                 </p>
               </div>
             </div>
             
             <div className="flex flex-col items-end justify-between min-w-[160px] gap-4">
                <div className="w-full sm:w-auto">
                   <div className="flex justify-between items-center mb-1.5">
                      <span className="text-[14px] font-extrabold text-[#059669] flex items-center gap-1.5">
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                        85% Match
                      </span>
                   </div>
                   <div className="w-32 sm:w-40 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                     <div className="h-full bg-[#10B981] rounded-full w-[85%]" />
                   </div>
                </div>
                
                <div className="flex flex-col gap-2.5 w-full sm:w-36">
                   <button className="bg-[#2563EB] hover:bg-blue-600 text-white font-bold py-2.5 px-4 rounded-xl text-[14px] shadow-[0_2px_10px_rgba(37,99,235,0.2)] transition-colors w-full">
                     Apply Now
                   </button>
                   <button className="bg-white border text-gray-400 hover:text-gray-900 border-gray-200 hover:bg-gray-50 font-bold py-2.5 px-4 rounded-xl text-[14px] shadow-sm transition-colors w-full flex items-center justify-center">
                     <Bookmark size={18} className="fill-current" strokeWidth={1} />
                   </button>
                </div>
             </div>
          </div>
        </div>

        {/* Match Card 3 */}
        <div className="bg-white border border-gray-200/80 rounded-[18px] p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex flex-col lg:flex-row justify-between gap-6">
             <div className="flex gap-4">
               {/* Logo Block */}
               <div className="w-12 h-12 bg-white border border-gray-100 rounded-xl shrink-0 flex items-center justify-center">
                 <div className="w-4 h-4 border-4 border-amber-500 rounded-full"></div>
               </div>
               
               <div>
                 <h2 className="text-[17px] font-extrabold text-gray-900 leading-tight mb-1">Cloud Infrastructure Architect</h2>
                 <p className="text-[14px] font-semibold text-[#2563EB]">CloudScale • Seattle (On-site)</p>
                 
                 <div className="flex flex-wrap gap-2 mt-4">
                    <span className="bg-[#F3F4F6] text-gray-600 px-3 py-1.5 rounded-lg text-[12px] font-bold">Kubernetes</span>
                    <span className="bg-[#F3F4F6] text-gray-600 px-3 py-1.5 rounded-lg text-[12px] font-bold">Terraform</span>
                    <span className="bg-[#F3F4F6] text-gray-600 px-3 py-1.5 rounded-lg text-[12px] font-bold">Go</span>
                    <span className="bg-[#F3F4F6] text-gray-600 px-3 py-1.5 rounded-lg text-[12px] font-bold">Docker</span>
                 </div>
                 
                 <p className="text-gray-500 text-[14px] leading-relaxed mt-4 max-w-3xl">
                   Join our infrastructure team to architect and manage multi-cloud deployments for enterprise clients worldwide...
                 </p>
               </div>
             </div>
             
             <div className="flex flex-col items-end justify-between min-w-[160px] gap-4">
                <div className="w-full sm:w-auto">
                   <div className="flex justify-between items-center mb-1.5">
                      <span className="text-[14px] font-extrabold text-[#F59E0B] flex items-center gap-1.5">
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                        72% Match
                      </span>
                   </div>
                   <div className="w-32 sm:w-40 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                     <div className="h-full bg-[#F59E0B] rounded-full w-[72%]" />
                   </div>
                </div>
                
                <div className="flex flex-col gap-2.5 w-full sm:w-36">
                   <button className="bg-[#2563EB] hover:bg-blue-600 text-white font-bold py-2.5 px-4 rounded-xl text-[14px] shadow-[0_2px_10px_rgba(37,99,235,0.2)] transition-colors w-full">
                     Apply Now
                   </button>
                   <button className="bg-white border text-gray-400 hover:text-gray-900 border-gray-200 hover:bg-gray-50 font-bold py-2.5 px-4 rounded-xl text-[14px] shadow-sm transition-colors w-full flex items-center justify-center">
                     <Bookmark size={18} className="fill-current" strokeWidth={1} />
                   </button>
                </div>
             </div>
          </div>
        </div>

      </div>

      {/* Pagination */}
      <div className="mt-8 flex justify-center pb-12">
        <div className="flex items-center gap-2">
          <button className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-gray-400 shadow-sm cursor-not-allowed">
            <ChevronLeft size={16} strokeWidth={2.5} />
          </button>
          
          <button className="w-10 h-10 rounded-xl bg-[#2563EB] text-white font-bold text-[14px] shadow-[0_2px_8px_rgba(37,99,235,0.3)]">
            1
          </button>
          
          <button className="w-10 h-10 rounded-xl bg-transparent text-gray-700 hover:bg-gray-100 font-bold text-[14px] transition-colors">
            2
          </button>

          <button className="w-10 h-10 rounded-xl bg-transparent text-gray-700 hover:bg-gray-100 font-bold text-[14px] transition-colors">
            3
          </button>

          <span className="w-8 flex items-center justify-center text-gray-400 font-bold tracking-widest">
            ...
          </span>

          <button className="w-10 h-10 rounded-xl bg-transparent text-gray-700 hover:bg-gray-100 font-bold text-[14px] transition-colors">
            8
          </button>
          
          <button className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-gray-700 hover:bg-gray-50 shadow-sm transition-colors">
            <ChevronRight size={16} strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default JobMatches;
