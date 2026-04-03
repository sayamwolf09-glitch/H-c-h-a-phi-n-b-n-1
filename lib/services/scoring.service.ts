import { QuestionType, type AttemptAnswer, type QuestionBank, type QuestionOption } from "@prisma/client";

type AnswerInput = Pick<AttemptAnswer, "answerText" | "selectedOptionId">;

type ScoringResult = {
  isCorrect: boolean;
  scoreAwarded: number;
};

function normalizeText(value?: string | null): string {
  return (value ?? "")
    .normalize("NFKC")
    .trim()
    .replace(/\s+/g, " ")
    .toLowerCase();
}

export function scoreOneAnswer(params: {
  question: QuestionBank & { options?: QuestionOption[] };
  answer: AnswerInput;
  point: number;
}): ScoringResult {
  const { question, answer, point } = params;

  if (question.questionType === QuestionType.MULTIPLE_CHOICE) {
    const correctOption = question.options?.find((option) => option.isCorrect);
    const isCorrect = Boolean(correctOption && correctOption.id === answer.selectedOptionId);
    return { isCorrect, scoreAwarded: isCorrect ? point : 0 };
  }

  if (
    question.questionType === QuestionType.SHORT_ANSWER ||
    question.questionType === QuestionType.FILL_IN_BLANK ||
    question.questionType === QuestionType.VIDEO_BASED
  ) {
    const expected = normalizeText(question.correctAnswerText);
    const actual = normalizeText(answer.answerText);
    const isCorrect = expected.length > 0 && expected === actual;
    return { isCorrect, scoreAwarded: isCorrect ? point : 0 };
  }

  return { isCorrect: false, scoreAwarded: 0 };
}
