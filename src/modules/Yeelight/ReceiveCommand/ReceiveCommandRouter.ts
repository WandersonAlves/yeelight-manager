import { IHttpRequest, RequestRouter } from "../../../shared/contracts";
import { ReceiveCommandCaseHeaders } from "./ReceiveCommandInterfaces";
import { inject, injectable } from "inversify";
import ReceiveCommandCase from "./ReceiveCommandCase";

@injectable()
export default class ReceiveCommandRouter implements RequestRouter {

  @inject(ReceiveCommandCase) private case: ReceiveCommandCase;
  async route({ headers }: IHttpRequest<ReceiveCommandCaseHeaders>) {
    console.log(headers);
    const result = await this.case.execute({ headers });
    return result;
  }
}