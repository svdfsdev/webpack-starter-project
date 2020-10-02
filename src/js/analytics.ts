function createAnalytics(): object {
  let counter = 0;
  let destroyed: boolean = false;

  const listener = () => counter++;

  document.addEventListener('click', listener);

  return {
    destroy() {
      document.removeEventListener('click', listener);
      destroyed = true;
    },

    getClicks() {
      if (destroyed) {
        return `Analytics is destroyed. Total clicks = ${counter}!`;
      }
      return counter;
    },
  };
}

window['analytics'] = createAnalytics();
