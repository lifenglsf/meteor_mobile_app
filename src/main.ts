import 'meteor-client';
import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { MeteorObservable } from 'meteor-rxjs';
import { Meteor } from 'meteor/meteor';
import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
//
if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.log(err));
  Meteor.startup(() => {
    const subscription = MeteorObservable.autorun().subscribe(() => {
   
      if (Meteor.loggingIn()) {
        return;
      }
   
      setTimeout(() => subscription.unsubscribe());
      platformBrowserDynamic().bootstrapModule(AppModule);
    });
  });
