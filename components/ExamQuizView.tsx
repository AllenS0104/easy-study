
import React, { useState } from 'react';
import { Loader2, CheckCircle, XCircle, HelpCircle, RefreshCw, Trophy, ArrowRight, GraduationCap } from 'lucide-react';
import { generateMockTest } from '../services/geminiService';
import { Quiz, LoadingState } from '../types';

export const ExamQuizView: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState('medium');
  const [status, setStatus] = useState<LoadingState>(LoadingState.IDLE);
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({}); // questionId -> selectedIndex
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setStatus(LoadingState.LOADING);
    setQuiz(null);
    setUserAnswers({});
    setIsSubmitted(false);

    try {
      const data = await generateMockTest(topic, difficulty);
      setQuiz(data);
      setStatus(LoadingState.SUCCESS);
    } catch (error) {
      console.error(error);
      setStatus(LoadingState.ERROR);
    }
  };

  const handleSelectOption = (questionId: number, optionIndex: number) => {
    if (isSubmitted) return;
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: optionIndex
    }));
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
  };

  const calculateScore = () => {
    if (!quiz) return 0;
    let score = 0;
    quiz.questions.forEach(q => {
      if (userAnswers[q.id] === q.correctAnswerIndex) {
        score++;
      }
    });
    return score;
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center p-3 bg-brand-100 rounded-full text-brand-600 mb-4">
           <GraduationCap size={32} />
        </div>
        <h2 className="text-3xl font-bold text-slate-900 mb-2">AI 模拟考场 / Mock Exams</h2>
        <p className="text-slate-600">Generate custom practice tests for any subject instantly.<br/>随时生成任意学科的模拟试题。</p>
      </div>

      {/* Config Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 mb-8">
        <form onSubmit={handleGenerate} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Subject Topic / 考试主题</label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., High School Physics, Tang Dynasty History, Traffic Rules..."
              className="block w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all text-lg"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div>
               <label className="block text-sm font-bold text-slate-700 mb-2">Difficulty / 难度</label>
               <select 
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="block w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-brand-500 focus:border-transparent"
               >
                 <option value="easy">Easy / 简单 (Foundation)</option>
                 <option value="medium">Medium / 中等 (Standard)</option>
                 <option value="hard">Hard / 困难 (Advanced)</option>
               </select>
             </div>
             <div className="flex items-end">
                <button
                  type="submit"
                  disabled={status === LoadingState.LOADING || !topic.trim()}
                  className="w-full py-3 bg-brand-600 text-white rounded-xl font-bold hover:bg-brand-700 transition-colors disabled:opacity-50 flex justify-center items-center shadow-md hover:shadow-lg"
                >
                  {status === LoadingState.LOADING ? (
                    <>
                      <Loader2 className="animate-spin h-5 w-5 mr-2" />
                      Generating / 生成中...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="h-5 w-5 mr-2" />
                      Create Quiz / 生成试卷
                    </>
                  )}
                </button>
             </div>
          </div>
        </form>
      </div>

      {/* Quiz Area */}
      {status === LoadingState.SUCCESS && quiz && (
        <div className="animate-fadeIn space-y-6">
          
          {/* Score Card (appears after submit) */}
          {isSubmitted && (
             <div className="bg-gradient-to-r from-brand-500 to-cyan-600 rounded-2xl p-6 text-white shadow-lg flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold mb-1">Result / 成绩</h3>
                  <p className="opacity-90 text-lg">You scored <span className="font-bold text-yellow-300 text-2xl mx-1">{calculateScore()}</span> out of {quiz.questions.length}</p>
                </div>
                <div className="h-16 w-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <Trophy className="h-8 w-8 text-white" />
                </div>
             </div>
          )}

          {quiz.questions.map((q, index) => {
            const isSelected = userAnswers[q.id] !== undefined;
            const showResult = isSubmitted;

            return (
              <div key={q.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-6 border-b border-slate-50">
                   <div className="flex items-start">
                      <span className="flex-shrink-0 h-8 w-8 bg-brand-100 text-brand-700 rounded-lg flex items-center justify-center font-bold text-sm mr-4">
                        Q{index + 1}
                      </span>
                      <h3 className="text-lg font-medium text-slate-900 pt-1 leading-relaxed">{q.question}</h3>
                   </div>
                </div>

                <div className="p-4 space-y-3">
                  {q.options.map((option, idx) => {
                    let optionClass = "border-slate-200 hover:bg-slate-50 text-slate-700";
                    
                    if (showResult) {
                      if (idx === q.correctAnswerIndex) {
                         optionClass = "border-green-500 bg-green-50 text-green-800";
                      } else if (userAnswers[q.id] === idx) {
                         optionClass = "border-red-500 bg-red-50 text-red-800";
                      } else {
                         optionClass = "border-slate-100 opacity-50";
                      }
                    } else {
                       if (userAnswers[q.id] === idx) {
                          optionClass = "border-brand-500 bg-brand-50 text-brand-900 ring-1 ring-brand-500";
                       }
                    }

                    return (
                      <button
                        key={idx}
                        onClick={() => handleSelectOption(q.id, idx)}
                        disabled={showResult}
                        className={`w-full text-left px-5 py-4 border rounded-xl transition-all flex items-center justify-between text-base ${optionClass}`}
                      >
                        <div className="flex items-center">
                           <span className="inline-block w-6 font-medium text-slate-400 mr-2">{String.fromCharCode(65+idx)}.</span>
                           {option}
                        </div>
                        {showResult && idx === q.correctAnswerIndex && <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 ml-2" />}
                        {showResult && userAnswers[q.id] === idx && idx !== q.correctAnswerIndex && <XCircle className="h-5 w-5 text-red-500 flex-shrink-0 ml-2" />}
                      </button>
                    );
                  })}
                </div>

                {/* Explanation */}
                {showResult && (
                  <div className="bg-slate-50 p-5 border-t border-slate-100">
                    <div className="flex items-start gap-3">
                       <HelpCircle className="h-5 w-5 text-brand-500 mt-0.5 flex-shrink-0" />
                       <div>
                          <span className="font-bold text-slate-700 text-sm uppercase tracking-wide">Explanation / 解析</span>
                          <p className="text-slate-600 mt-1 text-sm leading-relaxed">{q.explanation}</p>
                       </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {!isSubmitted && (
             <div className="flex justify-center pt-4 pb-12">
                <button 
                  onClick={handleSubmit}
                  disabled={Object.keys(userAnswers).length !== quiz.questions.length}
                  className="w-full md:w-auto px-10 py-4 bg-brand-600 text-white rounded-xl font-bold text-lg shadow-lg hover:bg-brand-700 hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                   Submit Answers / 提交答案 <ArrowRight className="ml-2 h-5 w-5" />
                </button>
             </div>
          )}
        </div>
      )}
    </div>
  );
};
