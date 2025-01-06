import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ScraperService } from './scraper.service';
import { InitiatorService } from './initiator.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private _psaScraperService: ScraperService,
    private _initiatorService: InitiatorService,
  ) {}

  @Get()
  getHello(): any {
    return this._initiatorService.startAdding();
  }
}
