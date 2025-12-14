import type { Locale } from '../i18n/locales';

interface ErrorMessageProps {
  errorCode: number | null;
  locale: Locale;
}

export function ErrorMessage({ errorCode, locale }: ErrorMessageProps) {
  if (!errorCode) return null;

  return (
    <div className="text-[#ff5555] bg-[rgba(255,85,85,0.1)] border-2 border-[#ff5555] rounded-[10px] p-5 mt-5 max-w-[600px] text-left text-[0.95rem] leading-relaxed">
      <div className="text-[1.2rem] font-bold mb-2.5 text-[#ff5555]">
        ⚠️ {locale.errorTitle}
      </div>
      <div>
        <p>
          <span className="text-[#ffaa00] font-mono">
            Error Code: {errorCode}
          </span>
        </p>
        <p>{locale.errorEmbedRestricted}</p>
        <p className="mt-2.5">{locale.errorSolutionTitle}</p>
        <ul className="ml-5 mt-1.5 list-disc">
          <li>{locale.errorSolutionChangeVideo}</li>
          <li>
            <code className="text-[#00d9ff]">{locale.errorSolutionSetting}</code>
          </li>
          <li>{locale.errorSolutionUseEmbeddable}</li>
        </ul>
      </div>
    </div>
  );
}
