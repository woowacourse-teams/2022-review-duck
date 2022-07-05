const FigmaTokenToSassVariable = require('./figmaTokenToSassVar');
const fileManager = require('./fileManager');

const converter = new FigmaTokenToSassVariable();

const INPUT_PATH = '/frontend/.design-tokens/designTokens.json';
const OUTPUT_PATH = '/frontend/src/styles/designTokens.scss';

const designTokenData = fileManager.getJson(INPUT_PATH);

if (!designTokenData) {
  console.error('디자인 토큰 JSON 파싱에 실패하였습니다.');
  return;
}

const sassVariables = converter.convert(designTokenData);

fileManager.write(OUTPUT_PATH, sassVariables);

console.info(`✅  Sass Variable 변환에 성공하였습니다. (🚀 Output: ${OUTPUT_PATH})`);
