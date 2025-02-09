import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  ValidationPipe,
} from '@nestjs/common';
import { CreateProductDto } from './Dto/CreateProductDto';

@Controller('test')
export class TestController {
  @Get('product/:id')
  testFrontend(@Param('id') id: string) {
    console.log(id);
    return `Hello From the other side ${id}`;
  }

  @Post('products')
  postProduct(@Body(new ValidationPipe()) CreateProductDto: CreateProductDto) {
    console.log('asdasdas');

    console.log('Received Product:', CreateProductDto);
    return {
      message: 'Product created successfully',
    };
  }
}
