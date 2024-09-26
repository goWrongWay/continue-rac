import { log } from "handlebars";
import { ChatMessage, CompletionOptions, LLMOptions, ModelProvider } from "../../index.js";
import { BaseLLM } from "../index.js";
import { streamSse } from "../stream.js";
import { stripImages } from "../images";

class Raccoon extends BaseLLM {
  static providerName: ModelProvider = "raccoon";
  static defaultOptions: Partial<LLMOptions> = {
    apiBase: "http://code-test.sensetime.com",
  };

  // private _convertArgs(options: CompletionOptions, prompt: string) {
  //   const finalOptions = {
  //     n_predict: options.maxTokens,
  //     frequency_penalty: options.frequencyPenalty,
  //     presence_penalty: options.presencePenalty,
  //     min_p: options.minP,
  //     mirostat: options.mirostat,
  //     stop: options.stop,
  //     top_k: options.topK,
  //     top_p: options.topP,
  //     temperature: options.temperature,
  //   };
  //
  //   return finalOptions;
  // }

  protected _convertMessage(message: ChatMessage) {
    if (typeof message.content === "string") {
      return message;
    } else if (!message.content.some((item) => item.type !== "text")) {
      // If no multi-media is in the message, just send as text
      // for compatibility with OpenAI "compatible" servers
      // that don't support multi-media format
      return {
        ...message,
        content: message.content.map((item) => item.text).join(""),
      };
    }

    const parts = message.content.map((part) => {
      const msg: any = {
        type: part.type,
        text: part.text,
      };
      if (part.type === "imageUrl") {
        msg.image_url = { ...part.imageUrl, detail: "low" };
        msg.type = "image_url";
      }
      return msg;
    });
    return {
      ...message,
      content: parts,
    };
  }

  protected _convertModelName(model: string): string {
    return model;
  }

  protected _convertArgs(options: any, messages: ChatMessage[]) {
    const url = new URL(this.apiBase!);
    const finalOptions: any = {
      // messages: messages.map(this._convertMessage),
      messages: messages,
      "n": 1,
      stream: options.stream ?? true,
      stop: "<|endofmessage|>",
    };
    return finalOptions;
  }

  // protected async *_streamComplete(
  //   prompt: string,
  //   options: CompletionOptions,
  // ): AsyncGenerator<string> {
  //   const headers = {
  //     "Content-Type": "application/json",
  //     Authorization: `Bearer ${this.apiKey}`,
  //     ...this.requestOptions?.headers,
  //   };
  //
  //   const resp = await this.fetch(new URL("completion", this.apiBase), {
  //     method: "POST",
  //     headers,
  //     body: JSON.stringify({
  //       prompt,
  //       stream: true,
  //       ...this._convertArgs(options, prompt),
  //     }),
  //   });
  //   console.log(resp);
  //
  //   for await (const value of streamSse(resp)) {
  //     if (value.content) {
  //       yield value.content;
  //     }
  //   }
  // }


  // protected async *_streamChat(
  //   messages: ChatMessage[],
  //   options: CompletionOptions,
  // ): AsyncGenerator<ChatMessage> {
  //   const headers = {
  //     "Content-Type": "application/json",
  //     Authorization: `Bearer ${this.apiKey}`,
  //     ...this.requestOptions?.headers,
  //   };
  //
  //   const resp = await this.fetch(new URL("completion", this.apiBase), {
  //     method: "POST",
  //     headers,
  //     body: JSON.stringify({
  //       prompt,
  //       stream: true,
  //       ...this._convertArgs(options, prompt),
  //     }),
  //   });
  //   console.log(resp);
  //
  //   for await (const value of streamSse(resp)) {
  //     if (value.content) {
  //       yield value.content;
  //     }
  //   }
  // }

  protected _getEndpoint(
    endpoint: "chat/completions" | "completions" | "models",
  ) {
    let pluginPath = "api/plugin/llm/v1";
    let isToB = false;
    if (isToB) {
      pluginPath = "org/api/plugin/llm/v1";
    }
    if (this.apiType === "azure") {
      return new URL(
        `openai/deployments/${this.engine}/${endpoint}?api-version=${this.apiVersion}`,
        this.apiBase,
      );
    }
    if (!this.apiBase) {
      throw new Error(
        "No API base URL provided. Please set the 'apiBase' option in config.json",
      );
    }
    // http://code-test.sensetime.com/api/plugin/llm/v1/chat-completions
    if (endpoint === "chat/completions") {
      return new URL(`${pluginPath}/chat-completions`, this.apiBase);
    }

    return new URL(endpoint, this.apiBase);
  }

  protected _getHeaders() {
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${this.apiKey}`
    };
  }

  protected async *_streamChat(
    messages: ChatMessage[],
    options: CompletionOptions,
  ): AsyncGenerator<ChatMessage> {
    const body = this._convertArgs(options, messages);
    // Empty messages cause an error in LM Studio
    // body.messages = body.messages.map((m: any) => ({
    //   ...m,
    //   content: m.content === "" ? " " : m.content,
    // })) as any;
    const response = await this.fetch(this._getEndpoint("chat/completions"), {
      method: "POST",
      headers: this._getHeaders(),
      body: JSON.stringify(body),
    });

    // Handle non-streaming response
    if (body.stream === false) {
      const data = await response.json();
      yield data.choices[0].message;
      return;
    }

    for await (const value of streamSse(response)) {
      let {data,status} = value;

      if (status.code === 0 && data.choices?.[0]?.delta) {
        yield {
          role: "assistant",
          content: data.choices[0].delta,
        };
      }
    }
  }

}

export default Raccoon;
