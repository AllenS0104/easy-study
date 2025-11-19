
import React, { useState, useEffect } from 'react';
import { Search, ExternalLink, Loader2, AlertCircle, Sparkles, Book, Atom, Calculator, Globe2, Cpu, History, FileText, Zap, ChevronRight, Lightbulb, BookOpen } from 'lucide-react';
import { searchKnowledgeBase } from '../services/geminiService';
import { SearchResult, LoadingState, Category, CategoryId } from '../types';

const CATEGORIES: Category[] = [
  { 
    id: 'ALL', labelZh: '综合搜索', labelEn: 'General', 
    description: 'Search anything (Real-time Web) / 实时全网搜索',
    suggestedQueries: ['Why is the sky blue?', 'Latest SpaceX Launch', 'China Economy 2025 Outlook'] 
  },
  { 
    id: 'PRIMARY', labelZh: '小学教育', labelEn: 'Primary School', 
    description: 'Basics for kids / 基础教育与趣味知识',
    suggestedQueries: ['唐诗三百首精选', 'Math Multiplication Tricks', '小学英语单词表 2025', 'Solar System New Discoveries'] 
  },
  { 
    id: 'SECONDARY', labelZh: '中学教育', labelEn: 'Secondary', 
    description: 'Middle & High School / 中考高考最新考点',
    suggestedQueries: ['Quadratic Equations', '2025 高考语文必背古诗', 'Physics: Newton\'s Laws', 'Chemical Periodic Table'] 
  },
  { 
    id: 'UNIVERSITY', labelZh: '大学学术', labelEn: 'University', 
    description: 'Advanced studies / 学术研究与最新论文',
    suggestedQueries: ['Linear Algebra Concepts', 'Latest AI Papers 2024-2025', 'Macroeconomics Trends', 'Computer Architecture'] 
  },
  { 
    id: 'OLYMPIAD', labelZh: '奥数逻辑', labelEn: 'Olympiad', 
    description: 'Math & Logic Puzzles / 思维拓展',
    suggestedQueries: ['Chicken and Rabbit Problem', 'Pigeonhole Principle', 'IMO 2024 Problems', 'Geometry Puzzles'] 
  },
  { 
    id: 'EXAMS', labelZh: '考试资讯', labelEn: 'Exam News', 
    description: 'Policies (Updated Daily) / 最新考情与政策',
    suggestedQueries: ['2025 高考政策解读', '2025 考研时间表', 'Civil Service Exam 2025', 'IELTS Requirements 2025'] 
  },
  { 
    id: 'CS', labelZh: '编程科技', labelEn: 'Tech & CS', 
    description: 'Bleeding Edge Tech / 前沿科技',
    suggestedQueries: ['Python 3.13 Features', 'Gemini 2.5 Capabilities', 'React 19 Tutorial', 'Quantum Computing Progress'] 
  },
];

const getCategoryIcon = (id: CategoryId, className = "w-4 h-4") => {
  switch (id) {
    case 'PRIMARY': return <Book className={className} />;
    case 'SECONDARY': return <Calculator className={className} />;
    case 'UNIVERSITY': return <Globe2 className={className} />;
    case 'OLYMPIAD': return <Atom className={className} />;
    case 'CS': return <Cpu className={className} />;
    case 'EXAMS': return <FileText className={className} />;
    case 'HISTORY': return <History className={className} />;
    default: return <Zap className={className} />;
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
      {/* Sidebar / Mobile Tabs */}
      <div className="w-full md:w-64 bg-white border-b md:border-b-0 md:border-r border-slate-200 flex-shrink-0 z-40 md:h-[calc(100vh-4rem)] md:overflow-y-auto no-scrollbar">
        <div className="p-4 border-b border-slate-100 hidden md:block">
          <h3 className="font-bold text-slate-800 flex items-center tracking-wide text-sm uppercase">
            <Zap className="w-4 h-4 text-brand-500 mr-2" />
            Library / 知识库
          </h3>
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
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 border border-transparent'
              }`}
            >
              <div className={`p-1.5 rounded-lg mr-3 transition-colors ${activeCategory === cat.id ? 'bg-white text-brand-600 shadow-sm' : 'bg-slate-100 text-slate-500'}`}>
                {getCategoryIcon(cat.id)}
              </div>
              <div className="flex flex-col">
                <span className="text-slate-900 font-semibold">{cat.labelZh}</span>
                <span className="text-[10px] text-slate-500 uppercase tracking-wide opacity-80">{cat.labelEn}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 md:p-8 overflow-y-auto h-[calc(100vh-4rem)]">
        <div className="max-w-4xl mx-auto pb-20">
          
          {/* Active Category Header */}
          <div className="mb-6">
             <div className="flex items-center text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">
                <span>Library</span>
                <ChevronRight className="w-3 h-3 mx-1" />
                <span>{currentCategoryData.labelEn}</span>
             </div>
             <h2 className="text-3xl font-bold text-slate-900">{currentCategoryData.labelZh}</h2>
             <p className="text-slate-500 mt-1">{currentCategoryData.description}</p>
          </div>

          {/* Search Bar */}
          <form onSubmit={(e) => handleSearch(e)} className="relative mb-10 group z-30">
            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
              <Search className="h-6 w-6 text-slate-400 group-focus-within:text-brand-500 transition-colors" />
            </div>
            <input
              type="text"
              className="block w-full pl-14 pr-32 py-5 bg-white border border-slate-200 rounded-2xl shadow-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 transition-all text-lg"
              placeholder={activeCategory === 'ALL' ? "Ask anything... (e.g. History of China)" : `Search in ${currentCategoryData.labelEn}...`}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button
              type="submit"
              disabled={status === LoadingState.LOADING || !query.trim()}
              className="absolute right-3 top-3 bottom-3 bg-brand-600 hover:bg-brand-700 text-white px-6 rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center shadow-md active:scale-95"
            >
              {status === LoadingState.LOADING ? <Loader2 className="animate-spin h-5 w-5" /> : 'Search'}
            </button>
          </form>

          {/* IDLE STATE: Content Discovery Hub */}
          {status === LoadingState.IDLE && (
            <div className="animate-fadeIn">
               {/* Featured Topics Grid */}
               <div className="mb-10">
                  <h3 className="flex items-center text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">
                    <Sparkles className="w-4 h-4 mr-2 text-yellow-500" />
                    Trending Topics / 热门探索
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {currentCategoryData.suggestedQueries.map((q, idx) => (
                       <button
                        key={idx}
                        onClick={() => handleSearch(undefined, q)}
                        className="group flex items-center p-4 bg-white border border-slate-100 rounded-xl shadow-sm hover:shadow-md hover:border-brand-200 transition-all text-left"
                       >
                         <div className="h-10 w-10 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center mr-4 group-hover:bg-brand-100 transition-colors">
                            <Lightbulb className="w-5 h-5" />
                         </div>
                         <div>
                           <div className="font-medium text-slate-900 group-hover:text-brand-700 transition-colors line-clamp-1">{q}</div>
                           <div className="text-xs text-slate-400 mt-0.5">Click to research</div>
                         </div>
                       </button>
                    ))}
                  </div>
               </div>

               {/* Explore Other Categories */}
               {activeCategory === 'ALL' && (
                 <div>
                    <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Browse by Subject / 学科分类</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                       {CATEGORIES.filter(c => c.id !== 'ALL').map((cat) => (
                         <button
                           key={cat.id}
                           onClick={() => setActiveCategory(cat.id)}
                           className="flex flex-col items-center p-6 bg-white border border-slate-100 rounded-2xl shadow-sm hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
                         >
                            <div className="p-3 bg-slate-50 rounded-full text-slate-600 mb-3">
                              {getCategoryIcon(cat.id, "w-6 h-6")}
                            </div>
                            <div className="font-bold text-slate-900">{cat.labelZh}</div>
                            <div className="text-xs text-slate-400 mt-1 text-center">{cat.labelEn}</div>
                         </button>
                       ))}
                    </div>
                 </div>
               )}
            </div>
          )}

          {/* LOADING STATE */}
          {status === LoadingState.LOADING && (
            <div className="flex flex-col items-center justify-center py-20 animate-fadeIn">
               <div className="w-16 h-16 border-4 border-brand-100 border-t-brand-600 rounded-full animate-spin mb-6"></div>
               <h3 className="text-xl font-bold text-slate-800 mb-2">Consulting the Encyclopedia...</h3>
               <p className="text-slate-500 text-center max-w-md">
                 Our AI is browsing live sources from 2024-2025 to get you the most accurate answer.
               </p>
            </div>
          )}

          {/* RESULTS STATE */}
          <div className="space-y-6">
            {status === LoadingState.ERROR && (
              <div className="bg-red-50 border border-red-100 rounded-2xl p-6 flex items-start text-red-800 animate-fadeIn">
                <AlertCircle className="h-6 w-6 mr-4 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-lg mb-1">Knowledge Retrieval Failed</h3>
                  <p className="opacity-90">{error}</p>
                </div>
              </div>
            )}

            {status === LoadingState.SUCCESS && result && (
              <div className="animate-fadeIn">
                {/* Main Response Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-10 mb-8 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-400 to-cyan-400"></div>
                  
                  <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-50">
                     <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">{query}</h1>
                        <div className="flex items-center gap-2">
                          <span className="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded flex items-center">
                              <Zap className="w-3 h-3 mr-1" />
                              Verified Live Data
                          </span>
                          <span className="text-slate-400 text-xs">Updated: {new Date().toLocaleDateString()}</span>
                        </div>
                     </div>
                     <div className="hidden md:flex bg-brand-50 p-3 rounded-full text-brand-600">
                        <BookOpen className="w-6 h-6" />
                     </div>
                  </div>

                  <div className="prose prose-slate max-w-none prose-headings:text-brand-900 prose-headings:font-bold prose-p:text-slate-700 prose-a:text-brand-600 prose-strong:text-slate-900 prose-li:text-slate-700">
                    <div className="whitespace-pre-wrap text-lg leading-relaxed font-light">
                      {result.text}
                    </div>
                  </div>
                </div>

                {/* Sources / Grounding */}
                {result.sources && result.sources.length > 0 && (
                  <div className="bg-slate-50 rounded-2xl p-6 md:p-8 border border-slate-200">
                    <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-6 flex items-center">
                      <Globe2 className="w-4 h-4 mr-2" />
                      Citations & References / 参考文献
                    </h3>
                    <div className="grid gap-4 md:grid-cols-2">
                      {result.sources.map((source, idx) => {
                        if (!source.web) return null;
                        return (
                          <a
                            key={idx}
                            href={source.web.uri}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-start p-4 bg-white rounded-xl border border-slate-200 hover:border-brand-300 hover:shadow-md transition-all group"
                          >
                            <div className="bg-slate-100 p-2 rounded-lg mr-3 group-hover:bg-brand-50 group-hover:text-brand-600 transition-colors">
                               <ExternalLink className="h-4 w-4 text-slate-500" />
                            </div>
                            <div className="overflow-hidden">
                              <div className="font-bold text-slate-900 truncate group-hover:text-brand-700 text-sm mb-1">
                                {source.web.title}
                              </div>
                              <div className="text-xs text-slate-400 truncate font-mono">
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
