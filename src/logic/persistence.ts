export function createSaveQueue<T>(write: (value: T) => Promise<void>, status: (failed: boolean) => void) {
  let tail: Promise<void> = Promise.resolve();
  let latest = 0;
  return (value: T): Promise<boolean> => {
    const revision = ++latest;
    const run = tail.then(() => write(value));
    tail = run.catch(() => {});
    return run.then(() => { if (revision === latest) status(false); return true; }, () => { if (revision === latest) status(true); return false; });
  };
}
