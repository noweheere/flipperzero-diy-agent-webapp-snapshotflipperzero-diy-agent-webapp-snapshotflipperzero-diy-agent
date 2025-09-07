import React from 'react';
import { Spinner } from './icons/Spinner';

type ScanType = 'bluetooth' | 'nfc' | 'wifi' | 'uart';

interface ScanTabsProps {
  onScan: (scanType: ScanType) => void;
  result: string;
  isLoading: boolean;
  activeScan: string;
}

const renderMarkdown = (text: string) => {
    let html = text;
    html = html.replace(/\|(.+)\|/g, '</tr><tr>$1</tr><tr>').replace(/<tr>/,'').replace(/<\/tr>$/,'');
    html = html.replace(/---\|/g, '</td><td>').replace(/\|---/g, '</td><td>');
    html = html.replace(/\|/g, '</td><td>');
    html = html.replace(/<tr><td>/g,'<tr><th>').replace(/<\/td><\/tr>/g,'</th></tr>');
    html = `<table>${html}</table>`
    // General markdown
    html = html.replace(/^\* (.*$)/gim, '<li>$1</li>');
    html = html.replace(/<\/li>\n<li>/g, '</li><li>');
    html = html.replace(/(<li>.*<\/li>)/gs, '<ul class="list-disc list-inside ml-4">$1</ul>');
    html = html.replace(/\n/g, '<br />');
    return { __html: html };
}

export const ScanTabs: React.FC<ScanTabsProps> = ({ onScan, result, isLoading, activeScan }) => {
  const tabs: { id: ScanType; label: string }[] = [
    { id: 'bluetooth', label: 'Bluetooth' },
    { id: 'nfc', label: 'NFC' },
    { id: 'wifi', label: 'WiFi' },
    { id: 'uart', label: 'UART/Serial' },
  ];

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-lg flex flex-col">
      <div className="p-2 border-b border-gray-700">
        <h2 className="text-lg font-bold text-orange-400 px-2">Hardware Scans</h2>
        <div className="flex space-x-1 mt-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onScan(tab.id)}
              disabled={isLoading}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                activeScan === tab.id && !isLoading
                  ? 'bg-orange-500/80 text-white'
                  : 'bg-gray-700 hover:bg-gray-600'
              } disabled:opacity-50`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
      <div className="p-4 min-h-[150px] overflow-y-auto">
        {isLoading && activeScan ? (
          <div className="flex items-center justify-center h-full">
            <Spinner />
            <span className="ml-2">Scanning for {activeScan}...</span>
          </div>
        ) : result && activeScan ? (
          <div className="prose prose-invert prose-sm max-w-none text-gray-300" dangerouslySetInnerHTML={renderMarkdown(result)}></div>
        ) : (
          <p className="text-sm text-gray-500">Select a scan type to begin.</p>
        )}
      </div>
    </div>
  );
};
