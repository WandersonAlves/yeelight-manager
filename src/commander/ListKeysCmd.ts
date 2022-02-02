import CommandStorage from '../infra/storage/CommandStorage';

export const ListKeysCmd = () => {
  console.log(CommandStorage.getAll());

  process.exit();
};
