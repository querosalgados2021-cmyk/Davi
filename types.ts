
export interface BookPage {
  id: number;
  title: string;
  content: string;
  lesson: string;
  bibleReference: string;
  illustrationPrompt: string;
  pageNumber: string;
}

export interface AppState {
  currentPageIndex: number;
  illustrations: Record<number, string>;
  isGeneratingImage: boolean;
  isGeneratingAudio: boolean;
  error: string | null;
}
