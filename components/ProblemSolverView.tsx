
import React, { useState, useRef } from 'react';
import { Camera, Upload, X, Sparkles, Loader2, ArrowRight, GraduationCap, User, Baby } from 'lucide-react';
import { solveProblemFromImage } from '../services/geminiService';
import { LoadingState } from '../types';

export const ProblemSolverView: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageData, setImageData] = useState<{ base64: string; mimeType: string } | null>(null);
  const [status, setStatus] = useState<LoadingState>(LoadingState.IDLE);
  const [result, setResult] = useState<string | null>(null);
  const [persona, setPersona] = useState<'standard' | 'child'>('standard');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Create preview URL
    const previewUrl = URL.createObjectURL(file);
    setSelectedImage(previewUrl);
    setResult(null);
    setStatus(LoadingState.IDLE);

    // Convert to Base64 for API
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = (reader.result as string).split(',')[1];
      setImageData({
        base64: base64String,
        mimeType: file.type,
      });
    };
    reader.readAsDataURL(file);
  };

  const handleSolve = async () => {
    if (!imageData) return;

    setStatus(LoadingState.LOADING);
    try {
      const solution = await solveProblemFromImage(imageData.base64, imageData.mimeType, persona);
      setResult(solution);
      setStatus(LoadingState.SUCCESS);
    } catch (error) {
      console.error(error);
      setStatus(LoadingState.ERROR);
    }
  };

  const clearImage = () => {
    setSelectedImage(null);
    setImageData(null);
    setResult(null);
    setStatus(LoadingState.IDLE);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center p-3 bg-purple-100 rounded-full text-purple-600 mb-4">
          <Camera size={32} />
        </div>
        <h2 className="text-3xl font-bold text-slate-900 mb-2">AI Snap & Solve / 拍照解题</h2>
        <p className="text-slate-600">
          Take a photo of any homework problem. AI will analyze and explain it.<br />
          拍摄题目，AI为您提供详细的解题思路与分析。
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column: Input */}
        <div className="space-y-6">
          {/* Image Upload Area */}
          <div className={`relative border-2 border-dashed rounded-2xl p-8 transition-all text-center min-h-[300px] flex flex-col items-center justify-center ${selectedImage ? 'border-purple-500 bg-purple-50' : 'border-slate-300 hover:border-purple-400 bg-slate-50'}`}>
            
            {!selectedImage ? (
              <>
                <div className="mb-4 flex space-x-4">
                   <div className="h-16 w-16 bg-white rounded-full shadow-sm flex items-center justify-center text-slate-400">
                      <Camera size={32} />
                   </div>
                </div>
                <h3 className="text-lg font-medium text-slate-900 mb-1">Upload or Snap a Photo</h3>
                <p className="text-sm text-slate-500 mb-6">Supports JPG, PNG</p>
                
                <div className="flex gap-4">
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="px-6 py-2.5 bg-purple-600 text-white rounded-xl font-medium shadow-md hover:bg-purple-700 transition-colors flex items-center"
                    >
                       <Camera className="w-4 h-4 mr-2" />
                       Camera / Upload
                    </button>
                </div>
                <input 
                  ref={fileInputRef}
                  type="file" 
                  accept="image/*" 
                  capture="environment"
                  className="hidden" 
                  onChange={handleFileChange}
                />
              </>
            ) : (
              <div className="relative w-full h-full flex items-center justify-center">
                <img 
                  src={selectedImage} 
                  alt="Problem Preview" 
                  className="max-h-[400px] w-auto rounded-lg shadow-lg object-contain" 
                />
                <button 
                  onClick={clearImage}
                  className="absolute -top-4 -right-4 bg-white rounded-full p-2 shadow-lg text-red-500 hover:bg-red-50 border border-red-100"
                >
                  <X size={20} />
                </button>
              </div>
            )}
          </div>

          {/* Persona Selector */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-slate-700 mb-3">Explanation Style / 讲解风格</h4>
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => setPersona('standard')}
                className={`p-3 rounded-lg border text-left flex items-center transition-all ${persona === 'standard' ? 'border-purple-500 bg-purple-50 text-purple-900 ring-1 ring-purple-500' : 'border-slate-200 hover:bg-slate-50'}`}
              >
                <div className="bg-white p-2 rounded-full shadow-sm mr-3 text-slate-700">
                   <User size={20} />
                </div>
                <div>
                  <div className="font-bold text-sm">Standard</div>
                  <div className="text-xs opacity-70">Academic / 标准</div>
                </div>
              </button>
              
              <button 
                onClick={() => setPersona('child')}
                className={`p-3 rounded-lg border text-left flex items-center transition-all ${persona === 'child' ? 'border-pink-500 bg-pink-50 text-pink-900 ring-1 ring-pink-500' : 'border-slate-200 hover:bg-slate-50'}`}
              >
                <div className="bg-white p-2 rounded-full shadow-sm mr-3 text-pink-500">
                   <Baby size={20} />
                </div>
                <div>
                  <div className="font-bold text-sm">9-Year-Old</div>
                  <div className="text-xs opacity-70">Simple / 儿童易懂</div>
                </div>
              </button>
            </div>
          </div>

          {/* Action Button */}
          <button
            onClick={handleSolve}
            disabled={!selectedImage || status === LoadingState.LOADING}
            className="w-full py-4 bg-purple-600 text-white rounded-xl font-bold text-lg shadow-lg hover:bg-purple-700 hover:shadow-purple-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {status === LoadingState.LOADING ? (
              <>
                <Loader2 className="animate-spin h-5 w-5 mr-2" />
                Analyzing / 分析中...
              </>
            ) : (
              <>
                <Sparkles className="h-5 w-5 mr-2" />
                Analyze & Solve / 智能解题
              </>
            )}
          </button>
        </div>

        {/* Right Column: Results */}
        <div className="h-full">
          {status === LoadingState.IDLE && !result && (
            <div className="h-full min-h-[300px] bg-white rounded-2xl border border-slate-100 p-8 flex flex-col items-center justify-center text-center text-slate-400">
              <GraduationCap size={48} className="mb-4 opacity-20" />
              <p>Upload an image to see the AI analysis here.<br/>上传图片后，AI解析将显示在这里。</p>
            </div>
          )}

          {status === LoadingState.LOADING && (
             <div className="h-full min-h-[300px] bg-white rounded-2xl border border-slate-100 p-8 flex flex-col items-center justify-center text-center">
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-purple-100 border-t-purple-600 rounded-full animate-spin"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-purple-600 animate-pulse" />
                  </div>
                </div>
                <h3 className="mt-6 font-bold text-slate-800 text-lg">Thinking...</h3>
                <p className="text-slate-500 mt-2">Identifying the problem and finding the best solution method.</p>
             </div>
          )}

          {status === LoadingState.SUCCESS && result && (
            <div className="h-full bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden animate-fadeIn">
              <div className="bg-purple-50 p-4 border-b border-purple-100 flex items-center justify-between">
                 <h3 className="font-bold text-purple-900 flex items-center">
                   <Sparkles className="w-4 h-4 mr-2 text-purple-600" />
                   AI Solution
                 </h3>
                 <span className="text-xs bg-white px-2 py-1 rounded text-purple-700 font-medium border border-purple-100">
                   {persona === 'child' ? 'Explain for Child' : 'Standard Explanation'}
                 </span>
              </div>
              <div className="p-6 md:p-8 overflow-y-auto max-h-[600px]">
                 <div className="prose prose-slate prose-p:text-slate-700 prose-headings:text-slate-900 max-w-none">
                    <div className="whitespace-pre-wrap leading-relaxed text-lg">
                      {result}
                    </div>
                 </div>
              </div>
              <div className="bg-slate-50 p-4 border-t border-slate-100 text-center">
                 <button onClick={clearImage} className="text-sm text-purple-600 font-medium hover:underline flex items-center justify-center w-full">
                    Solve Another Problem <ArrowRight className="w-4 h-4 ml-1" />
                 </button>
              </div>
            </div>
          )}

          {status === LoadingState.ERROR && (
            <div className="h-full bg-red-50 rounded-2xl border border-red-100 p-8 flex items-center justify-center text-red-800">
              <p>Something went wrong. Please try again.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
