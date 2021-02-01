#!/usr/bin/env node
import 'reflect-metadata';
import { DiscoverDevicesCmd } from './commander/cmds/DiscoverDevicesCmd';
import { SendCommandCmd } from './commander/cmds/SendCommandCmd';
import { createCommand } from 'commander';

const program = createCommand();

program.version('0.0.1', '-v, --version');

program
  .command('start')
  .description('Start the service and allow to send commands to devices')
  .option('--verbose', 'Output verbose info')
  .action(DiscoverDevicesCmd);

program
  .command('set <deviceid> <cmd> [value]')
  .description('Send a command to a device')
  .option('--verbose', 'Output verbose info')
  .option('--effect', 'Apply a transition effect to the command. Can be `smooth` or `sudden`. Defaults to `smooth`', 'smooth')
  .option('--duration', 'The duration of the transition effect. Defaults to 300', '300')
  .action(SendCommandCmd);

program.parse(process.argv);
