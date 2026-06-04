import { useTranslation } from 'react-i18next';
import { Segmented } from 'antd';

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
    <Segmented
      style={{padding: 4}}
      size="small"
      value={current}
      onChange={(value) => handleChange(String(value))}
      options={LANGUAGES.map((lang) => ({
        label: lang.label,
        value: lang.code,
      }))}
    />
  );
}
