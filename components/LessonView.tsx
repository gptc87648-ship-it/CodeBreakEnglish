import React, { useState } from 'react';
import { LessonContent, QuestionItem, LessonType } from '../types';
import { Button } from './Button';
import { CheckCircle2, XCircle, ArrowRight, BookOpen, Code2, RefreshCw } from 'lucide-react';

interface LessonViewProps {
  lesson: LessonContent;
  lessonType: LessonType;
  onComplete: () => void;
}

export const LessonView: React.FC<LessonViewProps> = ({ lesson, lessonType, onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [score, setScore] = useState(0);

  const currentItem: QuestionItem = lesson.items[currentIndex];
  const isLast = currentIndex === lesson.items.length - 1;

  const handleNext = () => {
    if (isLast) {
      onComplete();
    } else {
      setCurrentIndex(prev => prev + 1);
      setShowAnswer(false);
      setSelectedOption(null);
    }
  };

  const handleOptionSelect = (opt: string) => {
    if (showAnswer) return;
    setSelectedOption(opt);
    setShowAnswer(true);
    if (opt === currentItem.correctAnswer) {
      setScore(prev => prev + 1);
    }
  };

  const revealAnswer = () => {
    setShowAnswer(true);
  };

  // Render different views based on Lesson Type
  const renderContent = () => {
    // QUIZ MODE
    if (lessonType === LessonType.QUIZ && currentItem.options) {
      return (
        <div className="space-y-6">
          <h3 className="text-xl font-medium text-white">{currentItem.question}</h3>
          <div className="grid gap-3">
            {currentItem.options.map((opt, idx) => {
              let btnClass = "w-full text-left p-4 rounded-lg border transition-all ";
              if (!showAnswer) {
                btnClass += "border-gray-700 bg-gray-800 hover:bg-gray-700";
              } else {
                if (opt === currentItem.correctAnswer) {
                  btnClass += "border-emerald-500 bg-emerald-900/30 text-emerald-100";
                } else if (opt === selectedOption) {
                  btnClass += "border-red-500 bg-red-900/30 text-red-100";
                } else {
                  btnClass += "border-gray-700 bg-gray-800 opacity-50";
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleOptionSelect(opt)}
                  disabled={showAnswer}
                  className={btnClass}
                >
                  <div className="flex items-center justify-between">
                    <span>{opt}</span>
                    {showAnswer && opt === currentItem.correctAnswer && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
                    {showAnswer && opt === selectedOption && opt !== currentItem.correctAnswer && <XCircle className="w-5 h-5 text-red-400" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      );
    }

    // VOCABULARY MODE
    if (lessonType === LessonType.VOCABULARY) {
      return (
        <div className="space-y-6 text-center py-4">
          <div className="inline-block p-3 bg-blue-900/30 rounded-full mb-2">
             <BookOpen className="w-8 h-8 text-blue-400" />
          </div>
          <h2 className="text-3xl font-bold text-white tracking-tight">{currentItem.term || currentItem.question}</h2>
          
          {!showAnswer ? (
             <div className="h-32 flex items-center justify-center">
                <Button onClick={revealAnswer} variant="secondary">Reveal Definition</Button>
             </div>
          ) : (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                <p className="text-lg text-emerald-100 font-medium">{currentItem.correctAnswer}</p>
              </div>
              
              {currentItem.context && (
                <div className="text-left bg-gray-900 p-4 rounded-lg border-l-4 border-blue-500">
                  <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">Context / Example</p>
                  <p className="text-gray-300 font-mono text-sm leading-relaxed">{currentItem.context}</p>
                </div>
              )}
              
              <div className="text-left">
                 <p className="text-sm text-gray-400 italic">{currentItem.explanation}</p>
              </div>
            </div>
          )}
        </div>
      );
    }

    // TECH READING / GRAMMAR FIX
    return (
      <div className="space-y-6">
        <div className="bg-gray-900 p-5 rounded-lg border border-gray-700 font-mono text-sm text-gray-300 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-2 opacity-20 group-hover:opacity-40 transition-opacity">
            <Code2 className="w-16 h-16" />
          </div>
          <p className="relative z-10 leading-relaxed whitespace-pre-wrap">
            {currentItem.context || currentItem.question}
          </p>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium text-white">
            {lessonType === LessonType.GRAMMAR_FIX ? "How should this be corrected?" : "Question:"}
          </h3>
          
          {lessonType === LessonType.TECH_READING ? (
             <p className="text-gray-300">{currentItem.question}</p>
          ) : null}

          {!showAnswer ? (
             <Button onClick={revealAnswer} variant="secondary" className="w-full">
                Show {lessonType === LessonType.GRAMMAR_FIX ? "Correction" : "Answer"}
             </Button>
          ) : (
            <div className="bg-emerald-900/20 border border-emerald-800 p-4 rounded-lg animate-in fade-in">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 mt-1 shrink-0" />
                <div>
                  <p className="font-medium text-emerald-100 mb-2">{currentItem.correctAnswer}</p>
                  <p className="text-sm text-gray-400">{currentItem.explanation}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-2xl mx-auto w-full">
      {/* Progress Bar */}
      <div className="mb-8 flex items-center justify-between text-xs font-mono text-gray-500">
        <span>ITEM {currentIndex + 1} / {lesson.items.length}</span>
        <span>{lesson.topic.toUpperCase()}</span>
      </div>
      <div className="w-full bg-gray-800 h-1 rounded-full mb-8 overflow-hidden">
        <div 
          className="bg-emerald-500 h-full transition-all duration-300"
          style={{ width: `${((currentIndex + 1) / lesson.items.length) * 100}%` }}
        />
      </div>

      <div className="min-h-[400px] flex flex-col justify-between">
        <div>
          {renderContent()}
        </div>

        <div className="mt-8 flex justify-end">
          {showAnswer && (
            <Button onClick={handleNext} size="lg" className="group">
              {isLast ? 'Finish' : 'Next'} 
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
