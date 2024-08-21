import React, { useState } from 'react';
import './CreateFaq.scss';  // Import SCSS styling

const CreateFaq = () => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (question.trim() && answer.trim()) {
      // Here you could call a function to add the FAQ, e.g., addFAQ(question, answer);
      setQuestion('');
      setAnswer('');
    }
  };

  return (
    <div className="create-faq-container">
      <h1>Add FAQ</h1>
      <form onSubmit={handleSubmit} className="add-faq-form">
        <div className="form-group">
          <label htmlFor="question">Frage:</label>
          <input
            type="text"
            id="question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Enter your question"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="answer">Antwort:</label>
          <textarea
            id="answer"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Enter the answer"
            required
          />
        </div>
        <button type="submit" className="submit-button">Add FAQ</button>
      </form>
    </div>
  );
};

export default CreateFaq;
