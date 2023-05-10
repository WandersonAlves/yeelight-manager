#!/usr/bin/env node
import 'reflect-metadata';
import { AmbilightCmd } from './commander/AmbilightCmd';
import { BlinkCmd } from './commander/BlinkCmd';
import { ListCmd } from './commander/ListCmd';
import { LoadCommandCmd } from './commander/LoadCommandCmd';
import { SeeLogsCmd } from './commander/SeeLogsCmd';
import { SendCommandCmd } from './commander/SendCommandCmd';
import { SetxCommandCmd } from './commander/SetxCommandCmd';
import { ToggleCmd } from './commander/ToggleCmd';
import { createCommand } from 'commander';

const program = createCommand();

program
  .name('yeelight-manager')
  .description('Allow you to control yeelight bulbs from your CLI!')
  .version(process.env.npm_package_version, '-v, --version');

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
  .command('setx <raw>')
  .description(
    "Send multiple commands to multiple devices. Example: yee setx \"'Living Room' ct=9999 bright=100 Kitchen ct=9999 bright=100\" --save 'Normal Room'",
  )
  .option('-s --save <value>', 'Save the setx command to be used later on load command')
  .option('--verbose', 'Output verbose info')
  .option('--debug', 'Output debug info')
  .option('-e --exec', 'Save and execute cmd')
  .action(SetxCommandCmd);

program
  .command('load [name]')
  .option('-ls --list', 'List all saved commands')
  .option('--verbose', 'Output verbose info')
  .option('--debug', 'Output debug info')
  .description('Load a command saved with setx command')
  .action(LoadCommandCmd);

program
  .command('ambilight <devices> <resolution> [interval]')
  .description('Turn ambilight for given devices')
  .addHelpText('after', "\nDevices: a comma separeted string with the name of devices. Example: 'Living Room,Bedroom', Bedroom")
  .addHelpText('after', 'Resolution: a x separeted string that represents width-height-X-Y, this is the area to scan for colors. Example: 1280x135x640x100')
  .addHelpText('after', 'Interval (optional): the interval in miliseconds or in fps to fetch new colors. Example: 150, 60fps. Defaults to 300')
  .usage('yee ambilight <devices> <resolution> [interval] --options')
  .option('--verbose', 'Output verbose info')
  .option('--debug', 'Output debug info')
  .action(AmbilightCmd);

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

program.command('logs').description('See the logs').action(SeeLogsCmd);

program.parse(process.argv);
