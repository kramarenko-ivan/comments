import { Controller, Get, Post, Put, Delete, Param, Body, ParseIntPipe } from '@nestjs/common';
import { FilesService } from './files.service';
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post()
  create(@Body() dto: CreateFileDto) {
    return this.filesService.create(dto);
  }

  @Get()
  findAll() {
    return this.filesService.findAll();
  }

  @Get(':file_id')
  findOne(@Param('file_id', ParseIntPipe) file_id: number) {
    return this.filesService.findOne(file_id);
  }

  @Put(':file_id')
  update(@Param('file_id', ParseIntPipe) file_id: number, @Body() dto: UpdateFileDto) {
    return this.filesService.update(file_id, dto);
  }

  @Delete(':file_id')
  remove(@Param('file_id', ParseIntPipe) file_id: number) {
    return this.filesService.remove(file_id);
  }
}
