document.addEventListener('DOMContentLoaded', function() {
    let recognition;
    let listening = false;

    const startRecognition = () => {
        recognition = new webkitSpeechRecognition();
        recognition.continuous = false; // Consider true if you want it to keep listening until mouseup
        recognition.interimResults = false;

        recognition.onstart = function() {
            document.getElementById('listeningIndicator').style.display = 'block';
            document.getElementById('microphoneIcon').style.filter = 'invert(20%) sepia(100%) saturate(7500%) hue-rotate(0deg) brightness(100%) contrast(101%)';
            listening = true;
        };

        recognition.onresult = function(event) {
            const transcript = event.results[0][0].transcript;
            speak(transcript);
        };

        recognition.onerror = function(event) {
            console.error('Speech recognition error', event.error);
        };

        recognition.onend = function() {
            document.getElementById('listeningIndicator').style.display = 'none';
            document.getElementById('microphoneIcon').style.filter = '';
            listening = false;
        };

        recognition.start();
    };

    const stopRecognition = () => {
        if (recognition) {
            recognition.stop();
        }
    };

    const speak = (text) => {
        let utterance = new SpeechSynthesisUtterance(text);
        window.speechSynthesis.speak(utterance);
        setTimeout(() => {
            window.speechSynthesis.cancel(); // Optionally, stop speaking after 2 seconds
        }, 2000);
    };

    const button = document.getElementById('speakButton');

    button.addEventListener('mousedown', function() {
        if (!listening && 'webkitSpeechRecognition' in window) {
            startRecognition();
        } else {
            alert('Your browser does not support speech recognition.');
        }
    }, false);

    button.addEventListener('mouseup', function() {
        stopRecognition();
    });

    // Optional: Also consider stopping when the mouse leaves the button while pressed.
    button.addEventListener('mouseleave', function() {
        stopRecognition();
    });
});
