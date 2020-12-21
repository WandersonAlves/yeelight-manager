import { Container } from 'inversify';
import Discovery from '../yeelight/discovery';
import DiscoveryContainer from '../../modules/Discovery/DiscoveryContainer';
// Merge container modules
const container = new Container({ defaultScope: 'Singleton' });

container.bind<Discovery>(Discovery).toSelf();
container.load(DiscoveryContainer);

export default container;
