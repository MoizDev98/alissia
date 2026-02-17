import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { provideRouter, withComponentInputBinding, withViewTransitions } from '@angular/router';
import { routes } from './app/app.routes';
import { provideHttpClient, withFetch } from '@angular/common/http';

bootstrapApplication(AppComponent, {
  providers: [

    provideRouter(
      routes,
      withComponentInputBinding(), 
      withViewTransitions()        
    ),

    provideHttpClient(
      withFetch()                  
    ),

  ]
}).catch((err) => console.error(err));