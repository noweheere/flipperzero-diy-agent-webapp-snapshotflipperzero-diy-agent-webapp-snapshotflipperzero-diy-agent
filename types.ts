
export type FileKey = 
  | 'main.py' 
  | 'pinout_generator.py' 
  | 'hardware_camera_recognition.py' 
  | 'datasheet_search.py' 
  | 'wiring_annotation.py' 
  | 'agent_cli.py';

export interface ProjectFile {
  key: FileKey;
  name: string;
  language: string;
  content: string;
}

export enum MessageRole {
    USER = 'user',
    ASSISTANT = 'assistant',
}

export type TextPart = {
    type: 'text';
    text: string;
};

export type ImagePart = {
    type: 'image';
    mimeType: string;
    data: string; // base64 encoded
};

export type MessagePart = TextPart | ImagePart;

export interface ChatMessage {
    role: MessageRole;
    parts: MessagePart[];
    groundingChunks?: any[];
}
