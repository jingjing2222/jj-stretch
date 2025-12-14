export interface Locale {
  seconds: string;
  skip: string;
  stretchingTime: string;
  takeMomentToStretch: string;
  errorTitle: string;
  errorEmbedRestricted: string;
  errorSolutionTitle: string;
  errorSolutionChangeVideo: string;
  errorSolutionSetting: string;
  errorSolutionUseEmbeddable: string;
}

export const locales: Record<string, Locale> = {
  ko: {
    seconds: "초",
    skip: "건너뛰기",
    stretchingTime: "스트레칭 타임!",
    takeMomentToStretch: "건강한 코딩을 위해 잠시 스트레칭하세요!",
    errorTitle: "영상 재생 오류",
    errorEmbedRestricted: "이 영상은 임베딩이 제한되어 있습니다.",
    errorSolutionTitle: "해결 방법:",
    errorSolutionChangeVideo: "VSCode 설정에서 다른 스트레칭 영상 URL로 변경해주세요",
    errorSolutionSetting: "설정 수정",
    errorSolutionUseEmbeddable: "임베딩이 허용된 유튜브 영상을 선택해주세요"
  },
  en: {
    seconds: " seconds",
    skip: "Skip",
    stretchingTime: "Stretching Time!",
    takeMomentToStretch: "Take a moment to stretch for healthy coding!",
    errorTitle: "Video Playback Error",
    errorEmbedRestricted: "This video has embedding restrictions.",
    errorSolutionTitle: "Solution:",
    errorSolutionChangeVideo: "Change the stretch video URL in VSCode settings",
    errorSolutionSetting: "jj-stretch.stretchVideoUrl",
    errorSolutionUseEmbeddable: "Please select a YouTube video that allows embedding"
  }
};

export const matrixChars: Record<string, string> = {
  ko: 'ㄱㄴㄷㄹㅁㅂㅅㅇㅈㅊㅋㅌㅍㅎㅏㅑㅓㅕㅗㅛㅜㅠㅡㅣ01',
  en: '01ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*()'
};
