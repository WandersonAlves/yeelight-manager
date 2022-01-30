import { ContainerModule } from 'inversify';
import AmbilightCase from './Ambilight/AmbilightCase';
import ReceiveCommandCase from './ReceiveCommand/ReceiveCommandCase';

const YeelightContainer = new ContainerModule(bind => {
  bind<ReceiveCommandCase>(ReceiveCommandCase).toSelf();
  bind(AmbilightCase).toSelf();
});

export default YeelightContainer;
