import { useTranslation } from 'react-i18next';

const LANGUAGES = [
  { code: 'vi', label: 'VI' },
  { code: 'en', label: 'EN' },
] as const;

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const current = i18n.language?.startsWith('vi') ? 'vi' : 'en';

  const handleChange = (code: string) => {
    i18n.changeLanguage(code);
    localStorage.setItem('lang', code);
  };

  return (
    <div className="flex items-center gap-1 border border-gray-300 rounded-md overflow-hidden">
      {LANGUAGES.map((lang) => (
        <button
          key={lang.code}
          onClick={() => handleChange(lang.code)}
          className={`px-2 py-1 text-xs font-semibold transition-colors ${
            current === lang.code
              ? 'bg-blue-500 text-white'
              : 'bg-white text-gray-600 hover:bg-gray-100'
          }`}
        >
          {lang.label}
        </button>
      ))}
    </div>
  );
}
