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
