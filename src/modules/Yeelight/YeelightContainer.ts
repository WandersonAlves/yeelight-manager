import { ContainerModule } from 'inversify';
import ReceiveCommandCase from './ReceiveCommand/ReceiveCommandCase';
import RunSceneCase from './RunScene/RunSceneCase';

const YeelightContainer = new ContainerModule(bind => {
  bind<ReceiveCommandCase>(ReceiveCommandCase).toSelf();
  bind<RunSceneCase>(RunSceneCase).toSelf();
});

export default YeelightContainer;
