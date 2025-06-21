function sendMessage() {
  const inputField = document.getElementById("userInput");
  const message = inputField.value.trim();
  if (!message) return;

  displayMessage("user", message);
  inputField.value = "";

  showTypingIndicator();

  fetch("/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message }),
  })
    .then((res) => res.json())
    .then((data) => {
      setTimeout(() => {
        removeTypingIndicator();
        displayMessage("bot", data.response);
      }, 1000 + Math.random() * 1000); // mimic human response delay
    });
}

function displayMessage(sender, text) {
  const chatbox = document.getElementById("chatbox");

  const messageWrapper = document.createElement("div");
  messageWrapper.className = `flex ${
    sender === "user" ? "justify-end" : "justify-start"
  }`;

  const bubble = document.createElement("div");
  bubble.className = `max-w-xs md:max-w-sm px-4 py-2 rounded-2xl text-sm whitespace-pre-wrap ${
    sender === "user"
      ? "bg-red-600 text-white rounded-br-none"
      : "bg-gray-200 text-gray-800 rounded-bl-none"
  }`;
  bubble.textContent = text;

  messageWrapper.appendChild(bubble);
  chatbox.appendChild(messageWrapper);
  chatbox.scrollTop = chatbox.scrollHeight;
}

// Add typing indicator
function showTypingIndicator() {
  const chatbox = document.getElementById("chatbox");
  const typingWrapper = document.createElement("div");
  typingWrapper.id = "typingIndicator";
  typingWrapper.className = "flex justify-start";

  const bubble = document.createElement("div");
  bubble.className =
    "bg-gray-300 text-gray-800 px-4 py-2 rounded-2xl text-sm font-medium animate-pulse";
  bubble.textContent = "Zenith Bot is typing...";

  typingWrapper.appendChild(bubble);
  chatbox.appendChild(typingWrapper);
  chatbox.scrollTop = chatbox.scrollHeight;
}

// Remove typing indicator
function removeTypingIndicator() {
  const typing = document.getElementById("typingIndicator");
  if (typing) typing.remove();
}

// Send on enter
function handleKeyPress(e) {
  if (e.key === "Enter") sendMessage();
}
