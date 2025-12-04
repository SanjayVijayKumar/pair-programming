// Configuration
const CONFIG = {
    apiUrl: 'http://localhost:8000/api',
    wsUrl: 'ws://localhost:8000/api',
};

// State Management
let state = {
    roomId: null,
    userId: `user-${Math.random().toString(36).substr(2, 9)}`,
    code: '',
    language: 'python',
    isConnected: false,
    ws: null,
    userCursors: {},
    usersTyping: {},
    activeUsers: 0,
    currentSuggestion: null,
};

const userColors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F'];
let colorIndex = 0;

// DOM Elements
const elements = {
    roomId: document.getElementById('roomId'),
    codeEditor: document.getElementById('codeEditor'),
    createRoomBtn: document.getElementById('createRoomBtn'),
    joinRoomBtn: document.getElementById('joinRoomBtn'),
    joinRoomId: document.getElementById('joinRoomId'),
    userCount: document.getElementById('userCount'),
    statusText: document.getElementById('statusText'),
    statusIndicator: document.querySelector('.status-indicator'),
    typingIndicator: document.getElementById('typingIndicator'),
    activeUsers: document.getElementById('activeUsers'),
    cursorLegend: document.getElementById('cursorLegend'),
    autocompleteSection: document.getElementById('autocompleteSection'),
    typedText: document.getElementById('typedText'),
    suggestionText: document.getElementById('suggestionText'),
    dismissSuggestion: document.getElementById('dismissSuggestion'),
    connectionStatus: document.getElementById('connectionStatus'),
    syncStatus: document.getElementById('syncStatus'),
    lineNo: document.getElementById('lineNo'),
    colNo: document.getElementById('colNo'),
    cursorPos: document.getElementById('cursorPos'),
    shareRoomBtn: document.getElementById('shareRoomBtn'),
    toast: document.getElementById('toast'),
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
    loadRoomFromURL();
    // Auto-create room if no room exists
    if (!state.roomId) {
        createRoom();
    }
});

// Event Listeners Setup
function setupEventListeners() {
    elements.createRoomBtn.addEventListener('click', createRoom);
    elements.joinRoomBtn.addEventListener('click', joinRoom);
    elements.shareRoomBtn.addEventListener('click', shareRoom);
    elements.codeEditor.addEventListener('input', handleCodeChange);
    elements.codeEditor.addEventListener('keydown', handleEditorKeyDown);
    elements.codeEditor.addEventListener('keyup', updateCursorPosition);
    elements.codeEditor.addEventListener('click', updateCursorPosition);
    elements.dismissSuggestion.addEventListener('click', dismissSuggestion);
    window.addEventListener('beforeunload', () => {
        if (state.ws) {
            state.ws.close();
        }
    });
}

// Create New Room
async function createRoom() {
    try {
        elements.createRoomBtn.disabled = true;
        elements.createRoomBtn.textContent = 'Creating...';

        const response = await fetch(`${CONFIG.apiUrl}/rooms`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
        });

        if (!response.ok) throw new Error('Failed to create room');

        const data = await response.json();
        state.roomId = data.room_id;
        updateURL();
        connectWebSocket();
        showToast(`Room created! ID: ${state.roomId.slice(0, 8)}...`, 'success');
    } catch (error) {
        console.error('Error creating room:', error);
        showToast('Failed to create room', 'error');
    } finally {
        elements.createRoomBtn.disabled = false;
        elements.createRoomBtn.textContent = 'Create New Room';
    }
}

// Join Room
function joinRoom() {
    const roomId = elements.joinRoomId.value.trim();
    if (!roomId) {
        showToast('Please enter a Room ID', 'error');
        return;
    }

    state.roomId = roomId;
    updateURL();
    connectWebSocket();
    elements.joinRoomId.value = '';
    showToast(`Joined room: ${roomId.slice(0, 8)}...`, 'success');
}

// Connect WebSocket
function connectWebSocket() {
    if (!state.roomId) return;

    const wsUrl = `${CONFIG.wsUrl}/ws/${state.roomId}`;
    
    try {
        state.ws = new WebSocket(wsUrl);

        state.ws.onopen = () => {
            console.log('WebSocket connected');
            updateConnectionStatus(true);
            
            // Send init message with user ID
            sendWebSocketMessage({
                type: 'init',
                userId: state.userId,
            });
        };

        state.ws.onmessage = (event) => {
            handleWebSocketMessage(JSON.parse(event.data));
        };

        state.ws.onerror = (error) => {
            console.error('WebSocket error:', error);
            updateConnectionStatus(false);
        };

        state.ws.onclose = () => {
            console.log('WebSocket closed');
            updateConnectionStatus(false);
        };
    } catch (error) {
        console.error('Failed to connect WebSocket:', error);
        updateConnectionStatus(false);
    }
}

// Handle WebSocket Messages
function handleWebSocketMessage(message) {
    switch (message.type) {
        case 'init':
            state.code = message.code;
            elements.codeEditor.value = state.code;
            state.language = message.language || 'python';
            break;

        case 'code_update':
            if (message.user_id !== state.userId) {
                const cursorPos = elements.codeEditor.selectionStart;
                state.code = message.code;
                elements.codeEditor.value = state.code;
                updateSyncStatus('syncing');
                setTimeout(() => updateSyncStatus('synced'), 500);
            }
            break;

        case 'cursor_update':
            if (message.user_id !== state.userId) {
                state.userCursors[message.user_id] = message.cursor_position;
                updateCursorLegend();
            }
            break;

        case 'typing':
            console.log('Typing update:', message.user_id, message.is_typing);
            state.usersTyping[message.user_id] = message.is_typing;
            updateTypingIndicator();
            break;

        case 'user_joined':
            console.log('User joined:', message.user_id, 'Total users:', message.active_users);
            state.activeUsers = message.active_users;
            updateUserCount();
            showToast('User joined the room', 'success');
            break;

        case 'user_left':
            delete state.userCursors[message.user_id];
            delete state.usersTyping[message.user_id];
            state.activeUsers = message.active_users;
            updateUserCount();
            updateCursorLegend();
            showToast('User left the room', 'success');
            break;

        case 'error':
            showToast(message.message, 'error');
            break;
    }
}

// Send WebSocket Message
function sendWebSocketMessage(message) {
    if (state.ws && state.ws.readyState === WebSocket.OPEN) {
        state.ws.send(JSON.stringify(message));
    }
}

// Handle Code Changes
let codeChangeTimeout;
function handleCodeChange() {
    state.code = elements.codeEditor.value;
    
    updateSyncStatus('syncing');
    
    clearTimeout(codeChangeTimeout);
    codeChangeTimeout = setTimeout(() => {
        // Send typing status
        sendWebSocketMessage({
            type: 'typing',
            userId: state.userId,
            isTyping: true,
        });

        // Send code update (debounced)
        sendWebSocketMessage({
            type: 'code_update',
            userId: state.userId,
            code: state.code,
            timestamp: Date.now(),
        });

        // Fetch autocomplete suggestion
        fetchAutocomplete();

        // Stop typing after delay
        setTimeout(() => {
            sendWebSocketMessage({
                type: 'typing',
                userId: state.userId,
                isTyping: false,
            });
        }, 600);

        updateSyncStatus('synced');
    }, 300);
    
    // Send cursor update immediately
    sendWebSocketMessage({
        type: 'cursor_update',
        userId: state.userId,
        cursorPosition: elements.codeEditor.selectionStart,
    });
}

// Handle Editor Key Down (for Tab and Enter to accept suggestions)
function handleEditorKeyDown(event) {
    // Accept suggestion with Tab or Ctrl+Enter
    if ((event.key === 'Tab' || (event.key === 'Enter' && event.ctrlKey)) && 
        state.currentSuggestion && 
        elements.autocompleteSection.style.display !== 'none') {
        
        event.preventDefault();
        acceptSuggestion();
    }
}

// Update Cursor Position
function updateCursorPosition() {
    const cursorPos = elements.codeEditor.selectionStart;
    const textBeforeCursor = elements.codeEditor.value.substring(0, cursorPos);
    
    const lineNo = textBeforeCursor.split('\n').length;
    const colNo = textBeforeCursor.split('\n').pop().length;
    
    elements.lineNo.textContent = lineNo;
    elements.colNo.textContent = colNo;
    elements.cursorPos.textContent = `${lineNo}:${colNo}`;

    // Send cursor update (debounced)
    clearTimeout(window.cursorUpdateTimeout);
    window.cursorUpdateTimeout = setTimeout(() => {
        sendWebSocketMessage({
            type: 'cursor_update',
            userId: state.userId,
            cursorPosition: cursorPos,
        });
    }, 500);
}

// Fetch Autocomplete
async function fetchAutocomplete() {
    try {
        const response = await fetch(`${CONFIG.apiUrl}/autocomplete`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                code: state.code,
                cursor_position: elements.codeEditor.selectionStart,
                language: state.language,
            }),
        });

        if (!response.ok) throw new Error('Failed to fetch autocomplete');

        const data = await response.json();
        showAutocomplete(data.suggestion);
    } catch (error) {
        console.error('Error fetching autocomplete:', error);
    }
}

// Show Autocomplete
function showAutocomplete(suggestion) {
    if (suggestion && suggestion !== '...' && suggestion.trim() !== '') {
        state.currentSuggestion = suggestion;
        
        // Get the current text before cursor
        const cursorPos = elements.codeEditor.selectionStart;
        const textBeforeCursor = elements.codeEditor.value.substring(0, cursorPos);
        const lastSpaceIndex = textBeforeCursor.lastIndexOf(' ');
        const lastNewlineIndex = textBeforeCursor.lastIndexOf('\n');
        const lastBreakIndex = Math.max(lastSpaceIndex, lastNewlineIndex);
        const lastWord = lastBreakIndex === -1 
            ? textBeforeCursor 
            : textBeforeCursor.substring(lastBreakIndex + 1);
        
        // Show typed text and gray suggestion
        elements.typedText.textContent = lastWord;
        elements.suggestionText.textContent = suggestion;
        elements.autocompleteSection.style.display = 'block';
    } else {
        elements.autocompleteSection.style.display = 'none';
        state.currentSuggestion = null;
    }
}

// Accept Suggestion (Tab or Ctrl+Enter)
function acceptSuggestion() {
    if (!state.currentSuggestion) return;
    
    const cursorPos = elements.codeEditor.selectionStart;
    const textBeforeCursor = elements.codeEditor.value.substring(0, cursorPos);
    const textAfterCursor = elements.codeEditor.value.substring(cursorPos);
    
    // Find the last word to replace
    const lastSpaceIndex = textBeforeCursor.lastIndexOf(' ');
    const lastNewlineIndex = textBeforeCursor.lastIndexOf('\n');
    const lastBreakIndex = Math.max(lastSpaceIndex, lastNewlineIndex);
    const insertPosition = lastBreakIndex + 1;
    
    // Insert suggestion
    const newCode = textBeforeCursor + state.currentSuggestion + textAfterCursor;
    elements.codeEditor.value = newCode;
    
    // Update cursor position after suggestion
    const newCursorPos = cursorPos + state.currentSuggestion.length;
    elements.codeEditor.selectionStart = newCursorPos;
    elements.codeEditor.selectionEnd = newCursorPos;
    
    // Dismiss suggestion and trigger code change
    dismissSuggestion();
    handleCodeChange();
}

// Dismiss Autocomplete
function dismissSuggestion() {
    elements.autocompleteSection.style.display = 'none';
}

// Update Connection Status
function updateConnectionStatus(isConnected) {
    state.isConnected = isConnected;
    const statusIndicator = document.querySelector('.status-indicator');
    
    if (isConnected) {
        statusIndicator.style.color = '#10b981';
        elements.statusText.textContent = 'Connected';
        elements.connectionStatus.textContent = 'Connected';
        elements.connectionStatus.classList.remove('disconnected');
    } else {
        statusIndicator.style.color = '#ef4444';
        elements.statusText.textContent = 'Disconnected';
        elements.connectionStatus.textContent = 'Disconnected';
        elements.connectionStatus.classList.add('disconnected');
    }
}

// Update Sync Status
function updateSyncStatus(status) {
    if (status === 'syncing') {
        elements.syncStatus.textContent = 'Syncing...';
        elements.syncStatus.classList.add('syncing');
    } else {
        elements.syncStatus.textContent = 'Synced';
        elements.syncStatus.classList.remove('syncing');
    }
}

// Update User Count
function updateUserCount() {
    elements.userCount.textContent = state.activeUsers > 1 ? state.activeUsers - 1 : 1;
}

// Update Typing Indicator
function updateTypingIndicator() {
    const typingUsers = Object.entries(state.usersTyping)
        .filter(([id, isTyping]) => isTyping && id !== state.userId)
        .map(([id]) => {
            // Show a shortened version of the user ID
            const shortId = id.slice(-6);
            return shortId;
        });

    if (typingUsers.length > 0) {
        const displayNames = typingUsers.slice(0, 3).join(', ');
        const suffix = typingUsers.length > 3 ? ` and ${typingUsers.length - 3} more` : '';
        elements.typingIndicator.textContent = `${displayNames}${suffix} ${typingUsers.length === 1 ? 'is' : 'are'} typing...`;
        elements.typingIndicator.classList.add('active');
    } else {
        elements.typingIndicator.textContent = 'No one typing';
        elements.typingIndicator.classList.remove('active');
    }
}

// Update Cursor Legend
function updateCursorLegend() {
    const cursorIndicators = Object.entries(state.userCursors)
        .map(([userId, position], index) => {
            const color = userColors[index % userColors.length];
            const shortUserId = userId.slice(-6);
            return `<div class="cursor-indicator" title="User: ${userId}, Line: ${position}">
                <span class="cursor-indicator-dot" style="background-color: ${color};"></span>
                <span class="cursor-indicator-text">${shortUserId}</span>
            </div>`;
        })
        .join('');
    
    elements.cursorLegend.innerHTML = cursorIndicators;
}

// Share Room (copy share link)
function shareRoom() {
    if (state.roomId) {
        const shareUrl = `${window.location.origin}${window.location.pathname}?room=${state.roomId}`;
        navigator.clipboard.writeText(shareUrl);
        showToast('Share link copied to clipboard!', 'success');
    }
}

// Update URL
function updateURL() {
    if (state.roomId) {
        elements.roomId.value = state.roomId;
        window.history.replaceState({}, '', `?room=${state.roomId}`);
    }
}

// Load Room from URL
function loadRoomFromURL() {
    const params = new URLSearchParams(window.location.search);
    const roomId = params.get('room');
    if (roomId) {
        state.roomId = roomId;
        updateURL();
        connectWebSocket();
    }
}

// Show Toast Notification
function showToast(message, type = 'info') {
    elements.toast.textContent = message;
    elements.toast.className = `toast show ${type}`;
    setTimeout(() => {
        elements.toast.classList.remove('show');
    }, 3000);
}

// Utils
console.log('Pair Programming UI Loaded');
console.log(`User ID: ${state.userId}`);
