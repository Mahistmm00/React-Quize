import React from "react";
import Options from "./Options";
const Question = ({ questions, dispatch, answer }) => {
  return (
    <div>
      <h3>{questions.question}</h3>
      <Options questions={questions} dispatch={dispatch} answer={answer} />
    </div>
  );
};

export default Question;
