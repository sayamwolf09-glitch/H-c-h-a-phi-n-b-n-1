"use client";

import { useMemo, useState } from "react";

export type UiQuestion = {
  id: string;
  type: "MULTIPLE_CHOICE" | "MATCHING" | "FILL_IN_BLANK" | "TABLE_FILL" | "SHORT_ANSWER" | "VIDEO_BASED";
  title: string;
  content: string;
  options?: Array<{ id: string; content: string }>;
};

type Props = {
  question: UiQuestion;
  onAnswerChange: (payload: { answerText?: string; selectedOptionId?: string }) => void;
};

export function QuestionRenderer({ question, onAnswerChange }: Props) {
  const [shortAnswer, setShortAnswer] = useState("");
  const [selectedOption, setSelectedOption] = useState<string>("");

  const body = useMemo(() => {
    if (question.type === "MULTIPLE_CHOICE") {
      return (
        <div className="space-y-2">
          {question.options?.map((option) => (
            <label key={option.id} className="flex cursor-pointer items-center gap-2 rounded-xl border p-3">
              <input
                type="radio"
                name={`q-${question.id}`}
                checked={selectedOption === option.id}
                onChange={() => {
                  setSelectedOption(option.id);
                  onAnswerChange({ selectedOptionId: option.id });
                }}
              />
              <span>{option.content}</span>
            </label>
          ))}
        </div>
      );
    }

    return (
      <textarea
        value={shortAnswer}
        onChange={(e) => {
          const next = e.target.value;
          setShortAnswer(next);
          onAnswerChange({ answerText: next });
        }}
        className="min-h-28 w-full rounded-xl border border-chem-border p-3"
        placeholder="Nhập câu trả lời của em..."
      />
    );
  }, [onAnswerChange, question.id, question.options, question.type, selectedOption, shortAnswer]);

  return (
    <div className="space-y-4 rounded-2xl border border-chem-border bg-white p-5 shadow-card">
      <h3 className="text-lg font-bold text-chem-text">{question.title}</h3>
      <p className="text-sm text-chem-muted">{question.content}</p>
      {body}
    </div>
  );
}
