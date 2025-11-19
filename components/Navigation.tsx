
import React from 'react';
import { ViewState } from '../types';
import { BookOpen, GraduationCap, BrainCircuit, Camera } from 'lucide-react';

interface NavigationProps {
  currentView: ViewState;
  setView: (view: ViewState) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ currentView, setView }) => {
  const navItems = [
    { id: ViewState.HOME, labelZh: '首页', labelEn: 'Home', icon: <BrainCircuit size={20} /> },
    { id: ViewState.KNOWLEDGE, labelZh: '百科知识库', labelEn: 'Encyclopedia', icon: <BookOpen size={20} /> },
    { id: ViewState.PROBLEM_SOLVER, labelZh: '拍照解题', labelEn: 'AI Solver', icon: <Camera size={20} /> },
    { id: ViewState.MOCK_TEST, labelZh: '模拟考场', labelEn: 'Mock Exams', icon: <GraduationCap size={20} /> },
  ];

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50 border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-18">
          <div className="flex items-center h-16">
            <div 
              className="flex-shrink-0 flex items-center cursor-pointer group"
              onClick={() => setView(ViewState.HOME)}
            >
              <div className="w-10 h-10 bg-gradient-to-br from-brand-500 to-brand-700 rounded-xl flex items-center justify-center text-white mr-3 shadow-lg group-hover:shadow-brand-500/30 transition-all">
                <BrainCircuit size={24} />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-lg text-slate-900 leading-tight">学习大百科</span>
                <span className="text-xs text-brand-600 font-medium tracking-wide">Study Encyclopedia</span>
              </div>
            </div>
            <div className="hidden sm:ml-10 sm:flex sm:space-x-8">
              {navItems.slice(1).map((item) => (
                <button
                  key={item.id}
                  onClick={() => setView(item.id)}
                  className={`${
                    currentView === item.id
                      ? 'border-brand-500 text-slate-900'
                      : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700'
                  } inline-flex flex-col justify-center items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200 h-full`}
                >
                  <div className="flex items-center">
                    {item.icon}
                    <span className="ml-2 text-base">{item.labelZh}</span>
                  </div>
                  <span className="text-[10px] uppercase tracking-wider opacity-70 mt-0.5">{item.labelEn}</span>
                </button>
              ))}
            </div>
          </div>
          
          {/* Mobile Menu Button */}
          <div className="sm:hidden flex items-center">
             <div className="text-xs text-slate-400 mr-2">v2.5 Vision</div>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      <div className="sm:hidden border-t border-gray-100 flex justify-around py-3 bg-white fixed bottom-0 w-full z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
         {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className={`flex flex-col items-center p-1 ${
                currentView === item.id ? 'text-brand-600' : 'text-slate-400'
              }`}
            >
               {item.icon}
               <span className="text-xs mt-1 font-medium">{item.labelZh}</span>
            </button>
         ))}
      </div>
    </nav>
  );
};