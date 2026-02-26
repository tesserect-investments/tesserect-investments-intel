export const SITE_VARIANT: string = (() => {
  const env = import.meta.env.VITE_VARIANT || 'finance';
  if (env !== 'finance') return env;
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('worldmonitor-variant');
    if (stored === 'finance' || stored === 'tesserect') return stored;
  }
  return env;
})();
