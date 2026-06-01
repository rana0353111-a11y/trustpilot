import { useState } from "react";

const AVATAR_COLORS = ["#00b67a", "#185fa5", "#993556", "#854f0b", "#533ab7", "#d85a30"];
const RATING_LABELS = { 1: "Bahut Bura", 2: "Bura", 3: "Theek Hai", 4: "Acha", 5: "Excellent" };
const RATING_STYLES = {
  1: { bg: "#fcebeb", color: "#a32d2d" },
  2: { bg: "#fef2e5", color: "#a05010" },
  3: { bg: "#faeeda", color: "#854f0b" },
  4: { bg: "#eaf9e6", color: "#3b6d11" },
  5: { bg: "#e6f9f1", color: "#007a52" },
};

function getInitials(name) {
  return name.trim().split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
}

function StarRating({ value, onChange }) {
  const [hover, setHover] = useState(0);
  return (
    <div style={{ display: "flex", gap: 4 }}>
      {[1, 2, 3, 4, 5].map((v) => (
        <button
          key={v}
          onClick={() => onChange(v)}
          onMouseEnter={() => setHover(v)}
          onMouseLeave={() => setHover(0)}
          aria-label={v + " star"}
          style={{
            background: "none",
            border: "none",
            fontSize: 30,
            cursor: "pointer",
            color: v <= (hover || value) ? "#00b67a" : "#ddd",
            padding: 0,
            lineHeight: 1,
            transition: "color 0.1s",
          }}
        >
          ★
        </button>
      ))}
    </div>
  );
}

function ReviewCard({ review, index }) {
  const bg = AVATAR_COLORS[index % AVATAR_COLORS.length];
  const badge = RATING_STYLES[review.rating];
  const companyName =
    typeof review.company === "object" ? review.company?.name : review.company;

  return (
    <div style={{ background: "#fff", border: "0.5px solid #e5e5e5", borderRadius: 12, padding: "1.25rem", marginBottom: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <div style={{ width: 38, height: 38, borderRadius: "50%", background: bg, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 500, fontSize: 14, flexShrink: 0 }}>
            {getInitials(review.name)}
          </div>
          <div>
            <div style={{ fontWeight: 500, fontSize: 14 }}>{review.name}</div>
            <div style={{ fontSize: 12, color: "#888", marginTop: 2 }}>🏢 {companyName || "Unknown"}</div>
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ display: "flex", gap: 2 }}>
            {[1, 2, 3, 4, 5].map((v) => (
              <span key={v} style={{ fontSize: 16, color: v <= review.rating ? "#00b67a" : "#ddd" }}>★</span>
            ))}
          </div>
          <span style={{ display: "inline-block", marginTop: 4, padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 500, background: badge.bg, color: badge.color }}>
            {RATING_LABELS[review.rating]}
          </span>
        </div>
      </div>
      {review.comment && (
        <p style={{ fontSize: 14, color: "#555", lineHeight: 1.6, marginTop: 8 }}>"{review.comment}"</p>
      )}
    </div>
  );
}

const inputStyle = {
  width: "100%", padding: "8px 12px",
  border: "0.5px solid #ccc", borderRadius: 8,
  fontSize: 14, fontFamily: "inherit",
  outline: "none", boxSizing: "border-box",
};

function TrustpilotApp({ companies = [], reviews = [], onSubmitReview }) {
  const [name, setName] = useState("");
  const [companyId, setCompanyId] = useState("");
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");

  const DEFAULT_COMPANIES = ["Amazon", "Daraz", "Foodpanda", "Careem", "Jazz", "Other"];
  const companyList =
    companies.length > 0
      ? companies
      : DEFAULT_COMPANIES.map((n, i) => ({ _id: String(i + 1), name: n }));

  async function handleSubmit() {
    if (!name.trim()) return setError("Naam likhen please");
    if (!companyId) return setError("Company select karen");
    if (!rating) return setError("Rating dein please");
    setError("");
    if (onSubmitReview) {
      await onSubmitReview({ companyId, name: name.trim(), rating, comment: comment.trim() });
    }
    setName(""); setCompanyId(""); setRating(0); setComment("");
  }

  return (
    <div style={{ maxWidth: 680, margin: "0 auto", padding: "2rem 1rem", fontFamily: "system-ui, sans-serif" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: "2rem" }}>
        <div style={{ background: "#00b67a", color: "#fff", fontWeight: 500, fontSize: 18, padding: "8px 14px", borderRadius: 8 }}>★ Trust</div>
        <span style={{ fontSize: 22, fontWeight: 500 }}>Trustpilot MVP</span>
      </div>

      <div style={{ background: "#fff", border: "0.5px solid #e5e5e5", borderRadius: 12, padding: "1.5rem", marginBottom: "1.5rem" }}>
        <h2 style={{ fontSize: 16, fontWeight: 500, marginBottom: "1.25rem", paddingBottom: "0.75rem", borderBottom: "0.5px solid #e5e5e5" }}>
          ✏️ Review likhen
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
          <div>
            <label style={{ fontSize: 13, color: "#666", display: "block", marginBottom: 6 }}>Aapka naam</label>
            <input style={inputStyle} value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Ahmed Raza" />
          </div>
          <div>
            <label style={{ fontSize: 13, color: "#666", display: "block", marginBottom: 6 }}>Company</label>
            <select style={{ ...inputStyle, height: 36 }} value={companyId} onChange={(e) => setCompanyId(e.target.value)}>
              <option value="">Company select karen</option>
              {companyList.map((c) => (
                <option key={c._id} value={c._id}>{c.name}</option>
              ))}
            </select>
          </div>
        </div>
        <div style={{ marginBottom: 12 }}>
          <label style={{ fontSize: 13, color: "#666", display: "block", marginBottom: 6 }}>Rating</label>
          <StarRating value={rating} onChange={setRating} />
        </div>
        <div style={{ marginBottom: "1rem" }}>
          <label style={{ fontSize: 13, color: "#666", display: "block", marginBottom: 6 }}>Comment</label>
          <textarea style={{ ...inputStyle, resize: "vertical", minHeight: 80 }} value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Apna experience share karen..." />
        </div>
        {error && <p style={{ color: "#a32d2d", fontSize: 13, marginBottom: 10 }}>⚠️ {error}</p>}
        <button onClick={handleSubmit} style={{ background: "#00b67a", color: "#fff", border: "none", padding: "10px 24px", borderRadius: 8, fontSize: 14, fontWeight: 500, cursor: "pointer", fontFamily: "inherit" }}>
          ➤ Review Submit Karen
        </button>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
        <h2 style={{ fontSize: 18, fontWeight: 500 }}>Reviews</h2>
        <span style={{ fontSize: 13, color: "#666", background: "#f5f5f5", padding: "4px 10px", borderRadius: 20 }}>
          {reviews.length} review{reviews.length !== 1 ? "s" : ""}
        </span>
      </div>

      {reviews.length === 0 ? (
        <div style={{ textAlign: "center", padding: "2.5rem", color: "#aaa" }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>💬</div>
          <p style={{ fontSize: 14 }}>Abhi koi review nahi. Pehla review aap likhen!</p>
        </div>
      ) : (
        reviews.map((rv, i) => <ReviewCard key={rv._id || i} review={rv} index={i} />)
      )}
    </div>
  );
}

export default TrustpilotApp;
