import React from "react";

const StartScreen = ({ numberOfQuestions, dispatch }) => {
  return (
    <div className="start">
      <h3>Welcome to React Quize</h3>
      <h3>{numberOfQuestions} question to test your React Mastery</h3>
      <button
        className="btn btn-ui"
        onClick={() => dispatch({ type: "start" })}
      >
        Let's Start
      </button>
    </div>
  );
};

export default StartScreen;
