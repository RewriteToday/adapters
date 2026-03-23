import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

type Manifest = {
	name: string;
	version: string;
	dependencies?: Record<string, string>;
	devDependencies?: Record<string, string>;
	peerDependencies?: Record<string, string>;
	optionalDependencies?: Record<string, string>;
};

const packageDir = process.argv[2];

if (!packageDir) {
	throw new Error(
		'Expected the target package directory as the first argument.',
	);
}

const root = process.cwd();
const packagesRoot = join(root, 'packages');
const sections = [
	'dependencies',
	'devDependencies',
	'peerDependencies',
	'optionalDependencies',
] as const;

const manifests = new Map<string, Manifest>();
const workspaceDirs = (await readdir(packagesRoot, { withFileTypes: true }))
	.filter((entry) => entry.isDirectory())
	.map((entry) => join('packages', entry.name));

for (const dir of workspaceDirs) {
	const manifest = JSON.parse(
		await readFile(join(root, dir, 'package.json'), 'utf8'),
	) as Manifest;

	manifests.set(manifest.name, manifest);
}

const targetPath = join(root, packageDir, 'package.json');
const target = JSON.parse(await readFile(targetPath, 'utf8')) as Manifest;

for (const section of sections) {
	const dependencies = target[section];

	if (!dependencies) {
		continue;
	}

	for (const [dependencyName, range] of Object.entries(dependencies)) {
		if (!range.startsWith('workspace:')) {
			continue;
		}

		const workspaceDependency = manifests.get(dependencyName);

		if (!workspaceDependency) {
			throw new Error(
				`Could not resolve workspace dependency "${dependencyName}".`,
			);
		}

		const strategy = range.slice('workspace:'.length);

		dependencies[dependencyName] =
			strategy === '*' || strategy === '^'
				? `^${workspaceDependency.version}`
				: strategy === '~'
					? `~${workspaceDependency.version}`
					: strategy;
	}
}

await writeFile(targetPath, `${JSON.stringify(target, null, '\t')}\n`, 'utf8');
