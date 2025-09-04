import 'reflect-metadata';
import {RestApplication} from '@loopback/rest';
import {RestExplorerBindings, RestExplorerComponent} from '@loopback/rest-explorer';
import {UsersController} from './controllers/users.controller';
import {VenuesController} from './controllers/venues.controller';
import {EventsController} from './controllers/events.controller';
import {TicketsController} from './controllers/tickets.controller';

export class App extends RestApplication {
  constructor() {
    super({rest: {port: +(process.env.PORT ?? 3001), host: '0.0.0.0'}});
    this.component(RestExplorerComponent);
    this.bind(RestExplorerBindings.CONFIG).to({path: '/explorer'});
    this.controller(UsersController);
    this.controller(VenuesController);
    this.controller(EventsController);
    this.controller(TicketsController);
  }
}

(async () => {
  const app = new App();
  await app.start();
  console.log('API running at http://localhost:' + app.restServer.config.port);
  console.log('OpenAPI Explorer at http://localhost:' + app.restServer.config.port + '/explorer');
})();
