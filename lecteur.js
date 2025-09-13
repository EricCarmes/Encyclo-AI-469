document.addEventListener('DOMContentLoaded', () => {
const player = new Plyr('#audioPlayer', {
  controls: [
    'play',
    'progress',
    'current-time',
    'duration',
    'mute',
    'volume',
    'settings'
  ],
  speed: {
    selected: 1,
    options: [0.9, 0.95, 1, 1.05, 1.1]
  },
  captions: { active: false, update: false },
  i18n: {
    speed: 'Vitesse'
  }
});

  const audio = document.getElementById('audioPlayer');
  const links = Array.from(document.querySelectorAll('#playlist a[href$=".mp3"]'));
  let current = 0;
  let forcePlay = false;

  function loadTrack(index, autoplay = true) {
    if (index >= links.length) return;

    current = index;
    const link = links[current];
    audio.src = link.href;

    // Style du lien actif
    links.forEach((l, i) => {
      l.style.color = i === current ? 'red' : 'black';
      l.style.fontWeight = i === current ? 'bold' : 'normal';
    });

    forcePlay = autoplay;
    audio.load();
  }

  // Lecture automatique si demandé
  audio.addEventListener('canplaythrough', () => {
    if (forcePlay) {
      player.play().catch(err => {
        console.error("Lecture auto bloquée :", err);
      });
      forcePlay = false;
    }
  });

  // Enchaînement automatique à la piste suivante
  audio.addEventListener('ended', () => {
    loadTrack(current + 1, true);
  });

  // Clic utilisateur sur un lien
  links.forEach((link, index) => {
    link.addEventListener('click', e => {
      e.preventDefault();
      loadTrack(index, true);
    });
  });

  // Charger la première piste au démarrage
  loadTrack(0, false);

  // ➕ Affichage de la durée de chaque fichier audio
  links.forEach(link => {
    const audioTemp = document.createElement('audio');
    audioTemp.src = link.href;

    audioTemp.addEventListener('loadedmetadata', () => {
      const duration = audioTemp.duration;
      if (!isNaN(duration)) {
        const minutes = Math.floor(duration / 60);
        const seconds = Math.floor(duration % 60).toString().padStart(2, '0');
        const span = document.createElement('span');
        span.style.marginLeft = '10px';
        span.style.fontSize = '0.9em';
        span.style.color = '#666';
        span.textContent = `(${minutes}:${seconds})`;
        link.parentElement.appendChild(span);
      }
    });
  });
});
