export interface TimeProvider {
  now(): Date;
}

class RealTimeProvider implements TimeProvider {
  now(withMilliseconds: boolean = false): Date {
    let now = new Date();
    // since we store times without milliseconds, it simplifies testing to always remove them
    if (!withMilliseconds) {
      now.setMilliseconds(0);
    }
    return now;
  }
}

export default new RealTimeProvider();
