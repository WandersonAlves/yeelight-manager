import { GetBindingFromContainer } from "../infra/container";
import DescribeDeviceCommandCase from "../modules/Yeelight/Describe/DescribeDeviceCommandCase";
import DiscoverDevicesCase from "../modules/Discovery/DiscoverDevices/DiscoverDevicesCase";

export const DescribeCmd = async (devices: string, { waitTime }) => {
  await GetBindingFromContainer(DiscoverDevicesCase).execute({ waitTime });
  await GetBindingFromContainer(DescribeDeviceCommandCase).execute(devices.split(','));
}