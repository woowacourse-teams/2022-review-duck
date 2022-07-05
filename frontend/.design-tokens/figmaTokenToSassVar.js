class FigmaTokenToSassVariable {
  #sassContent = "";
  #sassVariableData = {};

  #getSassVariableName(currentName = "", key) {
    if (!currentName) {
      return `$${key.toUpperCase()}`;
    }

    return `${currentName}_${key.toUpperCase()}`;
  }

  #replaceAliasToVariable(value) {
    if (value[0] !== "{") {
      return value;
    }

    const updatedPeriodToUnderBar = value.replace(/\./g, "_");
    const updatedAliasToSassVar = updatedPeriodToUnderBar.split("{")[1].split("}")[0].toUpperCase();
    const updatedAddGlobalTypePrefix = `$GLOBAL_${updatedAliasToSassVar}`;

    return this.#sassVariableData[updatedAddGlobalTypePrefix];
  }

  #addSassVariable(key, value) {
    this.#sassContent += `${key}: ${this.#replaceAliasToVariable(value)};\n`;
    this.#sassVariableData[key] = value;
  }

  #tokenParser(data, nameStack = "") {
    if (data.type) {
      this.#addSassVariable(nameStack, data.value);
    }

    if (typeof data === "object") {
      for (const key in data) {
        const sassVariableName = this.#getSassVariableName(nameStack, key);
        this.#tokenParser(data[key], sassVariableName);
      }
    }
  }

  convert(designToken = {}) {
    this.#tokenParser(designToken);

    return this.#sassContent;
  }
}

module.exports = FigmaTokenToSassVariable;
