
import React, { useState } from 'react';
import { useApp } from '../App';
import { LogoutIcon, SendIcon, TrashIcon } from './icons';
import type { Question } from '../types';

const QuestionItem: React.FC<{ question: Question; onDelete: (id: string) => void }> = ({ question, onDelete }) => {
  return (
    <div className="bg-surface p-4 rounded-lg border border-gray-700 transition-shadow hover:shadow-lg">
      <div className="flex justify-between items-start">
        <p className="text-on-surface flex-1 pr-4">{question.text}</p>
        <button
          onClick={() => onDelete(question.id)}
          className="text-gray-500 hover:text-danger transition-colors"
          aria-label="Delete question"
        >
          <TrashIcon />
        </button>
      </div>
      <p className="text-xs text-on-surface-secondary mt-2">{new Date(question.timestamp).toLocaleString()}</p>
      {question.answer && (
        <div className="mt-4 pt-4 border-t border-gray-700">
          <p className="text-sm font-bold text-primary">Speaker's Answer:</p>
          <p className="text-on-surface-secondary mt-1 whitespace-pre-wrap">{question.answer}</p>
        </div>
      )}
    </div>
  );
};

const UserView: React.FC = () => {
  const { currentUser, logout, questions, addQuestion, deleteQuestion } = useApp();
  const [newQuestion, setNewQuestion] = useState('');
  
  if (!currentUser || currentUser === 'ADMIN') return null;

  const userQuestions = questions
    .filter(q => q.authorId === currentUser.id && !q.deletedByUser)
    .sort((a, b) => b.timestamp - a.timestamp);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newQuestion.trim()) {
      addQuestion(newQuestion.trim());
      setNewQuestion('');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      <header className="flex justify-between items-center mb-6 pb-4 border-b border-gray-800">
        <h1 className="text-2xl font-bold">
          Welcome, <span className="text-primary">{currentUser.nickname}</span>
        </h1>
        <button
          onClick={logout}
          className="flex items-center space-x-2 text-on-surface-secondary hover:text-primary transition-colors"
          aria-label="Logout"
        >
          <LogoutIcon />
          <span>Logout</span>
        </button>
      </header>
      
      <main>
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-3">Ask a New Question</h2>
          <form onSubmit={handleSubmit} className="flex space-x-2">
            <input
              type="text"
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
              placeholder="Type your question here..."
              className="flex-grow bg-surface border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button
              type="submit"
              className="bg-primary hover:bg-primary-hover text-white px-4 py-3 rounded-lg flex items-center justify-center transition-colors"
              aria-label="Submit question"
            >
              <SendIcon />
            </button>
          </form>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Your Questions</h2>
          {userQuestions.length > 0 ? (
            <div className="space-y-4">
              {userQuestions.map(q => (
                <QuestionItem key={q.id} question={q} onDelete={deleteQuestion} />
              ))}
            </div>
          ) : (
            <div className="text-center py-10 px-6 bg-surface rounded-lg border border-dashed border-gray-700">
              <p className="text-on-surface-secondary">You haven't asked any questions yet.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default UserView;
