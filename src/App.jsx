import { QuizProvider, useQuiz } from "./contexts/QuizContext";
import Header from "./Header";
import Main1 from "./Main1";
import SectionList from "./components/quiz/SectionList";
import AddSectionForm from "./components/quiz/AddSectionForm";
import StartScreen from "./StartScreen";
import Question from "./Question";
import NextQuestion from "./NextQuestion";
import Progress from "./Progress";
import FinishScreen from "./FinishScreen";
import Footer from "./Footer";
import Timer from "./Timer";
import Loader from "./components/ui/Loader";
import Error from "./components/ui/Error";
import Button from "./components/ui/Button";

function MainMenu({ onOptionSelect }) {
  return (
    <div className="main-menu">
      <h2>Welcome to QuizMaster</h2>
      <p>Choose an option to get started</p>
      <div className="menu-options">
        <div className="menu-card">
          <h3>📚 Take Quiz</h3>
          <p>Browse quiz sections and test your knowledge</p>
          <Button onClick={() => onOptionSelect("sections")}>
            Browse Quizzes
          </Button>
        </div>
        <div className="menu-card">
          <h3>➕ Add Content</h3>
          <p>Create new quiz sections and questions</p>
          <Button onClick={() => onOptionSelect("add")}>Add Questions</Button>
        </div>
      </div>
    </div>
  );
}

function QuizApp() {
  const {
    questions,
    status,
    index,
    answer,
    points,
    highScore,
    remainingTime,
    dispatch,
  } = useQuiz();

  const numberOfQuestions = questions.length;
  const maxPoints =
    questions.length > 0
      ? questions.reduce((prev, curr) => prev + curr.points, 0)
      : 0;

  const handleOptionSelect = (option) => {
    if (option === "sections") {
      dispatch({ type: "showSections" });
    } else if (option === "add") {
      dispatch({ type: "showAddForm" });
    }
  };

  const handleBackToMenu = () => {
    dispatch({ type: "backToMenu" });
  };

  return (
    <div className="app">
      <Header />
      <Main1>
        {status === "loading" && <Loader />}
        {status === "error" && <Error />}
        {status === "menu" && <MainMenu onOptionSelect={handleOptionSelect} />}
        {status === "sections" && (
          <>
            <Button onClick={handleBackToMenu} className="back-btn">
              ← Back to Menu
            </Button>
            <SectionList />
          </>
        )}
        {status === "addForm" && (
          <>
            <Button onClick={handleBackToMenu} className="back-btn">
              ← Back to Menu
            </Button>
            <AddSectionForm onSectionAdded={handleBackToMenu} />
          </>
        )}
        {status === "ready" && (
          <StartScreen
            numberOfQuestions={numberOfQuestions}
            dispatch={dispatch}
          />
        )}
        {status === "active" && (
          <>
            <Progress
              index={index}
              numberOfQuestions={numberOfQuestions}
              points={points}
              maxPoints={maxPoints}
              answer={answer}
            />
            <Question
              questions={questions[index]}
              answer={answer}
              dispatch={dispatch}
            />
            <Footer>
              <NextQuestion
                dispatch={dispatch}
                answer={answer}
                index={index}
                numberOfQuestions={numberOfQuestions}
              />
              <Timer dispatch={dispatch} remainingTime={remainingTime} />
            </Footer>
          </>
        )}
        {status === "finished" && (
          <FinishScreen
            points={points}
            maxPoints={maxPoints}
            highScore={highScore}
            dispatch={dispatch}
          />
        )}
      </Main1>
    </div>
  );
}

function App() {
  return (
    <QuizProvider>
      <QuizApp />
    </QuizProvider>
  );
}

export default App;
