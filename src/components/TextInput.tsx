import React, { useRef } from 'react';
import { FileText, Upload } from 'lucide-react';

interface TextInputProps {
  onTextSubmit: (text: string) => void;
}

export const TextInput: React.FC<TextInputProps> = ({ onTextSubmit }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [text, setText] = React.useState('');

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const text = await file.text();
      setText(text);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onTextSubmit(text);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium text-gray-900">Input Text</h2>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <Upload className="h-4 w-4 mr-2" />
          Upload File
        </button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          accept=".txt"
          className="hidden"
        />
      </div>
      <div className="mt-1">
        <textarea
          rows={4}
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
          placeholder="Paste your text here or upload a .txt file..."
        />
      </div>
      <div className="flex justify-end">
        <button
          type="submit"
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <FileText className="h-4 w-4 mr-2" />
          Start Reading
        </button>
      </div>
    </form>
  );
};