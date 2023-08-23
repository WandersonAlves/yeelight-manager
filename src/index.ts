#!/usr/bin/env node
import 'reflect-metadata';
import { AmbilightCmd } from './commander/AmbilightCmd';
import { BlinkCmd } from './commander/BlinkCmd';
import { CommandListArr } from './infra/enums';
import { DescribeCmd } from './commander/DescribeCmd';
import { LIB_VERSION } from './version';
import { ListCmd } from './commander/ListCmd';
import { LoadCommandCmd } from './commander/LoadCommandCmd';
import { SeeLogsCmd } from './commander/SeeLogsCmd';
import { SendCommandCmd } from './commander/SendCommandCmd';
import { SetxCommandCmd } from './commander/SetxCommandCmd';
import { ToggleCmd } from './commander/ToggleCmd';
import { createCommand } from 'commander';

const program = createCommand();

program
  .version(process.env.npm_package_version || LIB_VERSION, '-v, --version')
  .name('yee')
  .description('Allow you to control yeelight bulbs from your CLI!');

program
  .command('list')
  .alias('ls')
  .description('Return a list of reachable devices')
  .option('-t --waitTime <value>', 'Time to wait to yeelights connect')
  .option('-c --colors', 'Instead of output the list of devices, show a color enum with possible prebaked colors')
  .option('--verbose', 'Output verbose info')
  .option('--debug', 'Output debug info')
  .action(ListCmd);

program
  .command('set <devices> <cmd> <value> [bright]')
  .description('Send a command to a device')
  .addHelpText('after', "\ndevices: string - A comma separated string with the name of devices. Example: 'Living Room,Bedroom', Bedroom")
  .addHelpText('after', `cmd: string - The command you want to run. Possible values are: ${CommandListArr.join(', ')}`)
  .addHelpText('after', `value?: number|string - Value used by cmd. Read README.md for more details`)
  .addHelpText('after', `bright?: number - Besides running the given cmd, runs a 'bright' command with the value.`)
  .option('--effect', 'Apply a transition effect to the command. Can be `smooth` or `sudden`.', 'smooth')
  .option('--duration', 'The duration of the transition effect.', '300')
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
  .command('ambilight <devices> <value> [interval]')
  .description('Turn ambilight for given devices')
  .addHelpText('after', "\ndevices: string - a comma separeted string with the name of devices. Example: 'Living Room,Bedroom', Bedroom")
  .addHelpText('after', 'value: string - a x separeted string that represents width-height-X-Y, this is the area to scan for colors. Example: 1280x135x640x100')
  .addHelpText('after', 'interval?: number|string - the interval in miliseconds or in fps to fetch new colors. Example: 150, 60fps. Defaults to 300')
  .usage('yee ambilight <devices> <value> [interval] --options')
  .option('--verbose', 'Output verbose info')
  .option('--debug', 'Output debug info')
  .option('--no-luminance', 'Dont use luminance values to increase/decrease brightness')
  .action(AmbilightCmd);

program
  .command('toggle <devices>')
  .addHelpText('after', "\ndevices: string - A comma separated string with the name of devices. Example: 'Living Room,Bedroom', Bedroom")
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
  .command('describe <devices>')
  .description('Show debug info for given devices')
  .option('-t --waitTime <value>', 'Time to wait to yeelights connect')
  .action(DescribeCmd);

program.command('logs').description('See the logs').action(SeeLogsCmd);

program.parse(process.argv);