export type AI21Params = {
	numResults: number;
	maxTokens: number;
	stopSequences: string[];
	topKReturn: number;
	temperature: number;
	modelSize: "large" | "jumbo";
}

export type TokenInfo = { logprob: number; token: string };
export type TextRange = { start: number; end: number };
export type Token = { generatedToken: TokenInfo; textRange: TextRange };
export type AI21Data = { text: string; tokens: Array<Token> };
export type FinishReason = { reason: string; sequence?: string };
export type AI21Completion = { data: AI21Data; finishReason: FinishReason };

export type AI21Response = {
	completions: Array<AI21Completion>;
	id: string;
	prompt: AI21Data;
};

export type AI21Config = {
	params: Partial<AI21Params>,
	prompt: string,
}