
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { BOOK_DATA } from './constants';
import { generateIllustration, generateNarration } from './services/gemini';
import { LoadingSpinner } from './components/LoadingSpinner';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [illustrations, setIllustrations] = useState<Record<number, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isNarrating, setIsNarrating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const audioSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  const page = BOOK_DATA[currentPage];

  const handleGenerateIllustration = useCallback(async (index: number) => {
    if (illustrations[index]) return;
    
    setIsLoading(true);
    setError(null);
    try {
      const imageUrl = await generateIllustration(BOOK_DATA[index].illustrationPrompt);
      setIllustrations(prev => ({ ...prev, [index]: imageUrl }));
    } catch (err: any) {
      setError("Ops! O anjo das artes está ocupado. Tente novamente em instantes.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [illustrations]);

  const stopNarration = useCallback(() => {
    if (audioSourceRef.current) {
      audioSourceRef.current.stop();
      audioSourceRef.current = null;
    }
    setIsNarrating(false);
  }, []);

  const handleNarrate = useCallback(async () => {
    if (isNarrating) {
      stopNarration();
      return;
    }

    setIsNarrating(true);
    try {
      const buffer = await generateNarration(page.content);
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const source = audioCtxRef.current.createBufferSource();
      source.buffer = buffer;
      source.connect(audioCtxRef.current.destination);
      source.onended = () => setIsNarrating(false);
      source.start();
      audioSourceRef.current = source;
    } catch (err) {
      console.error(err);
      setIsNarrating(false);
    }
  }, [page.content, isNarrating, stopNarration]);

  useEffect(() => {
    handleGenerateIllustration(currentPage);
  }, [currentPage, handleGenerateIllustration]);

  const nextPage = () => {
    if (currentPage < BOOK_DATA.length - 1) {
      stopNarration();
      setCurrentPage(prev => prev + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      stopNarration();
      setCurrentPage(prev => prev - 1);
    }
  };

  return (
    <div className="min-h-screen bg-[#fdfbf7] flex flex-col items-center justify-center p-4 md:p-8">
      {/* Header */}
      <header className="mb-8 text-center">
        <h1 className="text-4xl md:text-5xl font-cursive text-amber-900 mb-2">A Aquarela de Davi</h1>
        <p className="text-amber-700 font-medium tracking-wide">Um Livro de Fé e Cores</p>
      </header>

      {/* Book Container */}
      <main className="relative w-full max-w-5xl aspect-[4/3] md:aspect-[16/9] bg-white rounded-xl shadow-2xl overflow-hidden border-8 border-amber-100 flex flex-col md:flex-row">
        
        {/* Left Side: Illustration */}
        <div className="w-full md:w-1/2 h-1/2 md:h-full bg-amber-50 relative flex items-center justify-center border-b md:border-b-0 md:border-r border-amber-100 p-4">
          {isLoading ? (
            <LoadingSpinner />
          ) : illustrations[currentPage] ? (
            <img 
              src={illustrations[currentPage]} 
              alt="Ilustração da página" 
              className="w-full h-full object-contain rounded shadow-sm animate-in fade-in duration-1000"
            />
          ) : (
            <div className="text-center p-6 text-amber-600 italic">
              Preparando a aquarela...
            </div>
          )}
          {error && (
            <div className="absolute inset-0 bg-white/90 flex items-center justify-center p-8 text-center z-10">
              <div className="space-y-4">
                <p className="text-red-600 font-medium">{error}</p>
                <button 
                  onClick={() => handleGenerateIllustration(currentPage)}
                  className="px-6 py-2 bg-amber-600 text-white rounded-full hover:bg-amber-700 transition shadow-md"
                >
                  Tentar Novamente
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Side: Text & Story */}
        <div className="w-full md:w-1/2 h-1/2 md:h-full p-6 md:p-10 flex flex-col justify-between bg-white bg-[url('https://www.transparenttextures.com/patterns/parchment.png')]">
          <div>
            <div className="flex justify-between items-center mb-4">
              <div className="flex flex-col">
                <span className="text-amber-500 font-bold text-sm tracking-widest uppercase">Página {page.pageNumber}</span>
                <span className="text-xs text-amber-400 italic font-medium">{page.bibleReference}</span>
              </div>
              <button 
                onClick={handleNarrate}
                className={`p-3 rounded-full transition-all duration-300 ${isNarrating ? 'bg-amber-500 text-white shadow-lg scale-110 ring-4 ring-amber-100' : 'bg-amber-100 text-amber-700 hover:bg-amber-200'}`}
                title={isNarrating ? "Parar Narração" : "Ouvir História"}
              >
                {isNarrating ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5L6 9H2v6h4l5 4V5z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.54 8.46a5 5 0 010 7.07M19.07 4.93a10 10 0 010 14.14" />
                  </svg>
                )}
              </button>
            </div>

            <h2 className="text-2xl md:text-3xl font-bold text-amber-900 mb-5 leading-tight">{page.title}</h2>
            
            <div className="space-y-4 text-amber-950 text-base md:text-lg leading-relaxed whitespace-pre-wrap">
              {page.content}
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-amber-100">
             <div className="bg-amber-50 p-4 rounded-lg border-l-4 border-amber-400 shadow-sm">
               <div className="flex justify-between items-start mb-1">
                 <span className="block text-[10px] uppercase tracking-[0.2em] text-amber-600 font-black">📖 Lição</span>
                 <span className="text-[10px] font-bold text-amber-400 px-2 py-0.5 bg-white rounded-full border border-amber-100">{page.bibleReference}</span>
               </div>
               <p className="text-amber-800 font-semibold italic text-sm md:text-base leading-snug">{page.lesson}</p>
             </div>
          </div>
        </div>
      </main>

      {/* Navigation Controls */}
      <div className="mt-10 flex items-center space-x-8">
        <button 
          onClick={prevPage}
          disabled={currentPage === 0}
          className="p-4 rounded-full bg-white shadow-md text-amber-800 disabled:opacity-20 hover:shadow-xl hover:bg-amber-50 transition-all disabled:cursor-not-allowed group"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <div className="flex space-x-3">
          {BOOK_DATA.map((_, i) => (
            <div 
              key={i} 
              className={`h-2.5 rounded-full transition-all duration-500 ease-out shadow-inner ${i === currentPage ? 'bg-amber-600 w-10 ring-2 ring-amber-100' : 'bg-amber-200 w-2.5 hover:bg-amber-300'}`}
            />
          ))}
        </div>

        <button 
          onClick={nextPage}
          disabled={currentPage === BOOK_DATA.length - 1}
          className="p-4 rounded-full bg-white shadow-md text-amber-800 disabled:opacity-20 hover:shadow-xl hover:bg-amber-50 transition-all disabled:cursor-not-allowed group"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Footer */}
      <footer className="mt-12 text-center text-amber-800/40 text-[10px] uppercase tracking-widest font-bold">
        <p>© 2024 Bíblia Infantil Ilustrada • Criado com Fé e Tecnologia</p>
      </footer>
    </div>
  );
};

export default App;
