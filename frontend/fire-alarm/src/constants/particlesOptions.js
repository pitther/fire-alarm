const particlesOptions = {
  background: {
    color: {
      value: 'white',
    },
  },
  fpsLimit: 120,
  particles: {
    color: {
      value: [
        'rgb(255,106,105)',
        /*        'rgb(255,221,106)',
        'rgb(188,188,188)',*/
      ],
      random: true,
    },
    /*links: {
      color: '#ffb1b1',
      distance: 50,
      enable: true,
      opacity: 0.5,
      width: 1,
    },*/
    collisions: {
      enable: false,
    },
    move: {
      direction: 'top',
      enable: true,
      outMode: 'out',
      random: false,
      speed: 1,
      straight: false,
    },
    number: {
      density: {
        enable: true,
        value_area: 800,
      },
      value: 100,
    },
    opacity: {
      value: 1,
      random: true,
    },
    shape: {
      type: 'circle',
    },
    size: {
      random: true,
      value: 5,
    },
  },
  interactivity: {
    events: {
      onHover: {
        enable: true,
        mode: '',
      },
      resize: true,
    },
    modes: {
      bubble: {
        distance: 700,
        duration: 0.5,
        opacity: 0.000001,
        size: 0,
      },
    },
  },
  detectRetina: true,
};

export { particlesOptions };
