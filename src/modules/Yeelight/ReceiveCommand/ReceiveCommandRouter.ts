import { CommandSignal } from "./ReceiveCommandInterfaces";
import { IHttpRequest, RequestRouter } from "../../../shared/contracts";
import { inject, injectable } from "inversify";
import ReceiveCommandCase from "./ReceiveCommandCase";

@injectable()
export default class ReceiveCommandRouter implements RequestRouter {

  @inject(ReceiveCommandCase) private case: ReceiveCommandCase;
  async route({ headers }: IHttpRequest<CommandSignal>) {
    const result = await this.case.execute({ headers });
    return result;
  }
}