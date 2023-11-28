export interface RenderContextProps {
  loader: boolean;
  firstTime: boolean;
  language: 'ES' | 'EN';
  setLoader: (e: boolean) => void;
  setFirstTime: (e: boolean) => void;
  setLanguage: (e: 'ES' | 'EN') => void;
}
