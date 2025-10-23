import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  Inject,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SimpleNote, Prisma } from '@prisma/client';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { NoteSampleEvent } from 'src/events/noteSample.listener';

@Injectable()
export class NotesService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private prisma: PrismaService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async create(data: Prisma.SimpleNoteCreateInput): Promise<SimpleNote> {
    const result = this.prisma.simpleNote.create({
      data,
    });

    this.eventEmitter.emit(
      'NOTE_SAMPLE.EVENT.CREATED',
      new NoteSampleEvent(data.title.length, data.title),
    );
    return result;
  }

  async findAll(userId?: string, userRole?: string): Promise<SimpleNote[]> {
    const cacheKey = `notes`;

    // check cache
    const cachedNotes = await this.cacheManager.get(cacheKey);
    if (cachedNotes && Array.isArray(cachedNotes)) {
      console.log('Using cache');
      return cachedNotes;
    }

    console.log('Using database');

    const result = await this.prisma.simpleNote.findMany({
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // save to cache
    await this.cacheManager.set(cacheKey, result, 10 * 1000);

    return result;
  }

  async findOne(
    id: string,
    userId?: string,
    userRole?: string,
  ): Promise<SimpleNote> {
    const note = await this.prisma.simpleNote.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    });

    if (!note) {
      throw new NotFoundException('Note not found');
    }

    // If user is not admin and doesn't own the note, deny access
    if (userRole !== 'admin' && note.userId !== userId) {
      throw new ForbiddenException('You can only access your own notes');
    }

    return note;
  }

  async update(
    id: string,
    data: Prisma.SimpleNoteUpdateInput,
    userId?: string,
    userRole?: string,
  ): Promise<SimpleNote> {
    const note = await this.findOne(id, userId, userRole);

    // Only admin can edit notes
    if (userRole !== 'admin') {
      throw new ForbiddenException('Only admins can edit notes');
    }

    return this.prisma.simpleNote.update({
      where: { id },
      data,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    });
  }

  async remove(
    id: string,
    userId?: string,
    userRole?: string,
  ): Promise<SimpleNote> {
    const note = await this.findOne(id, userId, userRole);

    // Only admin can delete notes
    if (userRole !== 'admin') {
      throw new ForbiddenException('Only admins can delete notes');
    }

    return this.prisma.simpleNote.delete({
      where: { id },
    });
  }
}
