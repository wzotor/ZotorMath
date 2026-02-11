export function playSound(name, volume = 0.6) {
  try {
    const audio = new Audio(`/sounds/${name}.mp3`);
    audio.volume = volume;
    audio.play();
  } catch {
    // ignore
  }
}
