
import React, { useState, useEffect } from 'react';
import { AppState, Difficulty, LessonContent, LessonType, UserSelection } from './types';
import { generateLesson } from './services/geminiService';
import { Button } from './components/Button';
import { LessonView } from './components/LessonView';
import { Terminal, Clock, GraduationCap, Play, AlertTriangle, Sparkles, ArrowLeft } from 'lucide-react';

const TOPICS = [
  "Software Engineering",
  "Web Development",
  "Cloud Computing",
  "Data Science",
  "Business English",
  "Casual Conversation"
];

const DIFFICULTY_OPTIONS = [
  { label: 'Simple', value: Difficulty.BEGINNER },
  { label: 'Medium', value: Difficulty.INTERMEDIATE },
  { label: 'Hard', value: Difficulty.ADVANCED },
];

function App() {
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [selection, setSelection] = useState<UserSelection>({
    duration: 2,
    type: LessonType.VOCABULARY,
    topicFocus: "Software Engineering"
  });
  const [difficulty, setDifficulty] = useState<Difficulty>(Difficulty.INTERMEDIATE);
  const [lesson, setLesson] = useState<LessonContent | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  const handleStart = async () => {
    setAppState(AppState.GENERATING);
    setErrorMsg("");
    try {
      const content = await generateLesson(
        selection.duration,
        selection.type,
        selection.topicFocus,
        difficulty
      );
      setLesson(content);
      setAppState(AppState.LEARNING);
    } catch (err) {
      setAppState(AppState.ERROR);
      setErrorMsg("AI backend is busy. Please try again.");
    }
  };

  const handleReset = () => {
    setAppState(AppState.IDLE);
    setLesson(null);
  };

  return (
    <div className="min-h-screen bg-[#0d1117] text-gray-200 font-sans selection:bg-emerald-500/30">
      
      {/* Header */}
      <header className="border-b border-gray-800 bg-[#161b22]">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-emerald-600 rounded flex items-center justify-center shadow-lg shadow-emerald-900/50">
               <Terminal className="w-5 h-5 text-white" />
            </div>
            <h1 className="font-bold text-lg tracking-tight text-white">CodeWait<span className="text-emerald-500 font-light">English</span></h1>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-gray-500 bg-gray-900 px-3 py-1 rounded-full border border-gray-800">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            SYSTEM READY
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-12">
        
        {/* IDLE STATE: Configuration Dashboard */}
        {appState === AppState.IDLE && (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="text-center space-y-4">
              <h2 className="text-4xl font-bold text-white">Compiling? Deploying?</h2>
              <p className="text-gray-400 text-lg">Turn that 5-minute wait into a skill upgrade.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              
              {/* Configuration Card */}
              <div className="bg-[#161b22] border border-gray-800 rounded-xl p-6 shadow-2xl shadow-black/50">
                <div className="space-y-8">
                  
                  {/* Duration */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-400 mb-3">
                      <Clock className="w-4 h-4" /> AVAILABLE TIME
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {[1, 3, 5].map(min => (
                        <button
                          key={min}
                          onClick={() => setSelection({ ...selection, duration: min })}
                          className={`py-2 px-4 rounded-lg border text-sm font-mono transition-all ${
                            selection.duration === min 
                            ? 'bg-emerald-600 border-emerald-500 text-white shadow-lg shadow-emerald-900/20' 
                            : 'bg-gray-800/50 border-gray-700 text-gray-400 hover:bg-gray-800'
                          }`}
                        >
                          {min} MIN
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Mode */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-400 mb-3">
                      <GraduationCap className="w-4 h-4" /> TRAINING MODE
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {Object.values(LessonType).map((type) => (
                        <button
                          key={type}
                          onClick={() => setSelection({ ...selection, type })}
                          className={`py-3 px-4 rounded-lg border text-sm text-left transition-all ${
                            selection.type === type
                            ? 'bg-blue-600/20 border-blue-500 text-blue-100'
                            : 'bg-gray-800/50 border-gray-700 text-gray-400 hover:bg-gray-800'
                          }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Topic */}
                  <div>
                     <label className="flex items-center gap-2 text-sm font-medium text-gray-400 mb-3">
                      <Sparkles className="w-4 h-4" /> FOCUS AREA
                    </label>
                    <select 
                      value={selection.topicFocus}
                      onChange={(e) => setSelection({...selection, topicFocus: e.target.value})}
                      className="w-full bg-gray-900 border border-gray-700 text-white rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none appearance-none"
                    >
                      {TOPICS.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  
                  {/* Start Button */}
                  <div className="pt-4">
                    <Button 
                      onClick={handleStart} 
                      className="w-full py-4 text-lg shadow-xl shadow-emerald-900/20"
                    >
                      Start Session <Play className="w-4 h-4 ml-2 fill-current" />
                    </Button>
                  </div>

                </div>
              </div>

              {/* Info / Stats Placeholder */}
              <div className="flex flex-col justify-center space-y-6 text-gray-400 p-6">
                 <div className="bg-[#161b22] p-6 rounded-xl border border-gray-800">
                    <h3 className="text-white font-medium mb-2">Why "CodeWait"?</h3>
                    <p className="text-sm leading-relaxed mb-4">
                      Context switching destroys flow. Instead of checking social media while waiting for a build, maintain your "engineering brain" active by learning technical English terms and concepts.
                    </p>
                 </div>
                 <div className="bg-[#161b22] p-6 rounded-xl border border-gray-800 opacity-70">
                    <h3 className="text-white font-medium mb-3">Difficulty Level</h3>
                    <div className="grid grid-cols-3 gap-2">
                      {DIFFICULTY_OPTIONS.map(opt => (
                        <button 
                          key={opt.value}
                          onClick={() => setDifficulty(opt.value)}
                          className={`text-xs px-2 py-2 rounded border font-medium transition-all ${
                            difficulty === opt.value 
                            ? 'bg-gray-700 border-gray-500 text-white' 
                            : 'border-gray-800 bg-gray-900/50 text-gray-500 hover:bg-gray-800'
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                 </div>
              </div>

            </div>
          </div>
        )}

        {/* LOADING STATE */}
        {appState === AppState.GENERATING && (
          <div className="flex flex-col items-center justify-center h-[60vh] space-y-8">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-gray-700 border-t-emerald-500 rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
              </div>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-medium text-white mb-2">Generating Lesson...</h3>
              <p className="text-gray-500 font-mono text-sm">Fetching context for {selection.topicFocus}...</p>
            </div>
          </div>
        )}

        {/* ERROR STATE */}
        {appState === AppState.ERROR && (
          <div className="flex flex-col items-center justify-center h-[60vh] space-y-6">
            <div className="w-16 h-16 bg-red-900/20 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-xl font-medium text-white">{errorMsg || "Something went wrong"}</h3>
            <Button onClick={handleReset} variant="secondary">Try Again</Button>
          </div>
        )}

        {/* LEARNING STATE */}
        {appState === AppState.LEARNING && lesson && (
          <div className="animate-in fade-in duration-500">
            <div className="mb-6">
              <button 
                onClick={handleReset} 
                className="text-gray-500 hover:text-white flex items-center gap-2 text-sm transition-colors"
              >
                <ArrowLeft className="w-4 h-4" /> Quit Lesson
              </button>
            </div>
            <LessonView 
              lesson={lesson} 
              lessonType={selection.type}
              onComplete={() => setAppState(AppState.SUMMARY)} 
            />
          </div>
        )}

        {/* SUMMARY STATE */}
        {appState === AppState.SUMMARY && (
          <div className="max-w-xl mx-auto text-center space-y-8 pt-12 animate-in zoom-in-95 duration-500">
            <div className="w-24 h-24 bg-emerald-600 rounded-full mx-auto flex items-center justify-center shadow-2xl shadow-emerald-500/20">
              <GraduationCap className="w-12 h-12 text-white" />
            </div>
            
            <div className="space-y-2">
              <h2 className="text-3xl font-bold text-white">Session Complete!</h2>
              <p className="text-gray-400">You've productively used your wait time.</p>
            </div>

            <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700">
              <div className="flex justify-between items-center text-sm text-gray-300 mb-4">
                <span>Topic Covered</span>
                <span className="font-mono text-white">{selection.topicFocus}</span>
              </div>
              <div className="flex justify-between items-center text-sm text-gray-300">
                 <span>Duration</span>
                 <span className="font-mono text-white">~{selection.duration} min</span>
              </div>
            </div>

            <div className="flex gap-4 justify-center">
              <Button onClick={handleReset} variant="outline">Home</Button>
              <Button onClick={handleStart}>Start Another</Button>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}

export default App;
