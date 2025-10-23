import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Request,
  Param,
  Delete,
  Inject,
} from '@nestjs/common';
import { NotesService } from './notes.service';
import { Roles } from '../decorators/roles.decorator';
import { User } from '../decorators/user.decorator';
import { CreateNoteDto, UpdateNoteDto } from './notes.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@ApiTags('Notes')
@ApiBearerAuth()
@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Post()
  @Roles('admin')
  create(@Request() req, @Body() createNoteDto: CreateNoteDto) {
    const user = req.user;
    return this.notesService.create({
      title: createNoteDto.title,
      content: createNoteDto.content,
      user: {
        connect: { id: user.id },
      },
    });
  }

  @Get()
  async findAll(@User() user: any) {
    return this.notesService.findAll(user.id, user.role);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @User() user: any) {
    return this.notesService.findOne(id, user.id, user.role);
  }

  @Patch(':id')
  @Roles('admin')
  update(
    @Param('id') id: string,
    @Body() updateNoteDto: UpdateNoteDto,
    @User() user: any,
  ) {
    return this.notesService.update(id, updateNoteDto, user.id, user.role);
  }

  @Delete(':id')
  @Roles('admin')
  remove(@Param('id') id: string, @User() user: any) {
    return this.notesService.remove(id, user.id, user.role);
  }
}
