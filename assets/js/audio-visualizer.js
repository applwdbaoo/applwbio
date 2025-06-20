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

  let smoothIntensity = 0;
  let prevIntensity = 0;

  function updateVisuals() {
    requestAnimationFrame(updateVisuals);
    
    analyser.getByteFrequencyData(dataArray);
    

    let sum = 0;
    for (let i = 0; i < bufferLength; i++) {
      sum += dataArray[i];
    }
    const rawIntensity = sum / bufferLength / 30;
    
    smoothIntensity = Math.max(rawIntensity, prevIntensity * 0.9);
    prevIntensity = smoothIntensity;
    
    const shadowBlur = 10 + smoothIntensity * 15;
    const shadowSpread = smoothIntensity * 5;
    const shadowColor = `rgba(255, 255, 255, ${0.7 + smoothIntensity * 0.5})`;
    
    blurredBox.style.boxShadow = `0 0 ${shadowBlur}px ${shadowSpread}px ${shadowColor}`;
    
    if (smoothIntensity > 0.1) {
      blurredBox.classList.add('active-border');
      const borderElement = blurredBox.querySelector('.animated-border') || document.createElement('div');
      borderElement.className = 'animated-border';
      borderElement.style.opacity = smoothIntensity;
      if (!blurredBox.contains(borderElement)) {
        blurredBox.appendChild(borderElement);
      }
    } else {
      blurredBox.classList.remove('active-border');
    }
  }

  audioElement.addEventListener('play', function() {
    audioContext.resume().then(() => {
      updateVisuals();
    });
  });
});