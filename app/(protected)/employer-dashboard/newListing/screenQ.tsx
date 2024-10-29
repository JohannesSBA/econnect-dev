import React, { useState } from "react";
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
    return (
        <div className="flex gap-2">
            {screenQ.map((question, index) => (
                <div key={index} className="mt-4">
                    <button
                        type="button"
                        className="text-sm font-semibold leading-6 text-gray-900"
                        onClick={() => {
                            const questionElement = document.getElementById(
                                `question-${index}`
                            );
                            const selectedQuestions = document.querySelectorAll(
                                '[id^="question-"]:not(:empty)'
                            ).length;

                            if (questionElement) {
                                if (questionElement.innerHTML === "") {
                                    if (selectedQuestions < 3) {
                                        questionElement.innerHTML = `
                                            <div class="border rounded bg-slate-200 p-4 mt-2">
                                                <div class="flex justify-between items-center">
                                                    <p>${question.question}</p>
                                                    <button type="button" class="text-red-500" onclick="document.getElementById('question-${index}').innerHTML = '';"><MdCancel /></button>
                                                </div>
                                                ${
                                                    question.input ===
                                                    "checkbox"
                                                        ? question.options
                                                              ?.map(
                                                                  (option) => `
                                                    <label>
                                                        <input type="text" value="${option}" class="rounded-md border"/>
                                                        ${option}
                                                    </label>
                                                `
                                                              )
                                                              .join("")
                                                        : `<input type="${question.input}" class="rounded-md border-2 p-1 mt-2" placeholder="Ideal Number" />`
                                                }
                                            </div>
                                        `;
                                        setScreeningQuestions((prev) => ({
                                            ...prev,
                                            [question.name]: `${
                                                question.question
                                            }!sq_as;!;${
                                                question.input === "checkbox"
                                                    ? question.options?.join(
                                                          ", "
                                                      )
                                                    : ""
                                            }`,
                                        }));
                                    } else {
                                        const errorMessage =
                                            document.getElementById(
                                                "error-message"
                                            );
                                        if (errorMessage) {
                                            errorMessage.innerText =
                                                "You can only select up to 3 questions.";
                                        }
                                    }
                                } else {
                                    questionElement.innerHTML = "";
                                    setScreeningQuestions((prev) => {
                                        const updated = { ...prev };
                                        delete (updated as any)[question.name];
                                        return updated;
                                    });
                                    const errorMessage =
                                        document.getElementById(
                                            "error-message"
                                        );
                                    if (errorMessage) {
                                        errorMessage.innerText = "";
                                    }
                                }
                            }

                            const allButtons = document.querySelectorAll(
                                'button[type="button"]'
                            );
                            allButtons.forEach((button) => {
                                if (
                                    selectedQuestions >= 3 &&
                                    button.innerHTML.includes("FaPlus")
                                ) {
                                    (button as HTMLButtonElement).disabled =
                                        true;
                                } else {
                                    (button as HTMLButtonElement).disabled =
                                        false;
                                }
                            });
                        }}
                    >
                        <div className="flex gap-2 text-center border rounded-lg items-center p-4 hover:bg-slate-200">
                            <FaPlus />
                            <h1>{question.name}</h1>
                        </div>
                    </button>
                    <p
                        id="error-message"
                        className="text-red-500 text-sm mt-2"
                    ></p>
                    <div id={`question-${index}`} className="mt-2"></div>
                </div>
            ))}
        </div>
    );
};

export default QuestionSelector;
