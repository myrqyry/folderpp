// Gemini API Integration
import { setMessage } from './utils.js';

const GEMINI_API_KEY_STORAGE = 'gemini_api_key';
const GEMINI_API_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

// Get DOM elements
const apiKeyInput = document.getElementById('geminiApiKey');
const toggleVisibilityBtn = document.getElementById('toggleApiKeyVisibility');
const eyeIcon = document.getElementById('eyeIcon');
const saveApiKeyBtn = document.getElementById('saveApiKey');
const testApiKeyBtn = document.getElementById('testApiKey');
const clearApiKeyBtn = document.getElementById('clearApiKey');
const apiKeyStatus = document.getElementById('apiKeyStatus');

// Load saved API key on page load
export function loadGeminiApiKey() {
    try {
        const savedKey = localStorage.getItem(GEMINI_API_KEY_STORAGE);
        if (savedKey && apiKeyInput) {
            apiKeyInput.value = savedKey;
            updateApiKeyStatus('🔑 API key loaded from storage', 'success');
        }
    } catch (error) {
        console.error('Error loading Gemini API key:', error);
    }
}

// Save API key to localStorage
function saveGeminiApiKey() {
    const apiKey = apiKeyInput?.value?.trim();
    
    if (!apiKey) {
        updateApiKeyStatus('❌ Please enter an API key', 'error');
        return;
    }
    
    if (!apiKey.startsWith('AIza')) {
        updateApiKeyStatus('⚠️ API key should start with "AIza"', 'warning');
        return;
    }
    
    try {
        localStorage.setItem(GEMINI_API_KEY_STORAGE, apiKey);
        updateApiKeyStatus('✅ API key saved successfully', 'success');
        setMessage('🔑 Gemini API key saved!', 'success');
        
        // Dispatch custom event to notify other modules
        window.dispatchEvent(new CustomEvent('geminiApiKeyChanged'));
    } catch (error) {
        console.error('Error saving API key:', error);
        updateApiKeyStatus('❌ Failed to save API key', 'error');
    }
}

// Test API key connection
async function testGeminiApiKey() {
    const apiKey = apiKeyInput?.value?.trim();
    
    if (!apiKey) {
        updateApiKeyStatus('❌ Please enter an API key to test', 'error');
        return;
    }
    
    updateApiKeyStatus('🔄 Testing connection...', 'info');
    
    try {
        const response = await fetch(`${GEMINI_API_ENDPOINT}?key=${apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: 'Hello! This is a test to verify the API connection. Please respond with just "OK".'
                    }]
                }],
                generationConfig: {
                    maxOutputTokens: 10
                }
            })
        });
        
        if (response.ok) {
            const data = await response.json();
            if (data.candidates && data.candidates.length > 0) {
                updateApiKeyStatus('✅ API key is valid and working!', 'success');
                setMessage('🤖 Gemini API connection successful!', 'success');
            } else {
                updateApiKeyStatus('⚠️ Unexpected response format', 'warning');
            }
        } else if (response.status === 400) {
            updateApiKeyStatus('❌ Invalid API key or request', 'error');
        } else if (response.status === 403) {
            updateApiKeyStatus('❌ API key lacks permissions', 'error');
        } else {
            updateApiKeyStatus(`❌ Connection failed (${response.status})`, 'error');
        }
    } catch (error) {
        console.error('API test error:', error);
        updateApiKeyStatus('❌ Connection test failed', 'error');
    }
}

// Clear API key
function clearGeminiApiKey() {
    if (apiKeyInput) {
        apiKeyInput.value = '';
    }
    
    try {
        localStorage.removeItem(GEMINI_API_KEY_STORAGE);
        updateApiKeyStatus('🗑️ API key cleared', 'info');
        setMessage('🔑 Gemini API key cleared', 'info');
        
        // Dispatch custom event to notify other modules
        window.dispatchEvent(new CustomEvent('geminiApiKeyChanged'));
    } catch (error) {
        console.error('Error clearing API key:', error);
    }
}

// Toggle password visibility
function toggleApiKeyVisibility() {
    if (!apiKeyInput || !eyeIcon) return;
    
    if (apiKeyInput.type === 'password') {
        apiKeyInput.type = 'text';
        eyeIcon.textContent = '🙈';
    } else {
        apiKeyInput.type = 'password';
        eyeIcon.textContent = '👁️';
    }
}

// Update status message
function updateApiKeyStatus(message, type = 'info') {
    if (!apiKeyStatus) return;
    
    apiKeyStatus.textContent = message;
    apiKeyStatus.className = `text-xs ${getStatusClass(type)}`;
    apiKeyStatus.classList.remove('hidden');
    
    // Auto-hide success/info messages after 3 seconds
    if (type === 'success' || type === 'info') {
        setTimeout(() => {
            if (apiKeyStatus) {
                apiKeyStatus.classList.add('hidden');
            }
        }, 3000);
    }
}

// Get CSS class for status type
function getStatusClass(type) {
    switch (type) {
        case 'success':
            return 'text-[var(--green)] bg-[var(--green)]/10 px-2 py-1 rounded border border-[var(--green)]/20';
        case 'error':
            return 'text-[var(--red)] bg-[var(--red)]/10 px-2 py-1 rounded border border-[var(--red)]/20';
        case 'warning':
            return 'text-[var(--yellow)] bg-[var(--yellow)]/10 px-2 py-1 rounded border border-[var(--yellow)]/20';
        case 'info':
        default:
            return 'text-[var(--blue)] bg-[var(--blue)]/10 px-2 py-1 rounded border border-[var(--blue)]/20';
    }
}

// Get current API key
export function getGeminiApiKey() {
    return localStorage.getItem(GEMINI_API_KEY_STORAGE);
}

// Check if API key is configured
export function isGeminiApiKeyConfigured() {
    const key = getGeminiApiKey();
    return key && key.trim().length > 0;
}

// Suggest colors from image using Gemini API
export async function suggestColorsFromImage(imageBase64) {
    const apiKey = getGeminiApiKey();
    
    if (!apiKey) {
        throw new Error('No API key configured. Please add your Gemini API key in the Advanced section.');
    }
    
    const prompt = `Analyze this image and suggest 4-6 beautiful, harmonious colors that would work well for a folder icon design. The colors should be modern and visually appealing. Respond with ONLY a JSON array of hex color codes (including the # symbol), like this: ["#color1", "#color2", "#color3", "#color4", "#color5", "#color6"]. Do not include any other text or explanation.`;
    
    try {
        const response = await fetch(`${GEMINI_API_ENDPOINT}?key=${apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [
                        {
                            text: prompt
                        },
                        {
                            inline_data: {
                                mime_type: "image/jpeg",
                                data: imageBase64.replace(/^data:image\/[a-z]+;base64,/, '')
                            }
                        }
                    ]
                }],
                generationConfig: {
                    maxOutputTokens: 100,
                    temperature: 0.4
                }
            })
        });
        
        if (!response.ok) {
            throw new Error(`API request failed: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        
        if (!data.candidates || data.candidates.length === 0) {
            throw new Error('No response from Gemini API');
        }
        
        const responseText = data.candidates[0].content.parts[0].text.trim();
        
        // Try to extract JSON array from the response
        const jsonMatch = responseText.match(/\[.*\]/);
        if (!jsonMatch) {
            throw new Error('Invalid response format from API');
        }
        
        const colors = JSON.parse(jsonMatch[0]);
        
        // Validate that we got an array of hex colors
        if (!Array.isArray(colors) || colors.length === 0) {
            throw new Error('No colors returned from API');
        }
        
        // Validate each color is a valid hex code
        const validColors = colors.filter(color => /^#[0-9A-Fa-f]{6}$/.test(color));
        
        if (validColors.length === 0) {
            throw new Error('No valid hex colors returned from API');
        }
        
        return validColors;
        
    } catch (error) {
        console.error('Error suggesting colors from image:', error);
        throw error;
    }
}

// Setup event listeners
export function setupGeminiApiControls() {
    console.log('🔧 Setting up Gemini API controls...');
    
    if (saveApiKeyBtn) {
        saveApiKeyBtn.addEventListener('click', saveGeminiApiKey);
    }
    
    if (testApiKeyBtn) {
        testApiKeyBtn.addEventListener('click', testGeminiApiKey);
    }
    
    if (clearApiKeyBtn) {
        clearApiKeyBtn.addEventListener('click', clearGeminiApiKey);
    }
    
    if (toggleVisibilityBtn) {
        toggleVisibilityBtn.addEventListener('click', toggleApiKeyVisibility);
    }
    
    // Load saved key
    loadGeminiApiKey();
    
    console.log('✅ Gemini API controls setup complete');
}
