export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: { ink: '#12302F', pine: { DEFAULT: '#1F6F63', dark: '#17564D' }, mist: '#EAF3F0', paper: '#F7FAF9', sun: '#F2B63D', coral: '#D64B2A' },
      fontFamily: { display: ['"Bricolage Grotesque"', 'sans-serif'], sans: ['Figtree', 'system-ui', 'sans-serif'] },
    },
  },
  plugins: [],
};
