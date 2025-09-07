import { GoogleGenAI, GenerateContentResponse, Content } from "@google/genai";
import type { ChatMessage } from '../types';
import { MessageRole } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const textModel = 'gemini-2.5-flash';
const visionModel = 'gemini-2.5-flash'; // This model supports vision

const convertChatHistoryToContents = (history: ChatMessage[]): Content[] => {
    return history.map(msg => ({
        role: msg.role === MessageRole.USER ? 'user' : 'model',
        parts: msg.parts.map(part => {
            if (part.type === 'text') {
                return { text: part.text };
            }
            // This part is for vision, but let's stick to simple text for chat
            return { text: '[Image Content]' }; 
        })
    }));
};


export const chatWithAgent = async (history: ChatMessage[], newMessage: string): Promise<string> => {
  const chat = ai.chats.create({
    model: textModel,
    history: convertChatHistoryToContents(history.slice(0, -1)), // Exclude the new user message from history
    config: {
        systemInstruction: "You are a helpful and witty assistant for Flipper Zero hardware projects. Your name is Agent Flipper. You provide concise, accurate, and helpful information. Format your responses with markdown."
    }
  });

  const response: GenerateContentResponse = await chat.sendMessage({ message: newMessage });
  return response.text;
};

export const identifyComponent = async (base64Image: string, mimeType: string): Promise<string> => {
    const response: GenerateContentResponse = await ai.models.generateContent({
        model: visionModel,
        contents: {
            parts: [
                {
                    inlineData: {
                        mimeType: mimeType,
                        data: base64Image,
                    },
                },
                {
                    text: "Identify this electronic component. Describe its function, common use cases in DIY electronics, and any key specifications a hobbyist should know (like operating voltage). Generate a potential pinout diagram in a markdown table if it's a common IC. Provide the information in a clear, well-formatted markdown."
                }
            ]
        }
    });
    return response.text;
};

export const annotateWiring = async (base64Image: string, mimeType: string): Promise<string> => {
    const response: GenerateContentResponse = await ai.models.generateContent({
        model: visionModel,
        contents: {
            parts: [
                {
                    inlineData: {
                        mimeType: mimeType,
                        data: base64Image,
                    },
                },
                {
                    text: `Analyze this wiring diagram or breadboard layout for a DIY electronics project involving a Flipper Zero.

First, identify the main components in the image.

Then, cross-reference the wiring with the Flipper Zero's capabilities. Here is the Flipper Zero GPIO pinout for your reference:
- Left Header: 1(5V), 2(3V3), 3(PA7), 4(PA6), 5(PA4), 6(PB3), 7(PB2), 8(GND), 9(GND).
- Right Header: 10(PC3), 11(PC1), 12(PC0), 13(PB8 UART TX), 14(PB9 UART RX), 15(PC6), 16(NRST), 17(GND), 18(5V_SW).
- Important: The GPIO pins are 3.3V tolerant. Connecting them to 5V will damage the Flipper Zero.

Provide detailed feedback on the wiring, pointing out potential issues such as:
- Short circuits or incorrect connections.
- Missing pull-up/pull-down resistors where needed.
- Incorrect pin usage (e.g., using a power pin for data).
- Voltage mismatches (e.g., connecting a 5V component signal to a 3.3V Flipper pin).

If the current configuration is suboptimal or risky, suggest specific alternative wiring configurations that are safer or more efficient.

Finally, describe what annotations you would add to the image if you could. For example: "I would draw a red circle around the incorrect 5V connection to pin PA7 and add a text label suggesting a voltage divider."

Format your entire response in well-structured markdown.`
                }
            ]
        }
    });
    return response.text;
};

export const findDatasheet = async (componentName: string): Promise<{ text: string; groundingChunks?: any[] }> => {
    const response: GenerateContentResponse = await ai.models.generateContent({
        model: textModel,
        contents: `Find the datasheet for the component "${componentName}". Provide a brief summary of the component's key features from the datasheet and list any web links found. Suggest a simple wiring example for a Flipper Zero if applicable.`,
        config: {
            tools: [{ googleSearch: {} }],
        },
    });
    
    return {
        text: response.text,
        groundingChunks: response.candidates?.[0]?.groundingMetadata?.groundingChunks
    };
};

export const getPinoutInfo = async (query: string): Promise<string> => {
    const response: GenerateContentResponse = await ai.models.generateContent({
        model: textModel,
        contents: query,
        config: {
            systemInstruction: `You are a Flipper Zero GPIO expert. You have the official pinout information memorized. When asked, you provide clear, accurate information about the GPIO pins. If asked for a diagram, you will generate a markdown table representing the GPIO header. The Flipper Zero has two 9-pin headers.
            Left Header: 1(5V), 2(3V3), 3(PA7), 4(PA6), 5(PA4), 6(PB3), 7(PB2), 8(GND), 9(GND).
            Right Header: 10(PC3), 11(PC1), 12(PC0), 13(PB8 UART TX), 14(PB9 UART RX), 15(PC6), 16(NRST), 17(GND), 18(5V_SW).
            Provide details on what each pin's function is (e.g., UART, I2C, SPI, power).`
        }
    });
    return response.text;
};

export const performScan = async (scanType: 'bluetooth' | 'nfc' | 'wifi' | 'uart'): Promise<string> => {
    let prompt = '';
    switch(scanType) {
        case 'bluetooth':
            prompt = "Simulate a Bluetooth Low Energy (BLE) scan. Generate a list of 3-5 plausible nearby devices with their MAC addresses, signal strength (RSSI), and any advertised services (e.g., 'Heart Rate Monitor', 'Fitness Band'). Format as a markdown list.";
            break;
        case 'nfc':
            prompt = "Simulate scanning an NFC tag. Describe the tag type (e.g., NTAG215), its UID, and any data stored on it, like a URL or contact info (a VCard). Format as a markdown description.";
            break;
        case 'wifi':
            prompt = "Simulate a WiFi network scan. Generate a list of 5-7 nearby WiFi networks with plausible SSIDs, signal strength (RSSI), security type (e.g., WPA2, WPA3), and channel number. Format as a markdown table.";
            break;
        case 'uart':
            prompt = "Simulate listening on a serial UART connection. Generate a few lines of plausible data that might be coming from a connected device like an Arduino or GPS module. Include some raw text and maybe some sensor readings.";
            break;
    }

    const response: GenerateContentResponse = await ai.models.generateContent({
        model: textModel,
        contents: prompt,
        config: {
            systemInstruction: "You are a Flipper Zero hardware simulator. You generate realistic-looking outputs for various hardware scanning functions."
        }
    });

    return response.text;
}