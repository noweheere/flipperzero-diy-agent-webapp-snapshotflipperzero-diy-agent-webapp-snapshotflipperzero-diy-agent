import React from 'react';
import type { ProjectFile, FileKey } from '../types';
import { PythonIcon } from './icons/PythonIcon';

interface SidebarProps {
  files: ProjectFile[];
  activeFileKey: FileKey;
  onFileSelect: (key: FileKey) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ files, activeFileKey, onFileSelect }) => {
  return (
    <aside className="w-64 bg-gray-800 p-4 border-r border-gray-700 flex flex-col">
      <div className="text-2xl font-bold mb-6 text-white">
        <span className="text-orange-400">Flipper</span>Agent
      </div>
      <nav>
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">Project Files</h3>
        <ul>
          {files.map((file) => (
            <li key={file.key} className="mb-1">
              <button
                onClick={() => onFileSelect(file.key)}
                className={`flex items-center w-full text-left px-3 py-2 rounded-md text-sm transition-colors duration-150 ${
                  activeFileKey === file.key
                    ? 'bg-orange-500/20 text-orange-300'
                    : 'text-gray-300 hover:bg-gray-700'
                }`}
              >
                <PythonIcon className="w-5 h-5 mr-3 text-cyan-400" />
                {file.name}
              </button>
            </li>
          ))}
        </ul>
      </nav>
       <div className="mt-auto text-center text-xs text-gray-500">
          <p>&copy; 2024 DIY Agent Inc.</p>
          <p>Powered by Gemini</p>
        </div>
    </aside>
  );
};