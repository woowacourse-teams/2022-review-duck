export interface ResponseAnswer {
  id: number | null;
  value: string;
}

class Answer {
  id: number | null;
  value: string;

  constructor(responseData?: ResponseAnswer) {
    if (!responseData) {
      this.id = null;
      this.value = '';

      return;
    }

    this.id = responseData.id;
    this.value = responseData.value;
  }
}

export default Answer;
