import { ContainerModule } from 'inversify';
import AmbilightCase from './Ambilight/AmbilightCase';
import ReceiveCommandCase from './ReceiveCommand/ReceiveCommandCase';
import RunSceneCase from './RunScene/RunSceneCase';

const YeelightContainer = new ContainerModule(bind => {
  bind<ReceiveCommandCase>(ReceiveCommandCase).toSelf();
  bind<RunSceneCase>(RunSceneCase).toSelf();
  bind(AmbilightCase).toSelf();
});

export default YeelightContainer;
