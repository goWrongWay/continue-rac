import { SlashCommand } from "../../index.js";
import { stripImages } from "../../llm/images.js";

const TranslateChineseCommand: SlashCommand = {
  name: "translate",
  description: "Translate to Chinese",
  run: async function* ({ ide, llm, input }) {
    if (input.trim() === "") {
      yield "Please enter the text you want to translate into Chinese.";
      return;
    }

    // input = '/tr hello world' => 'hello world'
    input = input.replace("/tr", "").trim();

    const prompt = `The text the user wants to translate is:

"${input}"

Please translate into Chinese. Your output should contain only the corresponding Chinese, without any explanation or other output.`;

    for await (const chunk of llm.streamChat([
      { role: "user", content: prompt },
    ])) {
      yield stripImages(chunk.content);
    }
  },
};

export default TranslateChineseCommand;
