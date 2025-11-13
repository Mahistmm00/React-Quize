import { useEffect, useRef } from "react";
import { useQuiz } from "../../contexts/QuizContext";
import { useApi } from "../../hooks/useApi";
import { fetchSections, fetchQuestions } from "../../utils/api";
import Button from "../ui/Button";
import Loader from "../ui/Loader";
import Error from "../ui/Error";

export default function SectionList() {
  const { sections, status, dispatch } = useQuiz();
  const { loading, error } = useApi();
  const hasLoadedRef = useRef(false);

  useEffect(() => {
    if (status === "sections" && !hasLoadedRef.current) {
      hasLoadedRef.current = true;
      const loadSections = async () => {
        try {
          const data = await fetchSections();
          const parsedData =
            typeof data.body === "string" ? JSON.parse(data.body) : data;
          dispatch({ type: "sectionsReceived", payload: parsedData.sections || [] });
        } catch (err) {
          dispatch({ type: "error" });
        }
      };

      loadSections();
    }
  }, [status]);

  const handleSectionSelect = async (section) => {
    dispatch({ type: "sectionSelected", payload: section });
    try {
      const data = await fetchQuestions(section.sectionId);
      const parsedData =
        typeof data.body === "string" ? JSON.parse(data.body) : data;
      
      // Transform questions to match expected format
      const transformedQuestions = parsedData.questions.map(q => ({
        ...q,
        correctOption: q.options.indexOf(q.answer),
        points: q.points || 10
      }));
      
      dispatch({ type: "questionsReceived", payload: transformedQuestions });
    } catch (err) {
      dispatch({ type: "error" });
    }
  };

  if (loading) return <Loader />;
  if (error) return <Error />;

  return (
    <div className="sections">
      <h2>Choose a Quiz Section</h2>
      <div className="section-grid">
        {sections.map((section) => (
          <div key={section.sectionId} className="section-card">
            <h3>{section.title}</h3>
            <p>{section.description}</p>
            <p className="section-info">
              {section.questionCount} questions • {section.totalPoints} points
            </p>
            <Button onClick={() => handleSectionSelect(section)}>
              Start Quiz
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
