import React, { useState, useCallback } from 'react';
import { UploadIcon } from './icons/UploadIcon';
import { Spinner } from './icons/Spinner';

interface InteractivePanelProps {
    onImageUpload: (file: File) => void;
    onRecognize: () => void;
    onSearch: () => void;
    onAnnotate: () => void;
    isLoading: boolean;
    imageUploaded: boolean;
    analysisDone: boolean;
}

export const InteractivePanel: React.FC<InteractivePanelProps> = ({
    onImageUpload,
    onRecognize,
    onSearch,
    onAnnotate,
    isLoading,
    imageUploaded,
    analysisDone
}) => {
    const [isDragging, setIsDragging] = useState(false);
    
    const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation(); // Necessary to allow drop
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        const files = e.dataTransfer.files;
        if (files && files.length > 0) {
            onImageUpload(files[0]);
        }
    };
    
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            onImageUpload(files[0]);
        }
    }

    const ActionButton: React.FC<{ onClick: () => void; disabled: boolean; children: React.ReactNode }> = ({ onClick, disabled, children }) => (
        <button
            onClick={onClick}
            disabled={disabled}
            className="w-full text-left px-4 py-3 rounded-md text-sm transition-colors duration-150 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-500 disabled:cursor-not-allowed flex items-center"
        >
            {children}
        </button>
    );

    return (
        <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-lg flex flex-col p-4 gap-4">
            <h2 className="text-lg font-bold text-orange-400">Controls</h2>
            
            {/* Image Upload */}
            <div
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors duration-200 ${isDragging ? 'border-orange-500 bg-gray-700/50' : 'border-gray-600 hover:border-orange-400'}`}
            >
                <input type="file" id="file-upload" className="hidden" accept="image/*" onChange={handleFileChange} />
                <label htmlFor="file-upload" className="cursor-pointer">
                    <UploadIcon className="w-8 h-8 mx-auto text-gray-400 mb-2"/>
                    <p className="text-sm text-gray-400">
                        <span className="font-semibold text-orange-400">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">PNG, JPG, or WEBP</p>
                </label>
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-col gap-2">
                <ActionButton onClick={onRecognize} disabled={isLoading || !imageUploaded}>
                    {isLoading && !analysisDone ? <Spinner className="w-4 h-4 mr-2" /> : '1.'} Recognize Components & Pinouts
                </ActionButton>
                
                <ActionButton onClick={onSearch} disabled={isLoading || !analysisDone}>
                    {isLoading && analysisDone ? <Spinner className="w-4 h-4 mr-2" /> : '2.'} Find Datasheet & Wiring
                </ActionButton>

                <ActionButton onClick={onAnnotate} disabled={isLoading || !imageUploaded}>
                    {isLoading ? <Spinner className="w-4 h-4 mr-2" /> : '3.'} Generate Annotated Image
                </ActionButton>
            </div>
        </div>
    );
};
