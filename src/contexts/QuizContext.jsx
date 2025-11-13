import { createContext, useContext, useReducer } from "react";

const QuizContext = createContext();

const initialState = {
  sections: [],
  currentSection: null,
  questions: [],
  status: "menu", // menu, sections, addForm, loading, ready, active, finished, error
  index: 0,
  answer: null,
  points: 0,
  highScore: 0,
  remainingTime: null,
};

function quizReducer(state, action) {
  const question = state.questions[state.index];
  
  switch (action.type) {
    case "loading":
      return { ...state, status: "loading" };
    case "showSections":
      return { ...state, status: "sections" };
    case "showAddForm":
      return { ...state, status: "addForm" };
    case "backToMenu":
      return { ...state, status: "menu" };
    case "sectionsReceived":
      return { ...state, sections: action.payload, status: "sections" };
    case "questionsReceived":
      return { ...state, questions: action.payload, status: "ready" };
    case "sectionSelected":
      return { ...state, currentSection: action.payload, status: "loading" };
    case "error":
      return { ...state, status: "error" };
    case "start":
      return {
        ...state,
        status: "active",
        remainingTime: state.questions.length * 30,
      };
    case "newAnswer":
      return {
        ...state,
        answer: action.payload,
        points:
          action.payload === question.correctOption
            ? state.points + question.points
            : state.points,
      };
    case "nextQuestion":
      return { ...state, index: state.index + 1, answer: null };
    case "finish":
      return {
        ...state,
        status: "finished",
        highScore:
          state.points > state.highScore ? state.points : state.highScore,
      };
    case "restart":
      return {
        ...initialState,
        sections: state.sections,
        highScore: state.highScore,
        status: "menu",
      };
    case "tick":
      return {
        ...state,
        remainingTime: state.remainingTime - 1,
        status: state.remainingTime === 0 ? "finished" : state.status,
      };
    default:
      throw new Error(`Unknown action: ${action.type}`);
  }
}

function QuizProvider({ children }) {
  const [state, dispatch] = useReducer(quizReducer, initialState);

  return (
    <QuizContext.Provider value={{ ...state, dispatch }}>
      {children}
    </QuizContext.Provider>
  );
}

function useQuiz() {
  const context = useContext(QuizContext);
  if (!context) {
    throw new Error("useQuiz must be used within QuizProvider");
  }
  return context;
}

export { QuizProvider, useQuiz };