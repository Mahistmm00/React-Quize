import { useState } from "react";
import AddSectionForm from "./AddSectionForm";
import Button from "../ui/Button";

export default function AdminPanel() {
  const [showForm, setShowForm] = useState(false);

  const handleSectionAdded = () => {
    setShowForm(false);
    // Refresh sections list
    window.location.reload();
  };

  return (
    <div className="admin-panel">
      <div className="admin-header">
        <h2>Admin Panel</h2>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? "Cancel" : "Add New Section"}
        </Button>
      </div>
      
      {showForm && (
        <AddSectionForm onSectionAdded={handleSectionAdded} />
      )}
    </div>
  );
}