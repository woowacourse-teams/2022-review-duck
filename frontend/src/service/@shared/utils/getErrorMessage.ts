function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }
}

export default getErrorMessage;
