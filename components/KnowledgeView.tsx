
import React, { useState, useEffect } from 'react';
import { Search, ExternalLink, Loader2, AlertCircle, Sparkles, Book, Atom, Calculator, Globe2, Cpu, History, FileText } from 'lucide-react';
import { searchKnowledgeBase } from '../services/geminiService';
import { SearchResult, LoadingState, Category, CategoryId } from '../types';

const CATEGORIES: Category[] = [
  { 
    id: 'ALL', labelZh: '综合搜索', labelEn: 'General', 
    description: 'Search anything in the universe / 探索宇宙万物',
    suggestedQueries: ['Why is the sky blue?', 'History of the Great Wall', 'How do vaccines work?'] 
  },
  { 
    id: 'PRIMARY', labelZh: '小学教育', labelEn: 'Primary School', 
    description: 'Basics for kids / 基础教育与趣味知识',
    suggestedQueries: ['唐诗三百首精选', 'Basic Math Formulas', '小学英语单词表', 'Solar System for Kids'] 
  },
  { 
    id: 'SECONDARY', labelZh: '中学教育', labelEn: 'Secondary', 
    description: 'Middle & High School / 中考高考考点',
    suggestedQueries: ['Quadratic Equations', '高中语文古文观止', 'Physics: Newton\'s Laws', 'Chemical Periodic Table'] 
  },
  { 
    id: 'UNIVERSITY', labelZh: '大学学术', labelEn: 'University', 
    description: 'Advanced studies / 学术研究与论文',
    suggestedQueries: ['Linear Algebra Concepts', 'Introduction to Psychology', 'Macroeconomics Principles', 'Computer Architecture'] 
  },
  { 
    id: 'OLYMPIAD', labelZh: '奥数逻辑', labelEn: 'Olympiad', 
    description: 'Math & Logic Puzzles / 思维拓展',
    suggestedQueries: ['Chicken and Rabbit Problem', 'Pigeonhole Principle', 'Game Theory Basics', 'Geometry Puzzles'] 
  },
  { 
    id: 'EXAMS', labelZh: '考试资讯', labelEn: 'Exam News', 
    description: 'Latest Policies / 最新考情与政策',
    suggestedQueries: ['2024 高考政策', '考研时间表', 'Civil Service Exam 2025', 'IELTS vs TOEFL'] 
  },
  { 
    id: 'CS', labelZh: '编程科技', labelEn: 'Tech & CS', 
    description: 'Coding & Future Tech / 极客探索',
    suggestedQueries: ['Python for Beginners', 'What is Large Language Model?', 'React Hooks Tutorial', 'Blockchain explained'] 
  },
];

const getCategoryIcon = (id: CategoryId) => {
  switch (id) {
    case 'PRIMARY': return <Book className="w-4 h-4" />;
    case 'SECONDARY': return <Calculator className="w-4 h-4" />;
    case 'UNIVERSITY': return <Globe2 className="w-4 h-4" />;
    case 'OLYMPIAD': return <Atom className="w-4 h-4" />;
    case 'CS': return <Cpu className="w-4 h-4" />;
    case 'EXAMS': return <FileText className="w-4 h-4" />;
    case 'HISTORY': return <History className="w-4 h-4" />;
    default: return <Sparkles className="w-4 h-4" />;
  }
};

export const KnowledgeView: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<CategoryId>('ALL');
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<SearchResult | null>(null);
  const [status, setStatus] = useState<LoadingState>(LoadingState.IDLE);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e?: React.FormEvent, overrideQuery?: string) => {
    if (e) e.preventDefault();
    const searchQuery = overrideQuery || query;
    if (!searchQuery.trim()) return;

    if (overrideQuery) setQuery(overrideQuery);

    setStatus(LoadingState.LOADING);
    setError(null);
    setResult(null);

    try {
      const data = await searchKnowledgeBase(searchQuery, activeCategory);
      setResult(data);
      setStatus(LoadingState.SUCCESS);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
      setStatus(LoadingState.ERROR);
    }
  };

  const currentCategoryData = CATEGORIES.find(c => c.id === activeCategory) || CATEGORIES[0];

  return (
    <div className="flex flex-col md:flex-row min-h-[calc(100vh-4rem)] bg-slate-50">
      {/* Sidebar / Topbar for Categories */}
      <div className="w-full md:w-64 bg-white border-b md:border-b-0 md:border-r border-slate-200 flex-shrink-0 z-40">
        <div className="p-4 border-b border-slate-100 hidden md:block">
          <h3 className="font-bold text-slate-800">Categories / 分类</h3>
        </div>
        <div className="flex md:flex-col overflow-x-auto md:overflow-visible p-2 md:p-3 gap-2 no-scrollbar">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setActiveCategory(cat.id);
                setResult(null);
                setStatus(LoadingState.IDLE);
                setQuery('');
              }}
              className={`flex items-center flex-shrink-0 px-4 py-3 rounded-xl text-sm font-medium transition-all text-left ${
                activeCategory === cat.id
                  ? 'bg-brand-50 text-brand-700 shadow-sm border border-brand-100'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <div className={`p-1.5 rounded-lg mr-3 ${activeCategory === cat.id ? 'bg-white text-brand-600' : 'bg-slate-100 text-slate-500'}`}>
                {getCategoryIcon(cat.id)}
              </div>
              <div className="flex flex-col">
                <span className="text-slate-900">{cat.labelZh}</span>
                <span className="text-[10px] text-slate-500 uppercase tracking-wide">{cat.labelEn}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 md:p-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          {/* Header for Category */}
          <div className="mb-8 text-center md:text-left">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 flex items-center justify-center md:justify-start gap-3">
              {currentCategoryData.labelZh}
              <span className="text-lg font-normal text-slate-400 hidden md:inline">| {currentCategoryData.labelEn}</span>
            </h2>
            <p className="text-slate-500 mt-2">{currentCategoryData.description}</p>
          </div>

          {/* Search Bar */}
          <form onSubmit={(e) => handleSearch(e)} className="relative mb-8 group z-30">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400 group-focus-within:text-brand-500 transition-colors" />
            </div>
            <input
              type="text"
              className="block w-full pl-11 pr-32 py-4 bg-white border border-slate-200 rounded-2xl shadow-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all text-lg"
              placeholder={`Try searching in ${currentCategoryData.labelEn}...`}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button
              type="submit"
              disabled={status === LoadingState.LOADING || !query.trim()}
              className="absolute right-2 top-2 bottom-2 bg-brand-600 hover:bg-brand-700 text-white px-6 rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center shadow-md"
            >
              {status === LoadingState.LOADING ? <Loader2 className="animate-spin h-5 w-5" /> : 'Search / 搜索'}
            </button>
          </form>

          {/* Suggested Queries (Only if Idle) */}
          {status === LoadingState.IDLE && (
            <div className="animate-fadeIn">
               <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Suggested Topics / 推荐主题</h3>
               <div className="flex flex-wrap gap-3">
                 {currentCategoryData.suggestedQueries.map((q, idx) => (
                   <button
                    key={idx}
                    onClick={() => handleSearch(undefined, q)}
                    className="px-4 py-2 bg-white border border-slate-200 hover:border-brand-400 hover:text-brand-600 hover:shadow-md rounded-full text-slate-600 text-sm transition-all"
                   >
                     {q}
                   </button>
                 ))}
               </div>
               
               <div className="mt-12 p-8 bg-brand-50/50 border border-brand-100 rounded-2xl flex flex-col items-center text-center">
                  <Sparkles className="h-12 w-12 text-brand-300 mb-4" />
                  <h4 className="text-lg font-bold text-brand-900 mb-2">Encyclopedia Mode</h4>
                  <p className="text-slate-600 max-w-md">
                    Our AI provides detailed, structured explanations suitable for students and lifelong learners. Data is grounded in real-time search.
                    <br/><span className="text-xs opacity-70 block mt-2">(Suitable for ages 8+)</span>
                  </p>
               </div>
            </div>
          )}

          {/* Results Area */}
          <div className="space-y-6">
            {status === LoadingState.ERROR && (
              <div className="bg-red-50 border border-red-100 rounded-xl p-4 flex items-start text-red-800">
                <AlertCircle className="h-5 w-5 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-medium">Error</h3>
                  <p className="text-sm opacity-90">{error}</p>
                </div>
              </div>
            )}

            {status === LoadingState.SUCCESS && result && (
              <div className="animate-fadeIn">
                {/* Main Response Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8 mb-6">
                  <div className="prose prose-slate max-w-none prose-headings:text-brand-900 prose-a:text-brand-600 prose-strong:text-slate-900">
                    <div className="whitespace-pre-wrap text-slate-800 leading-relaxed text-lg font-light">
                      {result.text}
                    </div>
                  </div>
                </div>

                {/* Sources / Grounding */}
                {result.sources && result.sources.length > 0 && (
                  <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center">
                      <Globe2 className="w-4 h-4 mr-2" />
                      References / 来源
                    </h3>
                    <div className="grid gap-3 md:grid-cols-2">
                      {result.sources.map((source, idx) => {
                        if (!source.web) return null;
                        return (
                          <a
                            key={idx}
                            href={source.web.uri}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-start p-3 bg-white rounded-lg border border-slate-200 hover:border-brand-300 hover:shadow-md transition-all group"
                          >
                            <ExternalLink className="h-4 w-4 text-slate-400 mt-1 mr-2 group-hover:text-brand-500 flex-shrink-0" />
                            <div className="overflow-hidden">
                              <div className="font-medium text-slate-900 truncate group-hover:text-brand-600 text-sm">
                                {source.web.title}
                              </div>
                              <div className="text-xs text-slate-400 truncate mt-0.5">
                                {source.web.uri}
                              </div>
                            </div>
                          </a>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
