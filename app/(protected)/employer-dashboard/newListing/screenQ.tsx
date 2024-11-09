import { Input } from "@nextui-org/react";
import React, { useState, useCallback } from "react";
import { FaPlus } from "react-icons/fa";
import { MdCancel } from "react-icons/md";

interface Question {
  name: string;
  question: string;
  input: string;
  options?: string[];
}

interface QuestionSelectorProps {
  screenQ: Question[];
  setScreeningQuestions: React.Dispatch<
    React.SetStateAction<Record<string, string>>
  >;
}

const QuestionSelector: React.FC<QuestionSelectorProps> = ({
  screenQ,
  setScreeningQuestions,
}) => {
  const [selectedQuestions, setSelectedQuestions] = useState<Question[]>([]);
  const [pendingQuestion, setPendingQuestion] = useState<Question | null>(null);
  const [responses, setResponses] = useState<Record<string, string | string[]>>(
    {}
  );
  const [error, setError] = useState("");

  const handleAddQuestion = useCallback(
    (question: Question) => {
      if (selectedQuestions.length >= 3) {
        setError("You can only select up to 3 questions.");
        return;
      }
      setPendingQuestion(question);
      setError("");
    },
    [selectedQuestions]
  );

  const handleSaveResponse = useCallback(() => {
    if (pendingQuestion) {
      const questionTitle = pendingQuestion.question;
      const answerValue = Array.isArray(responses[pendingQuestion.name])
        ? (responses[pendingQuestion.name] as string[]).join(", ")
        : responses[pendingQuestion.name] || "";

      const formattedResponse = `!questionStart!${questionTitle}~!questionAns!~${answerValue}!questionEnd!`;

      setSelectedQuestions((prev) => [...prev, pendingQuestion]);
      setScreeningQuestions((prev) => ({
        ...prev,
        [pendingQuestion.name]: formattedResponse,
      }));
      setPendingQuestion(null);
    }
  }, [pendingQuestion, responses, setScreeningQuestions]);

  const handleCancelQuestion = useCallback(() => {
    setPendingQuestion(null);
  }, []);

  const handleRemoveQuestion = useCallback(
    (questionName: string) => {
      setSelectedQuestions((prev) =>
        prev.filter((q) => q.name !== questionName)
      );
      setScreeningQuestions((prev) => {
        const updated = { ...prev };
        delete updated[questionName];
        return updated;
      });
      setResponses((prev) => {
        const updated = { ...prev };
        delete updated[questionName];
        return updated;
      });
      setError("");
    },
    [setScreeningQuestions]
  );

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    questionName: string
  ) => {
    const { value } = event.target;
    setResponses((prev) => ({
      ...prev,
      [questionName]: value,
    }));
  };

  const handleCheckboxChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    questionName: string
  ) => {
    const { value } = event.target;
    setResponses((prev) => {
      const existingValues = (prev[questionName] as string[]) || [];
      return {
        ...prev,
        [questionName]: existingValues.includes(value)
          ? existingValues.filter((v) => v !== value)
          : [...existingValues, value],
      };
    });
  };

  const PendingQuestion: React.FC = () => (
    <div className="border rounded bg-slate-200 p-4 mt-4">
      <div className="flex justify-between items-center">
        <p>{pendingQuestion?.question}</p>
        <button
          type="button"
          className="text-red-500"
          onClick={handleCancelQuestion}
          aria-label="Cancel Question"
        >
          <MdCancel />
        </button>
      </div>
      {pendingQuestion?.input === "checkbox" ? (
        pendingQuestion?.options?.map((option, idx) => (
          <label key={idx} className="flex items-center gap-2 mt-2">
            <input
              type="checkbox"
              value={option}
              checked={(responses[pendingQuestion.name] as string[])?.includes(
                option
              )}
              onChange={(e) =>
                pendingQuestion && handleCheckboxChange(e, pendingQuestion.name)
              }
            />
            {option}
          </label>
        ))
      ) : (
        <Input
          type={pendingQuestion?.input}
          className="rounded-md border-2 p-1 mt-2 w-full"
          placeholder="Enter answer"
          value={
            pendingQuestion && Array.isArray(responses[pendingQuestion.name])
              ? (responses[pendingQuestion.name] as string[]).join(", ")
              : pendingQuestion
              ? (responses[pendingQuestion.name] as string) || ""
              : ""
          }
          onChange={(e) =>
            pendingQuestion && handleInputChange(e, pendingQuestion.name)
          }
        />
      )}
      <div className="flex gap-2 mt-4">
        <button
          type="button"
          onClick={handleSaveResponse}
          className="px-4 py-2 bg-green-500 text-white rounded"
        >
          Save
        </button>
        <button
          type="button"
          onClick={handleCancelQuestion}
          className="px-4 py-2 bg-red-500 text-white rounded"
        >
          Cancel
        </button>
      </div>
    </div>
  );

  const SelectedQuestion: React.FC<{ question: Question }> = ({ question }) => (
    <div className="border rounded bg-slate-200 p-4 mt-2">
      <div className="flex justify-between items-center">
        <p>{question.question}</p>
        <button
          type="button"
          className="text-red-500"
          onClick={() => handleRemoveQuestion(question.name)}
          aria-label={`Remove ${question.name}`}
        >
          <MdCancel />
        </button>
      </div>
      {question.input === "checkbox" ? (
        question.options?.map((option, idx) => (
          <label key={idx} className="flex items-center gap-2 mt-2">
            <Input
              type="checkbox"
              value={option}
              disabled
              checked={(responses[question.name] as string[])?.includes(option)}
            />
            {option}
          </label>
        ))
      ) : (
        <input
          type={question.input}
          className="rounded-md border-2 p-1 mt-2 w-full"
          value={responses[question.name] || ""}
          placeholder="Saved answer"
          disabled
        />
      )}
    </div>
  );

  return (
    <div>
      <div className="flex gap-2">
        {screenQ.map((question, index) => (
          <button
            key={index}
            type="button"
            className="flex gap-2 text-center border rounded-lg items-center p-4 hover:bg-slate-200"
            onClick={() => handleAddQuestion(question)}
            disabled={
              selectedQuestions.some((q) => q.name === question.name) ||
              selectedQuestions.length >= 3
            }
          >
            <FaPlus />
            <h1>{question.name}</h1>
          </button>
        ))}
      </div>
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

      {/* Display Pending Question for Confirmation */}
      {pendingQuestion && <PendingQuestion />}

      {/* Display Selected Questions */}
      <div className="mt-4">
        {selectedQuestions.map((question, index) => (
          <SelectedQuestion key={index} question={question} />
        ))}
      </div>
    </div>
  );
};

export default QuestionSelector;
