export const developerMemes = {
  ko: [
    "// TODO: 버그 고치기 전에 자세부터 고치기",
    "git commit -m 'fix: 몸 정렬 문제 해결'",
    "console.log('건강 상태:', '스트레칭 필요');",
    "Error 500: 내부 신체 오류 - 스트레칭이 필요합니다",
    "내 컴퓨터에선 되는데... 내 허리는 안 되네",
    "코드에 99개의 버그가 있네... 휴식하고 스트레칭하세요!",
    "/* 몸도 리팩토링이 필요해요 */",
    "npm install --save 건강-관리",
    "SELECT * FROM health WHERE stretch = true;",
    "while(coding) { stretch(); }",
    "컴파일 중... 당신의 몸도 최적화가 필요합니다!",
    "// FIXME: 너무 오래 앉아있음 감지됨",
    "import { Stretch } from 'healthy-habits';",
    "sudo stretch --now --force",
  ],
  en: [
    "// TODO: Fix posture before fixing bugs",
    "git commit -m 'fix: body alignment issues'",
    "console.log('Health status:', 'stretching required');",
    "Error 500: Internal Body Error - Please stretch",
    "It works on my machine... but my back doesn't",
    "99 little bugs in the code... Take a break and stretch!",
    "/* Refactoring your body is important too */",
    "npm install --save body-health",
    "SELECT * FROM health WHERE stretch = true;",
    "while(coding) { stretch(); }",
    "Compiling... Your body needs optimization too!",
    "// FIXME: Sitting too long detected",
    "import { Stretch } from 'healthy-habits';",
    "sudo stretch --now --force",
  ]
};

export const getRandomMeme = (lang: string) => {
  const memes = developerMemes[lang as keyof typeof developerMemes] || developerMemes.en;
  return memes[Math.floor(Math.random() * memes.length)];
};
