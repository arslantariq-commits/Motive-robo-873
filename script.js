const app = document.getElementById('app');
const queryInput = document.getElementById('queryInput');
const voiceBtn = document.getElementById('voiceBtn');
const chatMessages = document.getElementById('chatMessages');
const spotlight = document.querySelector('.spotlight');

// 1. ماؤس کے ساتھ چمکدار اسپاٹ لائٹ کا گھومنا
app.addEventListener('mousemove', (e) => {
  const rect = app.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  spotlight.style.setProperty('--x', `${x}px`);
  spotlight.style.setProperty('--y', `${y}px`);
});

// 2. کوری آٹو کاپی اور لائیو چیٹ ببل جنریٹر
function autoCopyAndProcess(text) {
  if (!text.trim()) return;
  app.classList.add('active'); // روبوٹ کو بائیں طرف بھیجیں
  
  // میسج ببل (Bubble) بنانا
  const bubble = document.createElement('div');
  bubble.className = 'message-bubble';
  bubble.textContent = text;
  
  chatMessages.appendChild(bubble);
  chatMessages.scrollTop = chatMessages.scrollHeight; // نیچھے آٹو اسکرول

  // ٹیکسٹ آٹو کاپی کرنا
  navigator.clipboard.writeText(text).then(() => {
    console.log("Copied to clipboard successfully.");
  }).catch(err => {
    console.error("Failed to copy: ", err);
  });
}

// کی بورڈ Enter کی ہینڈلنگ
queryInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && queryInput.value.trim() !== "") {
    autoCopyAndProcess(queryInput.value);
    queryInput.value = ""; // باکس خالی کریں
  }
});

// ٹائپنگ شروع کرنے پر پینل اوپن ہونا
queryInput.addEventListener('input', () => {
  if (queryInput.value.length > 0) {
    app.classList.add('active');
  }
});

// 3. وائس ان پٹ اسپیچ اسکرپٹ (🎙️)
if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();
  recognition.lang = 'en-US';
  
  voiceBtn.addEventListener('click', () => {
    voiceBtn.style.color = '#ff4444';
    recognition.start();
  });

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    autoCopyAndProcess(transcript);
    voiceBtn.style.color = '#aaa';
  };

  recognition.onerror = () => voiceBtn.style.color = '#aaa';
  recognition.onend = () => voiceBtn.style.color = '#aaa';
}

// 4. اسپلائن واٹرمارک (Built with Spline) مٹانے کا پکا لوپ
const removeSplineLogo = setInterval(() => {
  const viewer = document.getElementById('robotViewer');
  if (viewer && viewer.shadowRoot) {
    const logo1 = viewer.shadowRoot.querySelector('#logo') || 
                 viewer.shadowRoot.querySelector('.logo') || 
                 viewer.shadowRoot.querySelector('a[href*="spline.design"]');
    if (logo1) logo1.remove();
  }
}, 50);

// 10 سیکنڈ بعد میموری سیفٹی کے لیے لوپ کلیئر کرنا
setTimeout(() => { clearInterval(removeSplineLogo); }, 10000);