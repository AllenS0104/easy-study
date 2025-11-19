
import React, { useState } from 'react';
import { Navigation } from './components/Navigation';
import { KnowledgeView } from './components/KnowledgeView';
import { ExamQuizView } from './components/ExamQuizView';
import { ProblemSolverView } from './components/ProblemSolverView';
import { ViewState } from './types';
import { Sparkles, BookOpen, Globe, Camera, Calendar, Clock, ArrowRight, Lightbulb } from 'lucide-react';

const HomeDashboard: React.FC<{ onStart: (view: ViewState) => void }> = ({ onStart }) => {
  const today = new Date().toLocaleDateString('zh-CN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  
  // Mock Data for Dashboard
  const dailyQuote = {
    zh: "学习不是为了通过考试，而是为了理解世界。",
    en: "Learning is not about passing exams, it's about understanding the world."
  };

  const upcomingExams = [
    { name: "Gaokao 2025", days: 142, color: "text-red-600", bg: "bg-red-50" },
    { name: "Postgrad Exam (Ky)", days: 310, color: "text-blue-600", bg: "bg-blue-50" },
    { name: "IELTS Test", days: 14, color: "text-purple-600", bg: "bg-purple-50" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 animate-fadeIn">
        <div>
           <div className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">{today}</div>
           <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900">
             Good Morning, <span className="text-brand-600">Student</span>.
           </h1>
        </div>
        <div className="mt-4 md:mt-0 hidden md:block">
           <div className="inline-flex items-center px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-medium">
              <Sparkles className="w-3 h-3 mr-2 text-yellow-500" />
              AI Model: Gemini 2.5 Flash (Live)
           </div>
        </div>
      </div>

      {/* Daily Wisdom Card */}
      <div className="bg-gradient-to-r from-indigo-900 to-slate-900 rounded-3xl p-8 text-white shadow-xl mb-12 relative overflow-hidden group hover:shadow-2xl transition-shadow duration-500">
         <div className="absolute top-0 right-0 opacity-10 transform translate-x-10 -translate-y-10">
            <Sparkles size={200} />
         </div>
         <div className="relative z-10">
            <div className="flex items-center mb-4 text-indigo-300 text-sm font-bold uppercase tracking-widest">
               <Lightbulb className="w-4 h-4 mr-2" />
               Daily Wisdom / 每日一智
            </div>
            <blockquote className="text-xl md:text-2xl font-serif italic leading-relaxed opacity-95 mb-2">
              "{dailyQuote.en}"
            </blockquote>
            <p className="text-lg text-indigo-200 font-light">{dailyQuote.zh}</p>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
         {/* Left Col: Main Actions */}
         <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            {/* Action 1: Encyclopedia */}
            <button 
              onClick={() => onStart(ViewState.KNOWLEDGE)}
              className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-left group relative overflow-hidden"
            >
               <div className="absolute top-0 right-0 w-24 h-24 bg-brand-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
               <div className="relative z-10">
                  <div className="w-12 h-12 bg-brand-100 text-brand-600 rounded-xl flex items-center justify-center mb-4 group-hover:bg-brand-600 group-hover:text-white transition-colors">
                     <Globe size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-1">Encyclopedia</h3>
                  <p className="text-slate-500 text-sm mb-4">Search global knowledge with real-time verification.</p>
                  <div className="flex items-center text-brand-600 text-sm font-bold">
                     Explore Now <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
               </div>
            </button>

            {/* Action 2: Photo Solver */}
            <button 
              onClick={() => onStart(ViewState.PROBLEM_SOLVER)}
              className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-left group relative overflow-hidden"
            >
               <div className="absolute top-0 right-0 w-24 h-24 bg-purple-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
               <div className="relative z-10">
                  <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center mb-4 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                     <Camera size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-1">AI Snap Solve</h3>
                  <p className="text-slate-500 text-sm mb-4">Take a photo of any question and get instant explanation.</p>
                  <div className="flex items-center text-purple-600 text-sm font-bold">
                     Start Camera <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
               </div>
            </button>

            {/* Action 3: Mock Exam (Full width on mobile, half on desktop) */}
            <button 
              onClick={() => onStart(ViewState.MOCK_TEST)}
              className="sm:col-span-2 bg-gradient-to-br from-emerald-500 to-teal-600 p-6 rounded-2xl text-white shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-left flex items-center justify-between group"
            >
               <div>
                  <h3 className="text-xl font-bold mb-1 flex items-center">
                    <BookOpen className="w-5 h-5 mr-2" />
                    Mock Exam Generator
                  </h3>
                  <p className="text-emerald-100 text-sm opacity-90">Generate 2025 syllabus practice tests in seconds.</p>
               </div>
               <div className="bg-white/20 p-3 rounded-full backdrop-blur-sm group-hover:bg-white/30 transition-colors">
                  <ArrowRight className="w-6 h-6" />
               </div>
            </button>
         </div>

         {/* Right Col: Widgets */}
         <div className="space-y-6">
            {/* Exam Radar */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
               <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-slate-800 flex items-center">
                     <Clock className="w-4 h-4 mr-2 text-slate-400" />
                     Exam Radar
                  </h3>
                  <span className="text-[10px] bg-slate-100 px-2 py-1 rounded text-slate-500">2025</span>
               </div>
               <div className="space-y-3">
                  {upcomingExams.map((exam, idx) => (
                     <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors">
                        <div className="font-medium text-slate-700">{exam.name}</div>
                        <div className={`text-xs font-bold px-2 py-1 rounded ${exam.bg} ${exam.color}`}>
                           {exam.days} days left
                        </div>
                     </div>
                  ))}
               </div>
               <button 
                 onClick={() => onStart(ViewState.KNOWLEDGE)}
                 className="w-full mt-4 py-2 text-xs text-slate-500 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
               >
                 View Full Calendar
               </button>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex items-center justify-between">
                <div>
                   <div className="text-slate-400 text-xs font-bold uppercase">Knowledge Base</div>
                   <div className="text-2xl font-extrabold text-slate-900">Live</div>
                </div>
                <div className="h-10 w-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center animate-pulse">
                   <Globe size={20} />
                </div>
            </div>
         </div>
      </div>

      {/* Footer */}
      <div className="text-center text-slate-400 text-sm py-6 border-t border-slate-100">
         <p>© 2025 Study Encyclopedia. Powered by Google Gemini.</p>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.HOME);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <Navigation currentView={currentView} setView={setCurrentView} />
      
      <main className="animate-fadeIn">
        {currentView === ViewState.HOME && <HomeDashboard onStart={setCurrentView} />}
        {currentView === ViewState.KNOWLEDGE && <KnowledgeView />}
        {currentView === ViewState.PROBLEM_SOLVER && <ProblemSolverView />}
        {currentView === ViewState.MOCK_TEST && <ExamQuizView />}
      </main>
    </div>
  );
};

export default App;
