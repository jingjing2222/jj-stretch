import * as vscode from "vscode";
import { LocaleDictionary } from "./types";

type LocalesConfig = Record<string, LocaleDictionary>;

interface ResolvedLocale {
  language: string;
  locale: LocaleDictionary;
}

const FALLBACK_LANGUAGE = "en";

function getLocalesConfig(): LocalesConfig {
  return {
    ko: {
      seconds: "초",
      skip: "건너뛰기",
      stretchingTime: "스트레칭 타임!",
      takeMomentToStretch: "건강한 코딩을 위해 잠시 스트레칭하세요!",
    },
    en: {
      seconds: " seconds",
      skip: "Skip",
      stretchingTime: "Stretching Time!",
      takeMomentToStretch: "Take a moment to stretch for healthy coding!",
    },
  };
}

export function resolveLocale(): ResolvedLocale {
  const localesConfig = getLocalesConfig();
  const language = vscode.env.language;

  if (language in localesConfig) {
    return { language, locale: localesConfig[language] };
  }
  return {
    language: FALLBACK_LANGUAGE,
    locale: localesConfig[FALLBACK_LANGUAGE],
  };
}
