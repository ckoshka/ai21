import { KeyReader } from "./effects.ts";

export const AI21KeyGen = {
	fromFile: async (filename: string): Promise<KeyReader> => {
		const generator = await Deno.readTextFile(filename)
			.then((keys: string) => keys.split("\n"))
			.then((keys) =>
				(function* () {
					keys.sort((_a, _b) => Math.random());
					for (;;) {
						for (const key of keys) {
							yield key;
						}
					}
				})()
			);
		return {
			readKey: () => generator.next().value,
		};
	},
	fromEnvVar: async (envVar: string): Promise<KeyReader> => {
		const keyVar = Deno.env.get(envVar);
		if (keyVar === undefined) {
			throw new Error(`Missing env var ${envVar}`);
		}
		const keys = await Deno.readTextFile(keyVar).then((k) =>
			k.split("\n").filter(Boolean)
		);
		return {
			readKey: () => keys[Math.floor(Math.random() * keys.length)],
		};
	},
	fromArray: (keys: string[]): KeyReader => ({
		readKey: () => keys[Math.floor(Math.random() * keys.length)],
	}),
	fromIter: (keys: Iterable<string>): KeyReader => ({
		readKey: () =>
			Array.from(keys)[
				Math.floor(Math.random() * Array.from(keys).length)
			],
	}),
	fromFn: (fn: () => string): KeyReader => ({
		readKey: fn,
	}),
};