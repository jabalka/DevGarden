import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import {register as registerSwiperElements} from 'swiper/element/bundle';
// import { bootstrapApplication } from '@angular/platform-browser';


import { AppModule } from './app/app.module';

registerSwiperElements();

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
