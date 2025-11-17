import { useState } from "react";
import { useApi } from "../../hooks/useApi";
import { addSection } from "../../utils/api";
import Button from "../ui/Button";

export default function AddSectionForm({ onSectionAdded }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    questions: [
      {
        question: "",
        options: ["", "", "", ""],
        correctOption: 0,
        points: 10,
      },
    ],
  });
  const { loading, error } = useApi();

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleQuestionChange = (index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      questions: prev.questions.map((q, i) =>
        i === index ? { ...q, [field]: value } : q
      ),
    }));
  };

  const handleOptionChange = (questionIndex, optionIndex, value) => {
    setFormData((prev) => ({
      ...prev,
      questions: prev.questions.map((q, i) =>
        i === questionIndex
          ? {
              ...q,
              options: q.options.map((opt, j) =>
                j === optionIndex ? value : opt
              ),
            }
          : q
      ),
    }));
  };

  const addQuestion = () => {
    setFormData((prev) => ({
      ...prev,
      questions: [
        ...prev.questions,
        {
          question: "",
          options: ["", "", "", ""],
          correctOption: 0,
          points: 10,
        },
      ],
    }));
  };

  const removeQuestion = (index) => {
    setFormData((prev) => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Transform data to match API format
      const transformedData = {
        ...formData,
        questions: formData.questions.map((q) => ({
          question: q.question,
          options: q.options,
          answer: q.options[q.correctOption],
          points: q.points,
        })),
      };

      await addSection(transformedData);
      onSectionAdded();
      setFormData({
        title: "",
        description: "",
        questions: [
          {
            question: "",
            options: ["", "", "", ""],
            correctOption: 0,
            points: 10,
          },
        ],
      });
    } catch (err) {
      console.error("Failed to add section:", err);
    }
  };

  return (
    <div
      className="add-section-container"
      style={{ width: "100%", maxWidth: "none" }}
    >
      <div className="form-header">
        <h2 className="section-heading">Create New Quiz Section</h2>
        <p>Build engaging quizzes with multiple choice questions</p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="add-section-form"
        style={{ width: "100%", maxWidth: "none" }}
      >
        {/* Section Info */}
        <div className="section-info">
          <div className="section-details">
            <h3>📝 Section Details</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Quiz Title *</label>
                <input
                  type="text"
                  placeholder="e.g., JavaScript Fundamentals"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label>Description *</label>
              <textarea
                placeholder="Brief description of what this quiz covers..."
                value={formData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                required
                rows="3"
              />
            </div>
          </div>
          <div className="section-meta">
            <h4>📊 Quick Stats</h4>
            <div className="stat-item">
              <span className="stat-label">Questions:</span>
              <span className="stat-value">{formData.questions.length}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Total Points:</span>
              <span className="stat-value">
                {formData.questions.reduce(
                  (sum, q) => sum + (q.points || 0),
                  0
                )}
              </span>
            </div>
          </div>
        </div>

        {/* Questions Section */}
        <div className="questions-section">
          <div className="section-header">
            <h3>❓ Questions ({formData.questions.length})</h3>
            <Button
              type="button"
              onClick={addQuestion}
              className="add-question-btn"
            >
              ➕ Add Question
            </Button>
          </div>

          {formData.questions.map((question, qIndex) => (
            <div key={qIndex} className="question-card">
              <div className="question-content">
                <div className="question-header">
                  <span className="question-number">Q{qIndex + 1}</span>
                  <div className="question-actions">
                    <span className="points-badge">{question.points} pts</span>
                    {formData.questions.length > 1 && (
                      <button
                        type="button"
                        className="remove-btn"
                        onClick={() => removeQuestion(qIndex)}
                        title="Remove question"
                      >
                        🗑️
                      </button>
                    )}
                  </div>
                </div>

                <div className="form-group">
                  <label>Question Text *</label>
                  <input
                    type="text"
                    placeholder="Enter your question here..."
                    value={question.question}
                    onChange={(e) =>
                      handleQuestionChange(qIndex, "question", e.target.value)
                    }
                    required
                  />
                </div>

                <div className="options-section">
                  <label className="options-label">
                    Answer Options *{" "}
                    <span className="hint">(Select the correct answer)</span>
                  </label>
                  <div className="options-list">
                    {question.options.map((option, oIndex) => (
                      <div
                        key={oIndex}
                        className={`option-item ${
                          question.correctOption === oIndex ? "correct" : ""
                        }`}
                      >
                        <div className="option-input">
                          <span className="option-letter">
                            {String.fromCharCode(65 + oIndex)}
                          </span>
                          <input
                            type="text"
                            placeholder={`Option ${String.fromCharCode(
                              65 + oIndex
                            )}`}
                            value={option}
                            onChange={(e) =>
                              handleOptionChange(qIndex, oIndex, e.target.value)
                            }
                            required
                          />
                          <label className="radio-label">
                            <input
                              type="radio"
                              name={`correct-${qIndex}`}
                              checked={question.correctOption === oIndex}
                              onChange={() =>
                                handleQuestionChange(
                                  qIndex,
                                  "correctOption",
                                  oIndex
                                )
                              }
                            />
                            <span className="radio-custom"></span>
                            <span className="correct-text">Correct</span>
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="question-sidebar">
                <h4>⚙️ Settings</h4>
                <div className="form-group points-group">
                  <label>Points</label>
                  <input
                    type="number"
                    value={question.points}
                    onChange={(e) =>
                      handleQuestionChange(
                        qIndex,
                        "points",
                        parseInt(e.target.value) || 1
                      )
                    }
                    min="1"
                    max="100"
                    required
                  />
                </div>
                <div className="question-info">
                  <p>
                    <strong>Correct Answer:</strong>{" "}
                    {String.fromCharCode(65 + question.correctOption)}
                  </p>
                  <p>
                    <strong>Difficulty:</strong>{" "}
                    {question.points <= 10
                      ? "Easy"
                      : question.points <= 20
                      ? "Medium"
                      : "Hard"}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="form-footer">
          <div className="quiz-summary">
            <span>📊 Total Questions: {formData.questions.length}</span>
            <span>
              🎯 Total Points:{" "}
              {formData.questions.reduce((sum, q) => sum + (q.points || 0), 0)}
            </span>
          </div>
          <Button type="submit" disabled={loading} className="submit-btn">
            {loading ? "Creating Quiz..." : "🚀 Create Quiz Section"}
          </Button>
        </div>

        {error && <div className="error-message">❌ {error}</div>}
      </form>
    </div>
  );
}
