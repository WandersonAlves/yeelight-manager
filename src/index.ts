#!/usr/bin/env node
import 'reflect-metadata';
import { DiscoverDevicesCmd } from './commander/DiscoverDevicesCmd';
import { SeeLogsCmd } from './commander/SeeLogsCmd';
import { SendCommandCmd } from './commander/SendCommandCmd';
import { ToggleCmd } from './commander/ToggleCmd';
import { createCommand } from 'commander';

const program = createCommand();

program.version('0.0.1', '-v, --version');

program
  .command('start')
  .description('Start the service and allow to send commands to devices')
  .option('--verbose', 'Output verbose info')
  .option('--debug', 'Output debug info')
  .action(DiscoverDevicesCmd);

program
  .command('set <deviceid> <cmd> <value> [bright]')
  .description('Send a command to a device')
  .option('--verbose', 'Output verbose info')
  .option('--debug', 'Output debug info')
  .option('--effect', 'Apply a transition effect to the command. Can be `smooth` or `sudden`. Defaults to `smooth`', 'smooth')
  .option('--duration', 'The duration of the transition effect. Defaults to 300', '300')
  .action(SendCommandCmd);

program
  .command('toggle <deviceid>')
  .description('Toggle a device (turn on/off)')
  .option('--verbose', 'Output verbose info')
  .option('--debug', 'Output debug info')
  .action(ToggleCmd)

program
  .command('logs')
  .description('See the logs')
  .action(SeeLogsCmd)

program.parse(process.argv);
