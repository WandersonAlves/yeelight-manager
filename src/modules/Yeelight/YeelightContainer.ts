import { ContainerModule } from 'inversify';
import AmbilightCmdCase from './Ambilight/AmbilightCmdCase';
import ReceiveCommandCase from './ReceiveCommand/ReceiveCommandCase';
import SetxCommandCase from './SetxCommand/SetxCommandCase';

const YeelightContainer = new ContainerModule(bind => {
  bind<ReceiveCommandCase>(ReceiveCommandCase).toSelf();
  bind(AmbilightCmdCase).toSelf();
  bind(SetxCommandCase).toSelf();
});

export default YeelightContainer;
