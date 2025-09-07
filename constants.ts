
import type { ProjectFile, ChatMessage, FileKey } from './types';
import { MessageRole } from './types';

export const PROJECT_FILES: Record<FileKey, ProjectFile> = {
  'main.py': {
    key: 'main.py',
    name: 'main.py',
    language: 'python',
    content: `
# Flipper Zero DIY Agent
# main.py: Entry point for the agent orchestration.

import agent_cli
from pinout_generator import PinoutGenerator
from hardware_camera_recognition import HardwareRecognizer
from datasheet_search import DatasheetSearcher
from wiring_annotation import WiringAnnotator

# %%

class DIYAgent:
    def __init__(self):
        self.cli = agent_cli.AgentCLI()
        self.pinout_gen = PinoutGenerator()
        self.recognizer = HardwareRecognizer()
        self.datasheet_search = DatasheetSearcher()
        self.wiring_annotator = WiringAnnotator()

    def run(self):
        self.cli.display_welcome()
        # Main agent loop would be here
        pass

# %%

if __name__ == "__main__":
    agent = DIYAgent()
    agent.run()
`,
  },
  'agent_cli.py': {
    key: 'agent_cli.py',
    name: 'agent_cli.py',
    language: 'python',
    content: `
# agent_cli.py: Handles command-line interaction with the user.

class AgentCLI:
    def display_welcome(self):
        print("Welcome to the Flipper Zero DIY Agent!")
        print("I'm here to help you with your hardware projects.")

    def get_user_input(self, prompt):
        return input(prompt)

    def display_response(self, response):
        print(f"Agent: {response}")

# %%
# Import all other agent modules to make them accessible from the CLI.
# Note: In a real application, you might not import 'main' here,
# but it's included for completeness. The 'agent_cli' is omitted
# as we are already in that file.
from main import DIYAgent
from pinout_generator import PinoutGenerator
from hardware_camera_recognition import HardwareRecognizer
from datasheet_search import DatasheetSearcher
from wiring_annotation import WiringAnnotator

print("All agent modules imported successfully.")

# %%
# This is the general-purpose chat agent.
# You can ask me about the project structure, how the files relate,
# or for ideas on your next Flipper Zero project.
`,
  },
  'pinout_generator.py': {
    key: 'pinout_generator.py',
    name: 'pinout_generator.py',
    language: 'python',
    content: `
# pinout_generator.py: Generates and displays Flipper Zero pinouts.

class PinoutGenerator:
    def __init__(self):
        # Pinout data for Flipper Zero GPIO
        self.gpio_pins = {
            "1": "EXT_5V (Out)",
            "2": "EXT_3V3 (Out)",
            "3": "PA7 (USART_TX)",
            "4": "PA6 (USART_RX)",
            # ... and so on for all 18 pins
        }

    def get_pinout_diagram(self):
        # In a real app, this might generate an image
        return "Flipper Zero GPIO Pinout..."

    def get_pin_info(self, pin_number):
        return self.gpio_pins.get(str(pin_number), "Unknown pin")

# %%
# Use the chat below to ask me about Flipper Zero's GPIO pins.
# For example: 'Show me the pinout for the GPIO header' or 'What is pin 7?'
`,
  },
  'hardware_camera_recognition.py': {
    key: 'hardware_camera_recognition.py',
    name: 'hardware_camera_recognition.py',
    language: 'python',
    content: `
# hardware_camera_recognition.py: Uses a camera to identify components.
# This would use a vision model API.

class HardwareRecognizer:
    def __init__(self, api_key):
        self.api_key = api_key
        # self.vision_client = VisionAPIClient(api_key)

    def identify_component_from_image(self, image_data):
        # prompt = "Identify this electronic component..."
        # response = self.vision_client.recognize(image_data, prompt)
        # return response.get('component_name')
        pass

# %%
# Install necessary libraries for image processing and OCR
!pip install opencv-python pillow pytesseract

# %%
# Cell 3: Image Capture and Upload
# This cell demonstrates the logic for capturing an image from a camera
# or handling a file upload, which would then be passed to the HardwareRecognizer.

import cv2 # OpenCV for camera access
from PIL import Image # Pillow for image manipulation

def get_image_from_camera():
    """
    Placeholder function to capture an image from a connected webcam.
    In a real implementation, this would access the camera hardware,
    capture a frame, and return it as an image object.
    """
    print("Accessing webcam...")
    # cap = cv2.VideoCapture(0)
    # ret, frame = cap.read()
    # cap.release()
    # return Image.fromarray(cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)) if ret else None
    print("Image captured from webcam. (Simulated)")
    return "path/to/simulated_webcam_capture.jpg"


def get_image_from_upload():
    """
    Placeholder function to handle a file upload.
    In a notebook, this might use a widget. In a script, it might take a file path.
    """
    # This would typically open a file dialog or handle a web form upload.
    file_path = input("Enter the path to your image file: ")
    # return Image.open(file_path)
    print(f"Image loaded from {file_path}. (Simulated)")
    return file_path


# --- Example Usage ---
# To use, you would call one of these functions. For example:
# component_image = get_image_from_camera()
# recognizer.identify_component_from_image(component_image)

print("This cell contains helper functions for image acquisition.")

# %%
# Cell 4: OCR Recognition and Analysis
# This cell contains functions to perform Optical Character Recognition (OCR)
# on an image to extract text, such as component markings, and then
# filter that text to identify potential component names.

import pytesseract
from PIL import Image

def extract_text_from_image(image_path):
    """
    Uses pytesseract to perform OCR on a given image file and returns the
    extracted text.
    """
    print(f"Performing OCR on {image_path}...")
    # In a real implementation:
    # try:
    #     image = Image.open(image_path)
    #     text = pytesseract.image_to_string(image)
    #     print("OCR complete.")
    #     return text
    # except Exception as e:
    #     print(f"OCR failed: {e}")
    #     return ""
    print("OCR complete. (Simulated)")
    # Simulate finding common markings on a microcontroller
    return "STM32F103C8T6\\nARM Cortex-M3\\nLQFP48 72MHz"

def filter_component_markings(ocr_text):
    """
    Filters the raw OCR text to find potential component part numbers.
    This is a simplified example; a real implementation would use more
    robust regex and pattern matching.
    """
    print("Filtering for component markings...")
    potential_markings = []
    # Simple heuristic: Look for alphanumeric strings with a mix of letters and numbers
    for line in ocr_text.split('\\n'):
        if any(char.isdigit() for char in line) and any(char.isalpha() for char in line):
             # Further filtering could be done here (e.g., check length, common prefixes)
            potential_markings.append(line.strip())
    
    if potential_markings:
        print(f"Found potential markings: {potential_markings}")
        return potential_markings[0] # Return the most likely candidate
    else:
        print("No likely component markings found.")
        return None

# --- Example Usage ---
# image_file = "path/to/your/component.jpg"
# raw_text = extract_text_from_image(image_file)
# component_name = filter_component_markings(raw_text)
# if component_name:
#     print(f"Identified component: {component_name}")

print("This cell provides OCR and text filtering capabilities.")

# %%
# Cell 5: Wiring and Datasheet Recommendation
# After a component is identified via OCR, this cell helps you find its
# datasheet and suggests how to wire it up to the Flipper Zero.

class WiringHelper:
    def find_datasheet_for_component(self, component_name):
        """
        Simulates searching for a datasheet online.
        In a real agent, this would integrate with the DatasheetSearcher.
        """
        print(f"Searching for datasheet for {component_name}...")
        # Simulate finding a link
        datasheet_url = f"https://www.example-datasheets.com/{component_name}.pdf"
        print(f"Datasheet found: {datasheet_url}")
        return datasheet_url

    def generate_pinout(self, component_name):
        """
        Provides a mock pinout for a known component.
        A more advanced implementation would parse the datasheet.
        """
        print(f"Generating pinout for {component_name}...")
        if "STM32" in component_name:
            print("Pin 1: VDD, Pin 2: PC13, Pin 3: PC14, ... (Example Pinout)")
        else:
            print("Pinout data not available for this component.")

    def suggest_wiring(self, component_name):
        """
        Suggests basic wiring to a Flipper Zero.
        """
        print(f"Generating Flipper Zero wiring suggestions for {component_name}...")
        if "STM32" in component_name:
            print("- Connect VDD pin to Flipper's 3.3V pin.")
            print("- Connect GND pin to Flipper's GND pin.")
            print("- Connect SWDIO to Flipper's SWD a pin.")
            print("- Connect SWCLK to Flipper's SWC pin.")
        else:
            print("No specific wiring suggestions available.")

# --- Example Usage ---
# identified_component = "STM32F103C8T6"
# helper = WiringHelper()
# helper.find_datasheet_for_component(identified_component)
# helper.generate_pinout(identified_component)
# helper.suggest_wiring(identified_component)

print("This cell provides helpers for datasheets, pinouts, and wiring.")

# %%
# Cell 6: Annotated Image Output
# This cell demonstrates how to take the analysis results and overlay them
# visually onto the original component image.

from PIL import Image, ImageDraw, ImageFont

def annotate_image(image_path, component_name, pin_info):
    """
    Draws component names and pin information onto an image.
    In a real implementation, you'd need coordinates for the component/pins.
    """
    print(f"Annotating image: {image_path}")
    # try:
    #     with Image.open(image_path) as img:
    #         draw = ImageDraw.Draw(img)
    #         # Use a default font or specify a path
    #         # font = ImageFont.truetype("arial.ttf", 15)
    #
    #         # Example: Draw a box and label for the component
    #         # These coordinates would come from an object detection model
    #         component_box = [50, 50, 250, 150]
    #         draw.rectangle(component_box, outline="red", width=2)
    #         draw.text((component_box[0], component_box[1] - 20), component_name, fill="red") #, font=font
    #
    #         # Example: Draw labels for pins
    #         for pin_coord, pin_label in pin_info.items():
    #             draw.text(pin_coord, pin_label, fill="yellow") #, font=font
    #
    #         annotated_path = "path/to/annotated_image.jpg"
    #         # img.save(annotated_path)
    #         print(f"Saved annotated image to {annotated_path} (Simulated)")
    #         return annotated_path
    # except Exception as e:
    #     print(f"Failed to annotate image: {e}")
    #     return None
    print("Annotation complete. (Simulated)")
    return "path/to/simulated_annotated_image.jpg"

# --- Example Usage ---
# image_file = "path/to/your/component.jpg"
# component_id = "STM32F103C8T6"
# pin_data = {(250, 60): "PIN 1 (VDD)", (250, 80): "PIN 2"}
# annotate_image(image_file, component_id, pin_data)

print("This cell provides image annotation capabilities.")

# %%
# Cell 7: Pattern Stubs for Flipper Zero Hardware Interaction
# These functions serve as placeholders for future expansions where the
# agent could directly interact with a connected Flipper Zero device
# to perform scans or read data.

def scan_bluetooth():
    """Placeholder for Bluetooth Low Energy (BLE) scanning."""
    print("Simulating Bluetooth scan...")
    # Flipper.ble.scan()
    print("Found devices: 'TempSensor', 'SmartLock'")
    pass

def scan_nfc():
    """Placeholder for NFC tag reading."""
    print("Simulating NFC scan...")
    # Flipper.nfc.read()
    print("Found NFC Tag: Type A, UID: 01:23:45:67")
    pass
    
def read_from_serial():
    """Placeholder for reading data from UART."""
    print("Simulating reading from Serial (UART)...")
    # Flipper.uart.read()
    print("Received data: 'Hello from Arduino!'")
    pass

def scan_wifi():
    """Placeholder for WiFi network scanning."""
    print("Simulating WiFi scan...")
    # Flipper.wifi.scan()
    print("Found networks: 'Home-WiFi', 'CoffeeShop_Guest'")
    pass

# --- Example Usage ---
# scan_bluetooth()
# scan_nfc()

print("This cell contains stubs for direct Flipper Zero hardware interactions.")

# %%
# Use the upload button in the chat below to send a picture of an
# electronic component. I'll use OCR to read its markings and identify it for you.
`,
  },
  'datasheet_search.py': {
    key: 'datasheet_search.py',
    name: 'datasheet_search.py',
    language: 'python',
    content: `
# datasheet_search.py: Finds datasheets for identified components.

import requests

class DatasheetSearcher:
    def __init__(self):
        self.search_engine_url = "https://api.search.com/v1"

    def find_datasheet(self, component_name):
        # params = {'q': f"{component_name} datasheet filetype:pdf"}
        # response = requests.get(self.search_engine_url, params=params)
        # return response.json()['results'][0]['url']
        pass
# %%
# Tell me the name of a component, and I'll use Google Search
# to find its datasheet and provide a summary.
# For example: 'Find the datasheet for BC547 transistor'.
`,
  },
  'wiring_annotation.py': {
    key: 'wiring_annotation.py',
    name: 'wiring_annotation.py',
    language: 'python',
    content: `
# wiring_annotation.py: Analyzes and annotates wiring diagrams.

class WiringAnnotator:
    def __init__(self, api_key):
        self.api_key = api_key
        # self.vision_client = VisionAPIClient(api_key)

    def analyze_diagram(self, diagram_image):
        """
        Analyzes a wiring diagram image.
        - Identifies components and their connections.
        - Cross-references connections with Flipper Zero's known capabilities,
          including pin functions and voltage limits (e.g., 3.3V tolerance).
        - Identifies potential issues like short circuits, incorrect voltages,
          or missing components (e.g., pull-up resistors).
        - Suggests alternative, safer, or more optimal wiring configurations.
        """
        # prompt = """
        # Analyze this wiring diagram for a Flipper Zero project.
        # Cross-reference with Flipper's 3.3V GPIO limits.
        # Suggest improvements and point out risks.
        # """
        # analysis = self.vision_client.analyze(diagram_image, prompt)
        # return analysis
        pass

# %%
# Upload a photo of your breadboard or a schematic diagram.
# I will analyze the wiring and provide feedback and suggestions.
`,
  },
};

export const INITIAL_MESSAGES: Record<FileKey, ChatMessage[]> = {
  'agent_cli.py': [
    { role: MessageRole.ASSISTANT, parts: [{ type: 'text', text: "Welcome to the Flipper Zero DIY Agent! I'm your assistant for hardware projects. How can I help you today?" }] },
  ],
  'main.py': [
    { role: MessageRole.ASSISTANT, parts: [{ type: 'text', text: "This is the main entry point of the agent. From here, all other modules are orchestrated. Ask me about the project structure or what a specific file does." }] },
  ],
  'pinout_generator.py': [
    { role: MessageRole.ASSISTANT, parts: [{ type: 'text', text: "Ask me about Flipper Zero's GPIO pins! For example, 'Show me the pinout for the GPIO header' or 'What is pin 13 used for?'" }] },
  ],
  'hardware_camera_recognition.py': [
    { role: MessageRole.ASSISTANT, parts: [{ type: 'text', text: "I can identify electronic components. Please upload a clear picture of the component you want to know about." }] },
  ],
  'datasheet_search.py': [
    { role: MessageRole.ASSISTANT, parts: [{ type: 'text', text: "Need a datasheet? Just tell me the name of the component, for example, 'Find the datasheet for ESP32-WROOM-32'." }] },
  ],
  'wiring_annotation.py': [
    { role: MessageRole.ASSISTANT, parts: [{ type: 'text', text: "Let's check your wiring diagram. Upload an image of your schematic or breadboard layout, and I'll analyze it for you." }] },
  ],
};
