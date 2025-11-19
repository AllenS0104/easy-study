
import React, { useState } from 'react';
import { Navigation } from './components/Navigation';
import { KnowledgeView } from './components/KnowledgeView';
import { ExamQuizView } from './components/ExamQuizView';
import { ProblemSolverView } from './components/ProblemSolverView';
import { ViewState } from './types';
import { Sparkles, BookOpen, Globe, Camera } from 'lucide-react';

const Hero: React.FC<{ onStart: (view: ViewState) => void }> = ({ onStart }) => (
  <div className="relative overflow-hidden bg-white">
    <div className="max-w-7xl mx-auto">
      <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32 min-h-[calc(100vh-4rem)] flex flex-col justify-center">
        <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
          <div className="sm:text-center lg:text-left">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-brand-50 text-brand-600 text-sm font-medium mb-6 border border-brand-100 shadow-sm">
              <Sparkles className="w-4 h-4 mr-2" />
              Powered by Google Gemini 2.5 Flash
            </div>
            <h1 className="text-4xl tracking-tight font-extrabold text-slate-900 sm:text-5xl md:text-6xl mb-2">
              <span className="block xl:inline">Knowledge for Everyone</span>
            </h1>
            <h1 className="text-4xl tracking-tight font-extrabold text-brand-600 sm:text-5xl md:text-6xl mb-6">
              <span className="block xl:inline">学习大百科</span>
            </h1>
            <p className="mt-3 text-base text-slate-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0 leading-relaxed">
              Your ultimate AI companion for global knowledge, exam prep, and instant problem solving. Suitable for ages 8 to 80. 
              <br/>
              您的终极AI学习助手。汇集全球知识，涵盖最新考试资讯，拍照智能解题。
            </p>
            <div className="mt-8 sm:mt-10 sm:flex sm:justify-center lg:justify-start gap-4 flex-wrap">
              <button
                onClick={() => onStart(ViewState.KNOWLEDGE)}
                className="flex-1 sm:flex-none flex items-center justify-center px-8 py-4 border border-transparent text-base font-bold rounded-xl text-white bg-brand-600 hover:bg-brand-700 md:text-lg transition-all shadow-lg hover:shadow-brand-500/30 hover:-translate-y-0.5"
              >
                <Globe className="w-5 h-5 mr-2" />
                Explore / 探索
              </button>
              <button
                onClick={() => onStart(ViewState.PROBLEM_SOLVER)}
                className="flex-1 sm:flex-none flex items-center justify-center px-8 py-4 border border-transparent text-base font-bold rounded-xl text-purple-700 bg-purple-50 hover:bg-purple-100 md:text-lg transition-all hover:-translate-y-0.5 border-purple-100"
              >
                <Camera className="w-5 h-5 mr-2" />
                AI Solve / 解题
              </button>
              <button
                onClick={() => onStart(ViewState.MOCK_TEST)}
                className="flex-1 sm:flex-none flex items-center justify-center px-8 py-4 border border-transparent text-base font-bold rounded-xl text-brand-700 bg-brand-50 hover:bg-brand-100 md:text-lg transition-all hover:-translate-y-0.5"
              >
                <BookOpen className="w-5 h-5 mr-2" />
                Mock Exams
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
    <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2 bg-slate-50 flex items-center justify-center">
       <div className="relative w-full h-full overflow-hidden bg-brand-50/30">
          {/* Abstract Pattern Background */}
          <svg className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/4 lg:translate-x-0 lg:translate-y-0 text-slate-200" width="600" height="600" fill="none" viewBox="0 0 200 200" aria-hidden="true">
            <defs>
              <pattern id="hero-pattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                <rect x="0" y="0" width="4" height="4" fill="currentColor" />
              </pattern>
            </defs>
            <rect width="200" height="200" fill="url(#hero-pattern)" />
          </svg>
          
          {/* Floating Cards Animation */}
          <div className="absolute inset-0 flex items-center justify-center">
             <div className="relative w-full max-w-lg h-full flex items-center justify-center">
                
                {/* Card 1 */}
                <div className="absolute top-1/4 left-10 bg-white p-6 rounded-2xl shadow-xl border border-slate-100 w-64 animate-[float_6s_ease-in-out_infinite]">
                   <div className="flex items-center mb-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mr-3">
                         <Sparkles size={16} />
                      </div>
                      <div className="font-bold text-slate-800">Science Facts</div>
                   </div>
                   <div className="h-2 w-full bg-slate-100 rounded mb-2"></div>
                   <div className="h-2 w-2/3 bg-slate-100 rounded"></div>
                </div>

                {/* Card 2 */}
                <div className="absolute bottom-1/3 right-10 bg-brand-600 p-6 rounded-2xl shadow-2xl shadow-brand-500/20 w-72 text-white animate-[float_5s_ease-in-out_infinite_1s]">
                   <div className="font-bold text-xl mb-1">2025 Gaokao</div>
                   <div className="text-brand-100 text-sm mb-4">Policy Update & Schedule</div>
                   <div className="flex gap-2">
                      <div className="h-2 w-8 bg-white/30 rounded-full"></div>
                      <div className="h-2 w-12 bg-white/30 rounded-full"></div>
                   </div>
                </div>

                {/* Card 3 */}
                 <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-5 rounded-xl shadow-lg border border-slate-100 w-48 animate-[float_7s_ease-in-out_infinite_0.5s]">
                   <div className="text-xs font-bold text-slate-400 uppercase mb-2">AI Vision</div>
                   <div className="font-serif text-2xl text-slate-800 flex items-center gap-2">
                      <Camera className="text-purple-500" size={24} />
                      Snap & Solve
                   </div>
                   <div className="text-xs text-slate-500 mt-1">拍照秒解</div>
                </div>

             </div>
          </div>
       </div>
    </div>
  </div>
);

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.HOME);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <Navigation currentView={currentView} setView={setCurrentView} />
      
      <main>
        {currentView === ViewState.HOME && <Hero onStart={setCurrentView} />}
        {currentView === ViewState.KNOWLEDGE && <KnowledgeView />}
        {currentView === ViewState.PROBLEM_SOLVER && <ProblemSolverView />}
        {currentView === ViewState.MOCK_TEST && <ExamQuizView />}
      </main>
    </div>
  );
};

export default App;
