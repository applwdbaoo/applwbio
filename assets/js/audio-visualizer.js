document.addEventListener('DOMContentLoaded', function() {
  const audioElement = document.getElementById('myAudio');
  const blurredBox = document.getElementById('blurred-box');
  
  if (!window.AudioContext && !window.webkitAudioContext) {
    console.log('Web Audio API is not supported in this browser');
    return;
  }

  const AudioContext = window.AudioContext || window.webkitAudioContext;
  const audioContext = new AudioContext();
  const analyser = audioContext.createAnalyser();
  analyser.fftSize = 512;

  const source = audioContext.createMediaElementSource(audioElement);
  source.connect(analyser);
  analyser.connect(audioContext.destination);

  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);

  function updateBoxShadow() {
    requestAnimationFrame(updateBoxShadow);
    
    analyser.getByteFrequencyData(dataArray);

    let sum = 0;
    for (let i = 0; i < bufferLength; i++) {
      sum += dataArray[i];
    }
    const average = sum / bufferLength;
    
    const intensity = average / 35;
    const shadowBlur = 10 + intensity * 15;
    const shadowSpread = intensity * 5;
    const shadowColor = `rgba(65, 185, 255, ${0.7 + intensity * 0.5})`;
    
    blurredBox.style.boxShadow = `0 0 ${shadowBlur}px ${shadowSpread}px ${shadowColor}`;
    blurredBox.style.transform = `translate(-50%, -50%) perspective(1000px) rotateX(${rotate}deg) rotateY(${rotate}deg) translateX(${translateX}px) translateY(${translateY}px)`;
  }

  audioElement.addEventListener('play', function() {
    audioContext.resume().then(() => {
      updateBoxShadow();
    });
  });

  document.body.addEventListener('click', function() {
    if (audioContext.state === 'suspended') {
      audioContext.resume();
    }
    if (audioElement.paused) {
      audioElement.play();
    }
  }, { once: true });
});