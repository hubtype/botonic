export class Track {
  constructor(
    readonly botId: string,
    readonly time: Date,
    readonly events: UserEvent[]
  ) {}
}

export class UserEvent {
  constructor(readonly user: string = '', readonly event: string = '') {}
}

export interface TrackStorage {
  write(track: Track): Promise<undefined>;

  read(bot: string, time: Date): Promise<Track>;

  remove(bot: string, time: Date): Promise<undefined>;
}

export class ErrorReportingTrackStorage implements TrackStorage {
  constructor(readonly storage: TrackStorage) {}

  read(bot: string, time: Date): Promise<Track> {
    return this.storage
      .read(bot, time)
      .catch(this.handleError('reading', bot, time));
  }

  remove(bot: string, time: Date): Promise<undefined> {
    return this.storage
      .remove(bot, time)
      .catch(this.handleError('removing', bot, time));
  }

  write(track: Track): Promise<undefined> {
    return this.storage
      .write(track)
      .catch(this.handleError('reading', track.botId, track.time));
  }

  handleError(doing: string, bot: string, time: Date): (reason: any) => never {
    return (reason: any) => {
      // eslint-disable-next-line no-console
      console.error(
        `Error ${doing} tracks of bot '${bot}' at '${time}': ${reason}`
      );
      throw reason;
    };
  }
}
