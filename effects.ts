export type KeyReader = {
	readKey: () => string | Promise<string>;
};
export type FetchEffect = {
	fetch: typeof fetch
}