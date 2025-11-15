
import React, { useState } from 'react';
import { useApp } from '../App';
import type { Question } from '../types';
import { LogoutIcon, UserIcon, QuestionIcon } from './icons';

const AdminQuestionItem: React.FC<{ question: Question }> = ({ question }) => {
  const { getUserById, answerQuestion } = useApp();
  const [answer, setAnswer] = useState(question.answer || '');
  const author = getUserById(question.authorId);

  const handleSaveAnswer = () => {
    answerQuestion(question.id, answer);
  };
  
  const baseClasses = "bg-surface p-4 rounded-lg border border-gray-700 transition-all duration-300";
  const deletedClasses = "opacity-50 line-through";

  return (
    <div className={`${baseClasses} ${question.deletedByUser ? deletedClasses : ''}`}>
        <p className="text-on-surface">{question.text}</p>
        <div className="flex justify-between items-center mt-2 text-xs text-on-surface-secondary">
            <span>By: {author?.nickname || 'Unknown'} ({author?.phone})</span>
            <span>{new Date(question.timestamp).toLocaleString()}</span>
        </div>
        {question.deletedByUser && (
            <p className="text-sm text-danger mt-2 font-semibold">[Deleted by user]</p>
        )}
      {!question.deletedByUser && (
        <div className="mt-4">
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Type your answer here..."
            className="w-full bg-background border border-gray-600 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            rows={3}
          />
          <button
            onClick={handleSaveAnswer}
            className="mt-2 px-4 py-1.5 bg-primary hover:bg-primary-hover text-white text-sm font-medium rounded-md transition-colors"
          >
            Save Answer
          </button>
        </div>
      )}
    </div>
  );
};


const AdminView: React.FC = () => {
    const { logout, questions, users } = useApp();
    const [activeTab, setActiveTab] = useState<'questions' | 'users'>('questions');

    const sortedQuestions = [...questions].sort((a, b) => b.timestamp - a.timestamp);
    
    const TabButton = ({ tabName, label, icon }: { tabName: 'questions' | 'users', label: string, icon: React.ReactNode }) => (
        <button
            onClick={() => setActiveTab(tabName)}
            className={`flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                activeTab === tabName 
                ? 'bg-surface text-primary border-b-2 border-primary' 
                : 'text-on-surface-secondary hover:bg-gray-800'
            }`}
        >
            {icon}
            <span>{label}</span>
        </button>
    );

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      <header className="flex justify-between items-center mb-6 pb-4 border-b border-gray-800">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <button
          onClick={logout}
          className="flex items-center space-x-2 text-on-surface-secondary hover:text-primary transition-colors"
          aria-label="Logout"
        >
          <LogoutIcon />
          <span>Logout</span>
        </button>
      </header>

      <div className="border-b border-gray-700">
        <nav className="-mb-px flex space-x-4" aria-label="Tabs">
            <TabButton tabName="questions" label="Questions" icon={<QuestionIcon className="w-5 h-5"/>} />
            <TabButton tabName="users" label="Users" icon={<UserIcon className="w-5 h-5"/>} />
        </nav>
      </div>

      <main className="mt-6">
        {activeTab === 'questions' && (
          <div className="space-y-4">
            {sortedQuestions.length > 0 ? (
                sortedQuestions.map(q => <AdminQuestionItem key={q.id} question={q} />)
            ) : (
                <p className="text-center text-on-surface-secondary py-10">No questions have been submitted yet.</p>
            )}
          </div>
        )}
        {activeTab === 'users' && (
          <div className="bg-surface p-4 rounded-lg border border-gray-700">
            <h2 className="text-xl font-semibold mb-4">Registered Users ({users.length})</h2>
            <ul className="divide-y divide-gray-700">
                {users.map(user => (
                    <li key={user.id} className="py-3 flex justify-between items-center">
                        <span className="font-medium text-on-surface">{user.nickname}</span>
                        <span className="text-sm text-on-surface-secondary">{user.phone}</span>
                    </li>
                ))}
            </ul>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminView;
