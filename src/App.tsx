import './index.css';
import React from 'react';
import { LanguageSelector } from './components/LanguageSelector';
import { TextInput } from './components/TextInput';
import { Reader } from './components/Reader/index';
import { Language } from './types';
import { BookOpen } from 'lucide-react';

function App() {
  const [language, setLanguage] = React.useState<Language>('es');
  const [text, setText] = React.useState<string>('');
  const [isReading, setIsReading] = React.useState(false);

  const handleTextSubmit = (submittedText: string) => {
    setText(submittedText);
    setIsReading(true);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <BookOpen className="h-12 w-12 text-indigo-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Language Learning Reader</h1>
          <p className="mt-2 text-sm text-gray-600">
            Upload text or paste content to practice reading in your target language
          </p>
        </div>

        <div className="space-y-6">
          <LanguageSelector
            selectedLanguage={language}
            onLanguageChange={setLanguage}
          />

          {!isReading ? (
            <div className="bg-white shadow sm:rounded-lg p-6">
              <TextInput onTextSubmit={handleTextSubmit} />
            </div>
          ) : (
            <div className="space-y-4">
              <button
                onClick={() => setIsReading(false)}
                className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                ← Back to Input
              </button>
              <Reader text={text} language={language} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
