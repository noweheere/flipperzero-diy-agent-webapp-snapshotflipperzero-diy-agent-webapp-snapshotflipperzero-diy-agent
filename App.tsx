import React, { useState, useCallback } from 'react';
import { Sidebar } from './components/Sidebar';
import { InteractivePanel } from './components/InteractivePanel';
import { ResultsDisplay } from './components/ResultsDisplay';
import { ScanTabs } from './components/ScanTabs';
import { PROJECT_FILES } from './constants';
import * as geminiService from './services/geminiService';
import type { FileKey } from './types';


const App: React.FC = () => {
  const [activeFileKey, setActiveFileKey] = useState<FileKey>('main.py');
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string>('');
  const [uploadedImage, setUploadedImage] = useState<{ b64: string; mime: string; url: string } | null>(null);
  const [annotatedImage, setAnnotatedImage] = useState<string | null>(null);
  const [scanResult, setScanResult] = useState<string>('');
  const [activeScan, setActiveScan] = useState<string>('');
  
  const handleFileSelect = (fileKey: FileKey) => {
    setActiveFileKey(fileKey);
    // Reset state when changing files
    setAnalysisResult('');
    setUploadedImage(null);
    setAnnotatedImage(null);
    setScanResult('');
    setActiveScan('');
  };

  const handleImageUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const b64 = (e.target?.result as string).split(',')[1];
      const url = URL.createObjectURL(file);
      setUploadedImage({ b64, mime: file.type, url });
      setAnalysisResult('');
      setAnnotatedImage(null);
    };
    reader.readAsDataURL(file);
  };

  const handleRecognize = useCallback(async () => {
    if (!uploadedImage) return;
    setIsLoading(true);
    setAnalysisResult('');
    try {
      const responseText = await geminiService.identifyComponent(uploadedImage.b64, uploadedImage.mime);
      setAnalysisResult(responseText);
    } catch (error) {
      console.error(error);
      setAnalysisResult('Sorry, I encountered an error during component recognition.');
    } finally {
      setIsLoading(false);
    }
  }, [uploadedImage]);

  const handleSearch = useCallback(async () => {
    if (!analysisResult) return;
    setIsLoading(true);
    // Extract a potential component name from the existing analysis
    const componentName = analysisResult.split('\n')[0].replace(/\*|#/g, '').trim();
    
    try {
      const searchResponse = await geminiService.findDatasheet(componentName);
      setAnalysisResult(prev => `${prev}\n\n---\n\n### Datasheet & Wiring Info for ${componentName}\n\n${searchResponse.text}`);
    } catch (error) {
      console.error(error);
      setAnalysisResult(prev => `${prev}\n\n---\n\nSorry, I couldn't find a datasheet for that component.`);
    } finally {
      setIsLoading(false);
    }
  }, [analysisResult]);
  
  const handleAnnotate = useCallback(async () => {
    if (!uploadedImage) return;
    setIsLoading(true);
    try {
      // For this demo, we'll just reuse the wiring analysis prompt as it's vision-based.
      // A real implementation might use a different model or prompt for annotation.
      const responseText = await geminiService.annotateWiring(uploadedImage.b64, uploadedImage.mime);
      // In a real app, the model could return coordinates to draw on the image,
      // or even return the annotated image directly if using an image-out model.
      // Here, we'll simulate it by just showing the textual analysis as the "annotation".
      setAnalysisResult(responseText);
      // We don't have an image-out model, so we'll just re-use the original image as a placeholder.
      setAnnotatedImage(uploadedImage.url); 
    } catch (error) {
      console.error(error);
      setAnalysisResult('Sorry, I encountered an error while annotating the image.');
    } finally {
      setIsLoading(false);
    }
  }, [uploadedImage]);
  
  const handleScan = useCallback(async (scanType: 'bluetooth' | 'nfc' | 'wifi' | 'uart') => {
      setIsLoading(true);
      setActiveScan(scanType);
      setScanResult('');
      try {
        const result = await geminiService.performScan(scanType);
        setScanResult(result);
      } catch (error) {
          console.error(error);
          setScanResult(`Error performing ${scanType} scan.`);
      } finally {
          setIsLoading(false);
      }
  }, []);


  return (
    <div className="flex h-screen bg-gray-900 text-gray-200 font-mono">
      {/* Sidebar can be kept for project context if desired, or removed for a cleaner look */}
      <Sidebar files={Object.values(PROJECT_FILES)} activeFileKey={activeFileKey} onFileSelect={handleFileSelect} />
      
      <main className="flex-1 flex flex-col p-4 md:p-6 gap-6 overflow-y-auto">
        <header className="flex-shrink-0">
          <h1 className="text-2xl text-orange-400 font-bold">Flipper Zero DIY Agent</h1>
          <p className="text-sm text-gray-400">Interactive Hardware Assistant</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1">
            {/* Left Column: Controls & Scans */}
            <div className="flex flex-col gap-6">
                <InteractivePanel
                    onImageUpload={handleImageUpload}
                    onRecognize={handleRecognize}
                    onSearch={handleSearch}
                    onAnnotate={handleAnnotate}
                    isLoading={isLoading}
                    imageUploaded={!!uploadedImage}
                    analysisDone={!!analysisResult}
                />
                 <ScanTabs onScan={handleScan} result={scanResult} isLoading={isLoading} activeScan={activeScan} />
            </div>
            
            {/* Right Column: Results */}
            <ResultsDisplay
                originalImage={uploadedImage?.url}
                annotatedImage={annotatedImage}
                analysisResult={analysisResult}
                isLoading={isLoading && !activeScan}
            />
        </div>
      </main>
    </div>
  );
};

export default App;