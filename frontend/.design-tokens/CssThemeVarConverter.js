const CONFIG_THEME_EXCEPTION_PREFIX = ['global', '$themes'];

class CssThemeVarConverter {
  #sassContent = '';
  #cssThemeContent = {};

  convert(designToken = {}) {
    const themeTokens = Object.entries(designToken).reduce((prev, [key, value]) => {
      const isExceptionKey = CONFIG_THEME_EXCEPTION_PREFIX.includes(key);

      if (isExceptionKey === true) {
        return prev;
      }

      const current = { ...prev };

      current[key] = value;
      return current;
    }, new Object());

    this.#tokenParser(themeTokens);
    return this.#getConvertResult();
  }

  #tokenParser(data, nameStack = []) {
    const isVariable = !!data.type;

    if (isVariable) {
      this.#addVariable(nameStack);
    }

    const isDeep = typeof data === 'object';

    if (isDeep) {
      for (const key in data) {
        const currentNameStack = this.#getVariableNameStack(nameStack, key);
        this.#tokenParser(data[key], currentNameStack);
      }
    }
  }

  #getVariableNameStack(currentNameStack = [], key) {
    const name = key.toUpperCase();

    if (currentNameStack.length === 0) {
      const initialNamePrefix = name;
      return [initialNamePrefix];
    }

    const updateNameStack = [...currentNameStack];
    updateNameStack.push(name);

    return updateNameStack;
  }

  #addVariable(nameStack = []) {
    const themeType = nameStack[0].toLowerCase();
    const targetTheme = [...(this.#cssThemeContent[themeType] || [])];

    const themeKey = [...nameStack].splice(1).join('-');
    const variableKey = `$${nameStack.join('_')}`;
    const themeVariableKey = `$THEME_${[...nameStack].splice(1).join('_')}`;

    targetTheme.push(`\t--THEME-${themeKey}: ${variableKey};`);

    this.#cssThemeContent[themeType] = targetTheme;
    this.#sassContent += `${themeVariableKey}: var(--THEME-${themeKey});\n`;
  }

  #getConvertResult() {
    const cssThemeVariable = Object.entries(this.#cssThemeContent)
      .map(
        ([themeKey, variable]) => `:root[data-theme="${themeKey}"] {\n${variable.join('\n')}\n}\n`,
      )
      .join('');

    return { cssThemeVariable, sassThemeVariable: this.#sassContent };
  }
}

module.exports = CssThemeVarConverter;
