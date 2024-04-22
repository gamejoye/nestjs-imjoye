const originalConsoleLog = console.log;
class Logger {
  log(...args: any[]) {
    if (process.env.NODE_ENV === 'development') {
      originalConsoleLog(...args);
    }
  }
  test(...args: any[]) {
    if (process.env.NODE_ENV === 'test') {
      originalConsoleLog(...args);
    }
  }
}
console.log = () => {};
const ins = new Logger();
export { ins as Logger };
