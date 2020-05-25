import { TrackException } from './exceptions'

export class Track {
  constructor(
    readonly botId: string,
    readonly time: Date,
    readonly events: UserEvent[]
  ) {}
}

export class UserEvent {
  constructor(
    readonly user: string = '',
    readonly event: string = '',
    readonly args: any = undefined
  ) {}
}

export interface TrackStorage {
  /**
   * @throws TrackException
   */
  write(track: Track): Promise<void>

  /**
   * @throws TrackException
   */
  read(bot: string, time: Date): Promise<Track>

  /**
   * @throws TrackException
   */
  remove(bot: string, time: Date): Promise<void>
}

export class ErrorReportingTrackStorage implements TrackStorage {
  constructor(readonly storage: TrackStorage) {}

  read(bot: string, time: Date): Promise<Track> {
    return this.storage
      .read(bot, time)
      .catch(this.handleError('reading', bot, time))
  }

  remove(bot: string, time: Date): Promise<void> {
    return this.storage
      .remove(bot, time)
      .catch(this.handleError('removing', bot, time))
  }

  write(track: Track): Promise<void> {
    return this.storage
      .write(track)
      .catch(this.handleError('writing', track.botId, track.time))
  }

  handleError(doing: string, bot: string, time: Date): (reason: any) => never {
    return (reason: any) => {
      // eslint-disable-next-line no-console
      const msg = `ERROR: ${doing} tracks of bot '${bot}' at '${time.toString()}': ${String(
        reason
      )}`
      console.error(msg)
      throw new TrackException(msg, reason)
    }
  }
}
