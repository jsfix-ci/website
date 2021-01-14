import anime from 'animejs';

export const animate = ({
  fadeOpacities,
  setFadeOpacities,
  dataEvents,
  setDataEvents,
  flyToAgsOnLoad,
  updateFocus,
  initialMapAnimation,
  setMunicipalityFadeProgress,
}) => {
  // console.log(initialMapAnimation);

  const localEvents = [...dataEvents];
  const localOpacities = { ...fadeOpacities };
  const tl = anime.timeline();
  // Fade between fallback image and interactive map
  tl.add({
    targets: localOpacities,
    fallback: [1, 0],
    map: [0, 1],
    delay: initialMapAnimation ? 1200 : 0,
    duration: initialMapAnimation ? 500 : 120,
    easing: 'easeOutQuad',
    update() {
      setFadeOpacities({ ...localOpacities });
    },
  });
  if (initialMapAnimation) {
    const animation = { progress: 0 };
    // Fadein animatedmarkers
    tl.add({
      targets: localOpacities,
      animatedMarkers: [0, 1],
      duration: 1200,
      delay: 500,
      easing: 'easeOutQuad',
      update() {
        setFadeOpacities({ ...localOpacities });
      },
    });
    // Fade in municipalities
    tl.add(
      {
        targets: animation,
        duration: 5000,
        progress: [0, 1],
        easing: 'easeOutCubic',
        update() {
          //
          setMunicipalityFadeProgress(animation.progress);
        },
      },
      '-=1300'
    );
    tl.add(
      {
        targets: localEvents.filter(x => x.category === 'new'),
        latitude: d => d.latitudeRange,
        signups: d => d.signupsRange,
        percentToGoal: d => d.percentToGoalRange,
        duration: 900,
        delay: anime.stagger(200),
        easing: 'easeOutQuad',
        update() {
          setDataEvents([...localEvents]);
        },
      },
      '-=5000'
    );
    tl.add(
      {
        targets: localEvents.filter(x => x.category === 'change'),
        signups: d => d.signupsRange,
        percentToGoal: d => d.percentToGoalRange,
        duration: 1000,
        delay: anime.stagger(300),
        easing: 'easeOutElastic(10,0.3)',
        // easing: 'easeOutQuad',
        update() {
          setDataEvents([...localEvents]);
        },
      },
      '-=500'
    );
    tl.add(
      {
        targets: localEvents.filter(x => x.category === 'win'),
        signups: d => d.signupsRange,
        percentToGoal: d => d.percentToGoalRange,
        duration: 1000,
        delay: anime.stagger(200),
        easing: 'easeOutElastic(10,0.4)',
        // easing: 'easeOutQuad',

        update() {
          setDataEvents([...localEvents]);
        },
      },
      '-=500'
    );
  }

  tl.add({
    duration: 1,
    complete() {
      if (flyToAgsOnLoad) {
        updateFocus();
      }
    },
  });
  tl.pause();
  tl.play();
};
