const FigmaTokenToSassVariable = require('./figmaTokenToSassVar');
const fileManager = require('./fileManager');

const converter = new FigmaTokenToSassVariable();

const inputPath = process.env.JSON_PATH;
const outputPath = process.env.OUTPUT_PATH;

const designTokenData = fileManager.getJson(inputPath);

if (!designTokenData) {
  console.error('디자인 토큰 JSON 파싱에 실패하였습니다.');
  return;
}

const sassVariables = converter.convert(designTokenData);

fileManager.write(outputPath, sassVariables);

console.info(`✅  Sass Variable 변환에 성공하였습니다. (🚀 Output: ${outputPath})`);
