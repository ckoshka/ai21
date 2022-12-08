import { completeTexts } from "../mod.ts";

Deno.test("test getTexts", async () => {
	await completeTexts({
		params: {
			temperature: 0.89,
			numResults: 1,
			maxTokens: 20,
		},
		prompt: "I am a teapot, short and stdout.",
	})
	.map(console.log)
	.run({
		readKey: () => Deno.env.get("KEY") || ""
	})
});