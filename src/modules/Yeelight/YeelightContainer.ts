import { ContainerModule } from 'inversify';
import ReceiveCommandCase from './ReceiveCommand/ReceiveCommandCase';
import ReceiveCommandRouter from './ReceiveCommand/ReceiveCommandRouter';

const YeelightContainer = new ContainerModule(bind => {
  bind<ReceiveCommandCase>(ReceiveCommandCase).toSelf();
  bind<ReceiveCommandRouter>(ReceiveCommandRouter).toSelf();
});

export default YeelightContainer;
