import React, { useState } from 'react'
import "../../css/MovieSelector.css"
import { useNavigate } from 'react-router-dom'

const MovieSelector = () => {
  const [flippedIndex, setFlippedIndex] = useState(null);
  const [recommendations, setRecommendations] = useState({}); // Store recommendations per card
  const items = [
    "I want to fall asleep halfway through",
    "Give me something to talk about at dinner",
    "Make me question reality, but not too much",
    "Teach me something without making it boring",
    "Play in bground while I clean",
    "I want to feel like I’m not alone",
    "Something that doesn’t waste a second",
    "I want to cry but just a little",
    "A movie that feels like a warm hug",
    "Surprise me with something under 80 minutes",
    "I want to feel powerful after watching",
    "Give me something peaceful and wordless",
    "I want weird but not scary",
    "Make me nostalgic for no reason",
    "A movie that feels like late-night rain",
    "Something I can half-watch with my parents",
    "Give me the emotional damage I deserve",
    "I want to feel like I’m in love, even if I’m not",
    "A plot twist I’ll never see coming",
    "Something I’ll overthink at 2 AM"
  ];

  const sendPrompt = async (prompt, index) => {
    try {
      const response = await fetch("http://127.0.0.1:8000/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt })
      });
      const data = await response.json();
      setRecommendations(prev => ({
        ...prev,
        [index]: data.recommendations && data.recommendations.length > 0
          ? data.recommendations[0] // Show the first recommended movie
          : "No recommendation"
      }));
    } catch (err) {
      setRecommendations(prev => ({
        ...prev,
        [index]: "Error fetching recommendation"
      }));
    }
  };

  const handleCardClick = (index, item) => {
    setFlippedIndex(index);
    sendPrompt(item, index);
  };

  return (
    <div className="cardGrid">
      {items.map((item, index) => (
        <div
          className="card"
          key={item}
          onClick={() => handleCardClick(index, item)}
        >
          <div className={`card-inner${flippedIndex === index ? " flipped" : ""}`}>
            <div className="card-front">
              <b>{item}</b>
            </div>
            <div className="card-back">
              {flippedIndex === index
                ? (recommendations[index] || "Loading...")
                : "back"}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MovieSelector