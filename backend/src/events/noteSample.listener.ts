import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

export class NoteSampleEvent {
  constructor(
    public readonly angka: number,
    public readonly title: string,
  ) {}
}

@Injectable()
export class NoteSampleListener {
  private readonly logger = new Logger(NoteSampleListener.name);

  constructor() {}

  @OnEvent('NOTE_SAMPLE.EVENT.CREATED', { async: true })
  async handleNoteSampleEvent(payload: NoteSampleEvent) {
    console.log('NoteSampleEvent', payload);
  }
}
