import React from 'react';
import { Spinner } from './icons/Spinner';

interface ResultsDisplayProps {
  originalImage: string | null;
  annotatedImage: string | null;
  analysisResult: string;
  isLoading: boolean;
}

// Simple markdown renderer
const renderMarkdown = (text: string) => {
    let html = text;
    html = html.replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold mt-4 mb-2">$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold mt-6 mb-3">$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold mt-8 mb-4">$1</h1>');
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
    html = html.replace(/```([\s\S]*?)```/g, '<pre class="bg-gray-900 p-3 rounded-md my-2 overflow-x-auto"><code>$1</code></pre>');
    html = html.replace(/`(.*?)`/g, '<code class="bg-gray-700 text-orange-300 rounded px-1 py-0.5">$1</code>');
    html = html.replace(/^\* (.*$)/gim, '<li>$1</li>');
    html = html.replace(/<\/li>\n<li>/g, '</li><li>');
    html = html.replace(/(<li>.*<\/li>)/gs, '<ul class="list-disc list-inside ml-4">$1</ul>');
    html = html.replace(/---/g, '<hr class="border-gray-600 my-4" />');
    html = html.replace(/\n/g, '<br />');
    html = html.replace(/<\/pre><br \/>/g, '</pre>');
    html = html.replace(/<br \/><(h[1-3]|ul|hr)/g, '<$1');
    html = html.replace(/<\/ul><br \/>/g, '</ul>');
    return { __html: html };
};

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ originalImage, annotatedImage, analysisResult, isLoading }) => {
  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-lg flex flex-col">
        <h2 className="text-lg font-bold text-orange-400 p-4 border-b border-gray-700 flex-shrink-0">
            Analysis Results
        </h2>
        
        {/* Image Previews */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
            <div>
                <h3 className="text-sm font-semibold text-gray-400 mb-2">Original Image</h3>
                <div className="aspect-video bg-gray-900/50 rounded flex items-center justify-center">
                    {originalImage ? (
                        <img src={originalImage} alt="Original Upload" className="max-h-full max-w-full object-contain rounded"/>
                    ) : (
                        <span className="text-xs text-gray-500">Upload an image to begin</span>
                    )}
                </div>
            </div>
             <div>
                <h3 className="text-sm font-semibold text-gray-400 mb-2">Annotated Output</h3>
                <div className="aspect-video bg-gray-900/50 rounded flex items-center justify-center">
                     {annotatedImage ? (
                        <img src={annotatedImage} alt="Annotated Output" className="max-h-full max-w-full object-contain rounded"/>
                    ) : (
                        <span className="text-xs text-gray-500">Annotation will appear here</span>
                    )}
                </div>
            </div>
        </div>

        {/* Text Results */}
        <div className="p-4 border-t border-gray-700 flex-1 overflow-y-auto">
            <h3 className="text-sm font-semibold text-gray-400 mb-2">Component & Wiring Details</h3>
            <div className="prose prose-invert prose-sm max-w-none bg-gray-900/50 rounded p-4 min-h-[150px] text-gray-300">
                {isLoading ? (
                    <div className="flex items-center justify-center h-full">
                        <Spinner />
                        <span className="ml-2">Analyzing...</span>
                    </div>
                ) : analysisResult ? (
                    <div dangerouslySetInnerHTML={renderMarkdown(analysisResult)} />
                ) : (
                    <p className="text-gray-500">Analysis from the AI will appear here.</p>
                )}
            </div>
        </div>
    </div>
  );
};
