import { ContainerModule } from 'inversify';
import ReceiveCommandCase from './ReceiveCommand/ReceiveCommandCase';
import ReceiveCommandRouter from './ReceiveCommand/ReceiveCommandRouter';
import RunSceneCase from './RunScene/RunSceneCase';
import RunSceneRouter from './RunScene/RunSceneRouter';

const YeelightContainer = new ContainerModule(bind => {
  bind<ReceiveCommandCase>(ReceiveCommandCase).toSelf();
  bind<ReceiveCommandRouter>(ReceiveCommandRouter).toSelf();
  bind<RunSceneCase>(RunSceneCase).toSelf();
  bind<RunSceneRouter>(RunSceneRouter).toSelf();
});

export default YeelightContainer;
