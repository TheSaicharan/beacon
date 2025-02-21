// Gemini API integration for chatbot
const GEMINI_API_URL = "https://api.gemini.com/v1/chat"; // Replace with the actual Gemini API endpoint
const GEMINI_API_KEY = "AIzaSyCo-ZEW9eVIb7OCTCNKd4o0-wAtGkDecBU"; // Replace with your actual Gemini API key

// Function to send user input to Gemini API and get a response
async function sendToGeminiAPI(userInput) {
    try {
        const response = await fetch(GEMINI_API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${GEMINI_API_KEY}`,
            },
            body: JSON.stringify({
                message: userInput, // Send the user's input to the API
            }),
        });

        if (!response.ok) {
            throw new Error(`Gemini API request failed with status ${response.status}`);
        }

        const data = await response.json();
        console.log("Gemini API Response:", data); // Log the API response for debugging

        // Ensure the response contains the expected field
        if (data && data.response) {
            return data.response; // Return the chatbot's response
        } else {
            throw new Error("Invalid response format from Gemini API");
        }
    } catch (error) {
        console.error("Error communicating with Gemini API:", error);
        return null; // Return null if the API fails
    }
}

// Predefined responses for common queries
const faqResponses = {
    "hi": "Hello! How can I assist you today?",
    "hello": "Hi there! What can I do for you?",
    "courses": "You can find detailed information about courses on the Course Information page.",
    "documents": "To submit documents, go to the Document Submission page and follow the instructions.",
    "support": "For support, please contact us at support@beacon-telangana.edu.",
    "login": "Please log in to access all features. You can log in <a href='login.html'>here</a>.",
};

// Function to handle common queries
function handleCommonQueries(userInput) {
    const lowerInput = userInput.toLowerCase();
    if (lowerInput.includes("hi") || lowerInput.includes("hello")) {
        return faqResponses.hi;
    } else if (lowerInput.includes("course")) {
        return faqResponses.courses;
    } else if (lowerInput.includes("document")) {
        return faqResponses.documents;
    } else if (lowerInput.includes("support")) {
        return faqResponses.support;
    } else if (lowerInput.includes("login")) {
        return faqResponses.login;
    }
    return null; // No predefined response found
}

// Chatbot functionality
document.getElementById('send-btn')?.addEventListener('click', async () => {
    const userInput = document.getElementById('user-input').value;
    if (userInput.trim() === "") return; // Ignore empty input

    // Display user's message in the chat log
    const chatLog = document.getElementById('chat-log');
    chatLog.innerHTML += `<div class="user-message">You: ${userInput}</div>`;

    // Clear the input field
    document.getElementById('user-input').value = "";

    // Show typing indicator
    chatLog.innerHTML += `<div class="bot-message typing-indicator">Beacon is typing...</div>`;
    chatLog.scrollTop = chatLog.scrollHeight;

    // Check for predefined responses first
    const predefinedResponse = handleCommonQueries(userInput);
    if (predefinedResponse) {
        // Remove typing indicator and display response
        document.querySelector('.typing-indicator').remove();
        chatLog.innerHTML += `<div class="bot-message">Beacon: ${predefinedResponse}</div>`;
    } else {
        // Send user input to Gemini API and get a response
        const botResponse = await sendToGeminiAPI(userInput);

        // Remove typing indicator
        document.querySelector('.typing-indicator').remove();

        if (botResponse) {
            // Display the chatbot's response
            chatLog.innerHTML += `<div class="bot-message">Beacon: ${botResponse}</div>`;
        } else {
            // Fallback response if API fails
            chatLog.innerHTML += `<div class="bot-message">Beacon: I'm having trouble understanding. Can you please rephrase your question?</div>`;
        }
    }

    // Scroll to the bottom of the chat log
    chatLog.scrollTop = chatLog.scrollHeight;
});