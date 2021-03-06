#!/usr/bin/env node
import 'reflect-metadata';
import { AmbilightCmd } from './commander/AmbilightCmd';
import { BlinkCmd } from './commander/BlinkCmd';
import { DiscoverDevicesCmd } from './commander/DiscoverDevicesCmd';
import { ListCmd } from './commander/ListCmd';
import { SeeLogsCmd } from './commander/SeeLogsCmd';
import { SendCommandCmd } from './commander/SendCommandCmd';
import { ToggleCmd } from './commander/ToggleCmd';
import { createCommand } from 'commander';

const program = createCommand();

program.version('0.0.1', '-v, --version');

program
  .command('start')
  .description('Start the service and allow to send commands to devices')
  .option('-t --waitTime', 'Time to wait to yeelights connect')
  .option('--verbose', 'Output verbose info')
  .option('--debug', 'Output debug info')
  .action(DiscoverDevicesCmd);

program
  .command('list')
  .description('Return a list of reachable devices')
  .option('-t --waitTime <value>', 'Time to wait to yeelights connect')
  .option('--verbose', 'Output verbose info')
  .option('--debug', 'Output debug info')
  .action(ListCmd);

program
  .command('set <devices> <cmd> <value> [bright]')
  .description('Send a command to a device')
  .option('--effect', 'Apply a transition effect to the command. Can be `smooth` or `sudden`. Defaults to `smooth`', 'smooth')
  .option('--duration', 'The duration of the transition effect. Defaults to 300', '300')
  .option('--verbose', 'Output verbose info')
  .option('--debug', 'Output debug info')
  .action(SendCommandCmd);

program
  .command('ambilight <devices> <resolution> [interval]')
  .description('Turn ambilight for given devices')
  .option('--verbose', 'Output verbose info')
  .option('--debug', 'Output debug info')
  .action(AmbilightCmd)

program
  .command('toggle <devices>')
  .description('Toggle a device (turn on/off)')
  .option('-t --waitTime <value>', 'Time to wait to yeelights connect')
  .option('--verbose', 'Output verbose info')
  .option('--debug', 'Output debug info')
  .action(ToggleCmd);

program
  .command('blink <devices>')
  .description('Blink the device')
  .option('-t --waitTime <value>', 'Time to wait to yeelights connect')
  .option('--verbose', 'Output verbose info')
  .option('--debug', 'Output debug info')
  .action(BlinkCmd);

program
  .command('logs')
  .description('See the logs')
  .action(SeeLogsCmd)

program.parse(process.argv);
