import React, { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { BOOK_DATA } from './constants';
import { generateIllustration, generateNarration } from './services/gemini';
import { LoadingSpinner } from './components/LoadingSpinner';

const PROGRESS_KEY = 'davi-reading-progress-v1';
const BOOKMARKS_KEY = 'davi-reading-bookmarks-v1';
const FONT_KEY = 'davi-font-scale-v1';

const App: React.FC = () => {
  const [hasStarted, setHasStarted] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [illustrations, setIllustrations] = useState<Record<number, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isNarrating, setIsNarrating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fontScale, setFontScale] = useState<'normal' | 'large'>('normal');
  const [readPages, setReadPages] = useState<number[]>([]);
  const [bookmarks, setBookmarks] = useState<number[]>([]);

  const audioSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  const page = BOOK_DATA[currentPage];

  const completion = useMemo(
    () => Math.min(100, Math.round((readPages.length / BOOK_DATA.length) * 100)),
    [readPages.length],
  );

  useEffect(() => {
    try {
      const savedProgress = localStorage.getItem(PROGRESS_KEY);
      const savedBookmarks = localStorage.getItem(BOOKMARKS_KEY);
      const savedFont = localStorage.getItem(FONT_KEY) as 'normal' | 'large' | null;

      if (savedProgress) {
        const parsed = JSON.parse(savedProgress) as { currentPage: number; readPages: number[]; hasStarted: boolean };
        setCurrentPage(Math.min(Math.max(parsed.currentPage ?? 0, 0), BOOK_DATA.length - 1));
        setReadPages(Array.isArray(parsed.readPages) ? parsed.readPages : []);
        setHasStarted(Boolean(parsed.hasStarted));
      }
      if (savedBookmarks) {
        const parsedBookmarks = JSON.parse(savedBookmarks) as number[];
        setBookmarks(Array.isArray(parsedBookmarks) ? parsedBookmarks : []);
      }
      if (savedFont === 'normal' || savedFont === 'large') {
        setFontScale(savedFont);
      }
    } catch (storageError) {
      console.warn('Não foi possível carregar o progresso salvo.', storageError);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      PROGRESS_KEY,
      JSON.stringify({ currentPage, readPages, hasStarted }),
    );
  }, [currentPage, readPages, hasStarted]);

  useEffect(() => {
    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks));
  }, [bookmarks]);

  useEffect(() => {
    localStorage.setItem(FONT_KEY, fontScale);
  }, [fontScale]);

  const markCurrentPageAsRead = useCallback(() => {
    setReadPages(prev => (prev.includes(currentPage) ? prev : [...prev, currentPage]));
  }, [currentPage]);

  const handleGenerateIllustration = useCallback(async (index: number) => {
    if (illustrations[index]) return;

    setIsLoading(true);
    setError(null);
    try {
      const imageUrl = await generateIllustration(BOOK_DATA[index].illustrationPrompt);
      setIllustrations(prev => ({ ...prev, [index]: imageUrl }));
    } catch (err: any) {
      setError('Ops! O anjo das artes está ocupado. Tente novamente em instantes.');
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
    if (!hasStarted) return;
    handleGenerateIllustration(currentPage);
    markCurrentPageAsRead();
  }, [currentPage, handleGenerateIllustration, hasStarted, markCurrentPageAsRead]);

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

  const jumpToPage = (index: number) => {
    stopNarration();
    setCurrentPage(index);
  };

  const toggleBookmark = () => {
    setBookmarks(prev => (prev.includes(currentPage) ? prev.filter(p => p !== currentPage) : [...prev, currentPage]));
  };

  const clearProgress = () => {
    stopNarration();
    setCurrentPage(0);
    setReadPages([]);
    setBookmarks([]);
    setHasStarted(false);
  };

  const textSizeClass = fontScale === 'large' ? 'text-lg md:text-xl' : 'text-base md:text-lg';

  if (!hasStarted) {
    return (
      <div className="min-h-screen bg-[#fdfbf7] flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-4xl md:text-6xl font-cursive text-amber-900 mb-4">A Aquarela de Davi</h1>
        <p className="text-amber-800 max-w-2xl mb-8">
          Sistema completo de leitura infantil com progresso automático, marcadores, narração e ilustrações com IA.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => setHasStarted(true)}
            className="px-8 py-3 bg-amber-600 text-white rounded-full hover:bg-amber-700 transition shadow-md"
          >
            {readPages.length > 0 ? 'Continuar Leitura' : 'Iniciar Jornada'}
          </button>
          <button
            onClick={clearProgress}
            className="px-8 py-3 bg-white text-amber-700 rounded-full border border-amber-200 hover:bg-amber-50 transition"
          >
            Reiniciar Tudo
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fdfbf7] flex flex-col items-center justify-center p-4 md:p-8">
      <header className="w-full max-w-5xl mb-4 md:mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-cursive text-amber-900">A Aquarela de Davi</h1>
            <p className="text-amber-700 font-medium tracking-wide">Leitor inteligente com progresso salvo</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFontScale(prev => (prev === 'normal' ? 'large' : 'normal'))}
              className="px-4 py-2 rounded-full bg-white border border-amber-200 text-amber-700 text-sm"
            >
              Fonte: {fontScale === 'normal' ? 'Normal' : 'Grande'}
            </button>
            <button
              onClick={clearProgress}
              className="px-4 py-2 rounded-full bg-white border border-red-200 text-red-600 text-sm"
            >
              Resetar
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-amber-100 shadow-sm">
          <div className="flex justify-between text-xs text-amber-600 font-semibold mb-1">
            <span>Progresso de leitura</span>
            <span>{completion}%</span>
          </div>
          <div className="w-full h-2 bg-amber-100 rounded-full overflow-hidden">
            <div className="h-full bg-amber-500 transition-all" style={{ width: `${completion}%` }} />
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {BOOK_DATA.map((item, index) => (
              <button
                key={item.id}
                onClick={() => jumpToPage(index)}
                className={`px-3 py-1 rounded-full text-xs border transition ${
                  index === currentPage
                    ? 'bg-amber-500 text-white border-amber-500'
                    : readPages.includes(index)
                      ? 'bg-amber-50 text-amber-700 border-amber-200'
                      : 'bg-white text-amber-500 border-amber-100'
                }`}
              >
                Página {item.pageNumber}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="relative w-full max-w-5xl aspect-[4/3] md:aspect-[16/9] bg-white rounded-xl shadow-2xl overflow-hidden border-8 border-amber-100 flex flex-col md:flex-row">
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

        <div className="w-full md:w-1/2 h-1/2 md:h-full p-6 md:p-10 flex flex-col justify-between bg-white bg-[url('https://www.transparenttextures.com/patterns/parchment.png')]">
          <div>
            <div className="flex justify-between items-center mb-4">
              <div className="flex flex-col">
                <span className="text-amber-500 font-bold text-sm tracking-widest uppercase">Página {page.pageNumber}</span>
                <span className="text-xs text-amber-400 italic font-medium">{page.bibleReference}</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={toggleBookmark}
                  className={`p-3 rounded-full ${bookmarks.includes(currentPage) ? 'bg-amber-500 text-white' : 'bg-amber-100 text-amber-700 hover:bg-amber-200'} transition-all`}
                  title="Favoritar página"
                >
                  ★
                </button>
                <button
                  onClick={handleNarrate}
                  className={`p-3 rounded-full transition-all duration-300 ${isNarrating ? 'bg-amber-500 text-white shadow-lg scale-110 ring-4 ring-amber-100' : 'bg-amber-100 text-amber-700 hover:bg-amber-200'}`}
                  title={isNarrating ? 'Parar Narração' : 'Ouvir História'}
                >
                  🔊
                </button>
              </div>
            </div>

            <h2 className="text-2xl md:text-3xl font-bold text-amber-900 mb-5 leading-tight">{page.title}</h2>

            <div className={`space-y-4 text-amber-950 leading-relaxed whitespace-pre-wrap ${textSizeClass}`}>
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

      <div className="mt-10 flex items-center space-x-8">
        <button
          onClick={prevPage}
          disabled={currentPage === 0}
          className="p-4 rounded-full bg-white shadow-md text-amber-800 disabled:opacity-20 hover:shadow-xl hover:bg-amber-50 transition-all disabled:cursor-not-allowed group"
        >
          ‹
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
          ›
        </button>
      </div>

      <footer className="mt-8 text-center text-amber-700 text-xs">
        Favoritos: {bookmarks.length} • Lidas: {readPages.length}/{BOOK_DATA.length}
      </footer>
    </div>
  );
};

export default App;
