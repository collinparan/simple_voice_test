document.addEventListener('DOMContentLoaded', function() {
    let recognition;
    let listening = false;
    let startTimestamp;

    const button = document.getElementById('speakButton');
    const listeningIndicator = document.getElementById('listeningIndicator');
    const microphoneIcon = document.getElementById('microphoneIcon');
    const transcription = document.getElementById('transcription'); // Get the transcription display element

    const startRecognition = () => {
        if ('webkitSpeechRecognition' in window) {
            listening = true;
            recognition = new webkitSpeechRecognition();
            recognition.continuous = false;
            recognition.interimResults = false;

            recognition.onstart = function() {
                listeningIndicator.style.display = 'block';
                microphoneIcon.style.filter = 'invert(20%) sepia(100%) saturate(7500%) hue-rotate(0deg) brightness(100%) contrast(101%)';
                transcription.textContent = ''; // Clear previous transcription
            };

            recognition.onresult = function(event) {
                const transcript = event.results[0][0].transcript;
                transcription.textContent = transcript; // Display the transcribed text
                speak(transcript);
            };

            recognition.onerror = function(event) {
                console.error('Speech recognition error', event.error);
                resetState();
            };

            recognition.onend = function() {
                resetState();
            };

            recognition.start();
        } else {
            alert('Your browser does not support speech recognition.');
        }
    };

    const stopRecognition = () => {
        if (recognition && listening) {
            recognition.stop();
            listening = false;
        }
    };

    const resetState = () => {
        listeningIndicator.style.display = 'none';
        microphoneIcon.style.filter = '';
        listening = false;
    };

    const speak = (text) => {
        const utterance = new SpeechSynthesisUtterance(text);
        const voices = window.speechSynthesis.getVoices();
        
        voices.forEach((voice, index) => {
            console.log(`${index + 1}: Name: ${voice.name}, Lang: ${voice.lang}, Default: ${voice.default ? 'Yes' : 'No'}`);
        });

        const googleUSEnglishVoice = voices.find(voice => voice.name.startsWith("Google"));
        if (googleUSEnglishVoice) {
            utterance.voice = googleUSEnglishVoice;
        } else {
            console.warn("Google US English voice not found. Using default voice.");
        }
        window.speechSynthesis.speak(utterance);
    };

    const handleStart = (event) => {
        event.preventDefault();
        if (!listening) {
            startTimestamp = event.timeStamp;
            startRecognition();
        }
    };

    const handleEnd = (event) => {
        event.preventDefault();
        if (listening && (event.timeStamp - startTimestamp > 100)) {
            stopRecognition();
        }
    };

    button.addEventListener('mousedown', handleStart, false);
    button.addEventListener('mouseup', handleEnd, false);
    button.addEventListener('touchstart', handleStart, false);
    button.addEventListener('touchend', handleEnd, false);
    button.addEventListener('mouseleave', stopRecognition, false);
});
