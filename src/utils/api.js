const API_BASE_URL = import.meta.env.VITE_API_URL;

export const apiEndpoints = {
  sections: `${API_BASE_URL}/getSections`,
  questions: (sectionId) => `${API_BASE_URL}/getQuestions/${sectionId}`,
  addSection: `${API_BASE_URL}/createSections`,
};

export async function fetchSections() {
  const response = await fetch(apiEndpoints.sections);
  if (!response.ok) throw new Error("Failed to fetch sections");
  const data = await response.json();
  return data;
}

export async function fetchQuestions(sectionId) {
  const response = await fetch(apiEndpoints.questions(sectionId));
  if (!response.ok) throw new Error("Failed to fetch questions");
  const data = await response.json();
  return data;
}

export async function addSection(sectionData) {
  const response = await fetch(apiEndpoints.addSection, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(sectionData),
  });
  if (!response.ok) throw new Error("Failed to add section");
  const data = await response.json();
  return data;
}
