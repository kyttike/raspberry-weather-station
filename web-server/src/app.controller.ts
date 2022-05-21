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
    return this.appService.getPublicData();
  }

  @Get('pictures')
  async getAllPictures() {
    return this.picturesService.getPicturesRecursively('pictures');
  }

  @Get('greenhouse')
  async getGreenhouseData() {
    return this.appService.getGreenhouseData();
  }
}
