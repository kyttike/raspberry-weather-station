import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { PicturesService } from './pictures.service';

@Controller('api')
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly picturesService: PicturesService,
  ) {}

  @Get('data')
  async getAllData() {
    return await this.appService.getData();
  }

  @Get('pictures')
  async getAllPictures() {
    return this.picturesService.getPicturesRecursively('pictures');
  }
}
