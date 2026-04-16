let time = $state({
  now: Date.now(),
});

let interval: ReturnType<typeof setInterval> | null = null;

function startTime() {
  if (interval) return;

  interval = setInterval(() => {
    time.now = Date.now();
  }, 60000);
}

function stopTime() {
  if (interval) {
    clearInterval(interval);
    interval = null;
  }
}

export { time, startTime, stopTime };
