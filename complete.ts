import { AI21Config, AI21Response } from "./types.ts";
import { use } from "./deps.ts";
import { FetchEffect, KeyReader } from "./effects.ts";

export const complete = ({
	params,
	prompt,
}: AI21Config) =>
	use<Partial<FetchEffect> & KeyReader>().map2(async (fx) => {
		const defaults = {
			numResults: params.numResults || 1,
			maxTokens: params.maxTokens || 150,
			stopSequences: params.stopSequences || [],
			topKReturn: params.topKReturn || 0,
			temperature: params.temperature || 0.85,
		};
		const modelSize = params.modelSize || "jumbo";
		const body = {
			method: "POST",
			headers: {
				Authorization: `Bearer ${fx.readKey()}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				prompt: prompt,
				...defaults,
			}),
		};
		const post = fx.fetch ?? fetch;
		const response = await post(
			`https://api.ai21.com/studio/v1/j1-${modelSize}/complete`,
			body,
		);
		const json: AI21Response = await response.json();
		if (!json.completions) {
			throw new Error(JSON.stringify(json) + JSON.stringify(body));
		}
		return json;
	});

export const getTexts = (res: AI21Response) =>
	res.completions.map((c) => c.data.text);

export const getLogProb = (res: AI21Response) =>
	res.prompt.tokens
		.map((t) => t.generatedToken.logprob)
		.reduce((a, b) => Number(a) + Number(b), 0) / res.prompt.tokens.length;

export const completeTexts = <T>(config: AI21Config) =>
	complete(config).map(getTexts);
export const probabilityOf = <T>(config: AI21Config) =>
	complete(config).map(getLogProb);
