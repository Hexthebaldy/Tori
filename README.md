1. Product Overview
1.1. Vision
The ultimate vision for this product is to be a "zero-interface, AI-driven, low-cognitive-load note-taking application"—a true "sanctuary for thoughts." Through intelligent background processing, it frees users from the burdensome task of organizing notes, allowing them to focus purely on thinking and capturing their ideas.

1.2. MVP Goal
The goal of this MVP is to validate the product's core interaction loop: frictionless capture -> AI-assisted organization. We will focus on implementing the most fundamental features: note-taking, local storage, and automatic classification and tagging via an external Large Language Model (LLM) API. With this version, we aim to test the following hypotheses:

Users will accept and enjoy an extremely simplified, minimalist note-taking experience.

The accuracy of AI-generated tags and categories is sufficient to begin replacing manual organization efforts.

1.3. Target Audience
Individuals seeking efficiency and a reduction in the mental burden of information management, such as knowledge workers, students, and creative professionals. They require a tool that allows for the rapid capture of ideas and effortless retrieval.

2. Core Design Principles (Following the Blueprint)
Minimalist Input: The user interface is entirely in service of content creation, eliminating all unnecessary visual distractions. Open the app and start writing.

Local-First, Privacy-First: The MVP will not have a server-side component. All user data, including note content and AI-processed results, will be stored locally on the user's computer, ensuring absolute privacy and security.

Intelligent Assistance, Not Interference: The AI operates silently in the background. Its outputs are presented as suggestions, leaving the final control in the user's hands. This prevents flawed AI judgments from disrupting the user experience.

3. Technical Stack and Architecture
Framework: Electron + React + TypeScript.

UI Library: Options like MUI or Ant Design can be used, but they will require heavy customization to align with the minimalist aesthetic.

State Management: Redux Toolkit or Zustand.

Local Storage:

Note Files: Directly using Node.js's fs module to store notes as Markdown or JSON files within the application's data directory. This is the most direct approach and aligns with the "local-first" principle.

Configuration Data (e.g., API Key): Using electron-store for simple key-value storage, or keytar to access the operating system's secure credential manager.

