import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseUUIDPipe,
  NotFoundException,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { BooksService } from './books.service';
import { CreateBookDTO } from './dto/create-book.dto';
import { UpdateBookDTO } from './dto/update-book.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { LikedBookDTO } from './dto/like-book.dto';

@Controller('books')
export class BooksController {
  constructor(private booksService: BooksService) {}

  @Get('/')
  getAll(): any {
    return this.booksService.getAll();
  }

  @Get('/:id')
  async getById(@Param('id', new ParseUUIDPipe()) id: string) {
    const book = await this.booksService.getById(id);
    if (!book) throw new NotFoundException('Book not found');
    return book;
  }

  @Post('/')
  @UseGuards(JwtAuthGuard)
  create(@Body() bookData: CreateBookDTO) {
    return this.booksService.create(bookData);
  }

  @Post('/like')
  @UseGuards(JwtAuthGuard)
  async likeBook(@Body() likedBookData: LikedBookDTO): Promise<void> {
    try {
      await this.booksService.likeBook(likedBookData);
    } catch (error) {
      throw new BadRequestException('Invalid bookId or userId');
    }
  }

  @Put('/:id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() bookData: UpdateBookDTO,
  ) {
    if (!(await this.booksService.getById(id)))
      throw new NotFoundException('Book not found');

    await this.booksService.updateById(id, bookData);
    return { success: true };
  }

  @Delete('/:id')
  @UseGuards(JwtAuthGuard)
  async deleteById(@Param('id', new ParseUUIDPipe()) id: string) {
    if (!(await this.booksService.getById(id)))
      throw new NotFoundException('Book not found');
    await this.booksService.deleteById(id);
    return { success: true };
  }
}
