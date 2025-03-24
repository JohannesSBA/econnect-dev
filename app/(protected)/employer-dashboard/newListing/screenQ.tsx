import { Input, Checkbox, Button, Card, Tooltip } from "@nextui-org/react";
import React, { useState, useCallback, useMemo } from "react";
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
    React.SetStateAction<Record<string, any>>
  >;
}

// Fix the PendingQuestionCard component type definitions
interface PendingQuestionCardProps {
  question: Question;
  response: { value: string | string[] };
  onSave: () => void;
  onCancel: () => void;
  onResponseChange: (value: string | string[]) => void;
}

// Move nested components outside for better readability
const PendingQuestionCard: React.FC<PendingQuestionCardProps> = ({ 
  question,
  response,
  onSave,
  onCancel,
  onResponseChange 
}) => (
  <Card className="p-4 mt-4 bg-slate-200">
    <div className="flex justify-between items-center">
      <p className="font-medium">{question.question}</p>
      <Button
        isIconOnly
        color="danger"
        variant="light"
        onClick={onCancel}
        aria-label="Cancel Question"
      >
        <MdCancel />
      </Button>
    </div>
    
    {question.input === "checkbox" ? (
      <div className="mt-2 space-y-2">
        {question.options?.map((option, idx) => (
          <Checkbox
            key={idx}
            value={option}
            isSelected={response.value?.includes(option)}
            onChange={() => onResponseChange(option)}
          >
            {option}
          </Checkbox>
        ))}
      </div>
    ) : (
      <Input
        type={question.input}
        className="mt-2"
        placeholder="Enter answer"
        value={typeof response.value === 'string' ? response.value : ''}
        onChange={(e) => onResponseChange(e.target.value)}
      />
    )}
    <div className="flex gap-2 mt-4">
      <Button
        color="primary"
        onClick={onSave}
      >
        Save
      </Button>
      <Button
        color="danger"
        variant="flat"
        onClick={onCancel}
      >
        Cancel
      </Button>
    </div>
  </Card>
);

// Fix the SelectedQuestionCard component type definitions
interface SelectedQuestionCardProps {
  question: Question;
  response: { value: string | string[] };
  onRemove: () => void;
}

const SelectedQuestionCard: React.FC<SelectedQuestionCardProps> = ({ 
  question, 
  response, 
  onRemove 
}) => (
  <Card className="p-4 mt-2 bg-slate-200">
    <div className="flex justify-between items-center">
      <p className="font-medium">{question.question}</p>
      <Button
        isIconOnly
        color="danger"
        variant="light"
        onClick={onRemove}
        aria-label={`Remove ${question.name}`}
      >
        <MdCancel />
      </Button>
    </div>
    
    {question.input === "checkbox" ? (
      <div className="mt-2 space-y-2">
        {question.options?.map((option, idx) => (
          <Checkbox
            key={idx}
            value={option}
            isSelected={response.value?.includes(option)}
            isDisabled
          >
            {option}
          </Checkbox>
        ))}
      </div>
    ) : (
      <Input
        type={question.input}
        className="mt-2"
        value={typeof response.value === 'string' ? response.value : ''}
        placeholder="Saved answer"
        isDisabled
      />
    )}
  </Card>
);

const QuestionSelector: React.FC<QuestionSelectorProps> = ({
  screenQ,
  setScreeningQuestions,
}) => {
  // Simplified state structure - each question has its complete data
  const [selectedQuestions, setSelectedQuestions] = useState<Map<string, {
    question: Question,
    value: string | string[]
  }>>(new Map());
  
  const [pendingQuestion, setPendingQuestion] = useState<Question | null>(null);
  const [pendingResponse, setPendingResponse] = useState<string | string[]>("");
  const [error, setError] = useState("");

  // Available questions (ones not already selected)
  const availableQuestions = useMemo(() => 
    screenQ.filter(q => !selectedQuestions.has(q.name)),
    [screenQ, selectedQuestions]
  );

  const handleAddQuestion = useCallback(
    (question: Question) => {
      if (selectedQuestions.size >= 3) {
        setError("You can only select up to 3 questions.");
        return;
      }
      setPendingQuestion(question);
      // Initialize the response type based on question type
      setPendingResponse(question.input === "checkbox" ? [] : "");
      setError("");
    },
    [selectedQuestions]
  );

  const handleResponseChange = useCallback((value: string | string[]) => {
    if (!pendingQuestion) return;
    
    if (pendingQuestion.input === "checkbox") {
      // For checkboxes, toggle the selection
      setPendingResponse((prev: string | string[]) => {
        const prevArray = Array.isArray(prev) ? prev : [];
        if (prevArray.includes(value as string)) {
          return prevArray.filter(v => v !== value);
        } else {
          return [...prevArray, value as string];
        }
      });
    } else {
      // For text inputs
      setPendingResponse(value);
    }
  }, [pendingQuestion]);

  const handleSaveResponse = useCallback(() => {
    if (!pendingQuestion) return;
    
    // Update local state
    const newSelectedQuestions = new Map(selectedQuestions);
    newSelectedQuestions.set(pendingQuestion.name, {
      question: pendingQuestion,
      value: pendingResponse
    });
    setSelectedQuestions(newSelectedQuestions);
    
    // Update parent state with all questions
    const updatedQuestions = {};
    newSelectedQuestions.forEach((data, name) => {
      const formattedValue = Array.isArray(data.value) 
        ? data.value.join(", ") 
        : data.value;
        
      (updatedQuestions as Record<string, {
        question: string;
        answer: string;
        type: string;
      }>)[name] = {
        question: data.question.question,
        answer: formattedValue,
        type: data.question.input
      };
    });
    
    setScreeningQuestions(updatedQuestions);
    setPendingQuestion(null);
  }, [pendingQuestion, pendingResponse, selectedQuestions, setScreeningQuestions]);

  const handleRemoveQuestion = useCallback(
    (questionName: string) => {
      // Update local state
      const newSelectedQuestions = new Map(selectedQuestions);
      newSelectedQuestions.delete(questionName);
      setSelectedQuestions(newSelectedQuestions);
      
      // Update parent state
      const updatedQuestions = {};
      newSelectedQuestions.forEach((data, name) => {
        const formattedValue = Array.isArray(data.value) 
          ? data.value.join(", ") 
          : data.value;
          
        (updatedQuestions as Record<string, {
          question: string;
          answer: string;
          type: string;
        }>)[name] = {
          question: data.question.question,
          answer: formattedValue,
          type: data.question.input
        };
      });
      
      setScreeningQuestions(updatedQuestions);
      setError("");
    },
    [selectedQuestions, setScreeningQuestions]
  );

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {availableQuestions.map((question, index) => (
          <Tooltip 
            key={index}
            content={selectedQuestions.size >= 3 ? "Maximum 3 questions allowed" : question.question}
          >
            <Button
              className="flex gap-2 p-4"
              variant="bordered"
              startContent={<FaPlus />}
              onClick={() => handleAddQuestion(question)}
              isDisabled={selectedQuestions.size >= 3}
            >
              {question.name}
            </Button>
          </Tooltip>
        ))}
      </div>
      
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

      {/* Pending Question */}
      {pendingQuestion && (
        <PendingQuestionCard
          question={pendingQuestion}
          response={{ value: pendingResponse }}
          onSave={handleSaveResponse}
          onCancel={() => setPendingQuestion(null)}
          onResponseChange={handleResponseChange}
        />
      )}

      {/* Selected Questions */}
      <div className="mt-4 space-y-2">
        {Array.from(selectedQuestions.entries()).map(([name, data]) => (
          <SelectedQuestionCard
            key={name}
            question={data.question}
            response={{ value: data.value }}
            onRemove={() => handleRemoveQuestion(name)}
          />
        ))}
      </div>
    </div>
  );
};

export default QuestionSelector;
