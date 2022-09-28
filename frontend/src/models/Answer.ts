export interface ResponseAnswer {
  id: number | null;
  value: string;
}

class Answer {
  id: number | null = null;
  value = '';

  constructor(responseData?: ResponseAnswer) {
    if (!responseData) {
      return;
    }

    this.id = responseData.id;
    this.value = responseData.value;
  }
}

export default Answer;
