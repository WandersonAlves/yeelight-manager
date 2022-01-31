import { ContainerModule } from 'inversify';
import AmbilightCase from './Ambilight/AmbilightCase';
import ReceiveCommandCase from './ReceiveCommand/ReceiveCommandCase';
import SetxCommandCase from './SetxCommand/SetxCommandCase';

const YeelightContainer = new ContainerModule(bind => {
  bind<ReceiveCommandCase>(ReceiveCommandCase).toSelf();
  bind(AmbilightCase).toSelf();
  bind(SetxCommandCase).toSelf();
});

export default YeelightContainer;
