const FigmaTokenToSassVariable = require('./FigmaTokenToSassVarConverter');
const CssThemeVarConverter = require('./CssThemeVarConverter');

const fileManager = require('./fileManager');

const sassConverter = new FigmaTokenToSassVariable();
const themeConverter = new CssThemeVarConverter();

const inputPath = process.env.JSON_PATH;
const varOutputPath = process.env.OUTPUT_PATH;
const themeOutputPath = process.env.THEME_OUTPUT_PATH;

const designTokenData = fileManager.getJson(inputPath);

if (!designTokenData) {
  console.error('디자인 토큰 JSON 파싱에 실패하였습니다.');
  return;
}

const sassVariable = sassConverter.convert(designTokenData);
const { cssThemeVariable, sassThemeVariable } = themeConverter.convert(designTokenData);

fileManager.write(varOutputPath, sassVariable + sassThemeVariable);
fileManager.write(themeOutputPath, cssThemeVariable);

console.info(`✅  Sass Variable 변환에 성공하였습니다. \n🚀 Variable Scss: ${varOutputPath}\n🚀 Theme Scss: ${themeOutputPath})`);
