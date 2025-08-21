import dotenv from "dotenv";
dotenv.config();

import { readFile, writeFile } from 'fs/promises';
import { exec } from 'child_process';
import { promisify } from 'util';
import { join } from 'path';
import chalk from 'chalk';

const execAsync = promisify(exec);

const bumpVersion = (version) => {
  const [major, minor, patch] = version.split('.').map(Number);
  const nextPatch = patch + 1;
  const nextMinor = nextPatch > 9 ? minor + 1 : minor;
  const nextMajor = nextMinor > 9 ? major + 1 : major;
  const newPatch = nextPatch > 9 ? 0 : nextPatch;
  const newMinor = nextMinor > 9 ? 0 : nextMinor;
  return [nextMajor, newMinor, newPatch].join('.');
};

const updateVersionCommitAndPush = async () => {
  try {
    console.log(chalk.blue('Starting version bump...'));

    const pkgPath = join(process.cwd(), 'package.json');
    const pkgJson = await readFile(pkgPath, 'utf-8');
    const pkg = JSON.parse(pkgJson);

    const oldVersion = pkg.version;
    const newVersion = bumpVersion(oldVersion);
    pkg.version = newVersion;

    await writeFile(pkgPath, JSON.stringify(pkg, null, 2) + '\n');
    console.log(`Version: ${chalk.cyanBright(oldVersion)} → ${chalk.greenBright(newVersion)}`);

    await execAsync('git add package.json');
    await execAsync(`git commit -m "chore: bump version to ${newVersion}"`);
    await execAsync(`git push origin ${process.env.BRANCH || 'develop'}`);

    console.log(chalk.green(`Version bumped, committed, and pushed to "${process.env.BRANCH || 'develop'}" branch`));
  } catch (err) {
    console.error(chalk.red('Error updating version:'), err);
  }
};

updateVersionCommitAndPush();
