class FigmaTokenToSassVarConverter {
  #sassContent = '';
  #sassVariableData = {};

  convert(designToken = {}) {
    this.#tokenParser(designToken);

    return this.#sassContent;
  }

  #tokenParser(data, nameStack = '') {
    const isVariable = !!data.type;

    if (isVariable) {
      this.#addSassVariable(nameStack, data.value);
    }

    const isDeep = typeof data === 'object';

    if (isDeep) {
      for (const key in data) {
        const currentNameStack = this.#getSassVariableNameStack(nameStack, key);
        this.#tokenParser(data[key], currentNameStack);
      }
    }
  }

  #getSassVariableNameStack(currentName = '', key) {
    const initialNamePrefix = `$${key.toUpperCase()}`;
    const addSuffix = `${currentName}_${key.toUpperCase()}`;

    return !currentName ? initialNamePrefix : addSuffix;
  }

  #replaceAliasToVariable(value) {
    const isAliasUsed = value[0] === '{';

    if (!isAliasUsed) {
      return value;
    }

    const replacePeriodToUnderBar = value.replace(/\./g, '_');
    const replaceAliasToSassVar = replacePeriodToUnderBar.split('{')[1].split('}')[0].toUpperCase();
    const addGlobalTypePrefix = `$GLOBAL_${replaceAliasToSassVar}`;

    return this.#sassVariableData[addGlobalTypePrefix];
  }

  #addSassVariable(key, value) {
    this.#sassContent += `${key}: ${this.#replaceAliasToVariable(value)};\n`;
    this.#sassVariableData[key] = value;
  }
}

module.exports = FigmaTokenToSassVarConverter;
