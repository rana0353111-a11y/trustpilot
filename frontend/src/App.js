import { useEffect, useState } from "react";
import TrustpilotApp from "./TrustpilotApp.js";

function App() {
  const [companies, setCompanies] = useState([]);
  const [reviews, setReviews] = useState([]);

  const fetchCompanies = async () => {
    try {
      const res = await fetch("http://localhost:5000/companies");
      const data = await res.json();
      setCompanies(data);
    } catch (err) {
      console.log("Error fetching companies:", err);
    }
  };

  const fetchReviews = async () => {
    try {
      const res = await fetch("http://localhost:5000/reviews");
      const data = await res.json();
      setReviews(data);
    } catch (err) {
      console.log("Error fetching reviews:", err);
    }
  };

  useEffect(() => {
    fetchCompanies();
    fetchReviews();
  }, []);

  const handleSubmitReview = async (formData) => {
    try {
      await fetch("http://localhost:5000/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          rating: Number(formData.rating),
        }),
      });
      fetchReviews();
    } catch (err) {
      console.log("Submit error:", err);
    }
  };

  return (
    <TrustpilotApp
      companies={companies}
      reviews={reviews}
      onSubmitReview={handleSubmitReview}
    />
  );
};
export default App;
