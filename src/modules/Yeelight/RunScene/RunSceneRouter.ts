import { IHttpRequest, RequestRouter } from '../../../shared/contracts';
import { RunSceneBody } from './RunSceneInterface';
import { inject, injectable } from 'inversify';
import RunSceneCase from './RunSceneCase';

@injectable()
export default class RunSceneRouter implements RequestRouter {
  @inject(RunSceneCase) private case: RunSceneCase;

  async route({ body }: IHttpRequest<RunSceneBody>) {
    return await this.case.execute({ body });
  }
}
