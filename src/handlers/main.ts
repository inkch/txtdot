import { IHandlerOutput } from "./handler.interface";
import axios from "../types/axios";

import { JSDOM } from "jsdom";
import { DOMWindow } from "jsdom";

import readability from "./readability";
import google from "./google";
import { generateProxyUrl } from "../utils";

import { InvalidParameterError, NotHtmlMimetypeError } from "../errors/main";

export default async function handlePage(
  url: string,
  requestUrl: URL,
  engine?: string
): Promise<IHandlerOutput> {
  if (engine && engineList.indexOf(engine) === -1) {
    throw new InvalidParameterError("Invalid engine");
  }

  const response = await axios.get(url);
  const mime: string | undefined = response.headers["content-type"]?.toString();

  if (mime && mime.indexOf("text/html") === -1) {
    throw new NotHtmlMimetypeError({ url });
  }

  const window = new JSDOM(response.data, { url: url }).window;

  [...window.document.getElementsByTagName("a")].forEach((link) => {
    link.href = generateProxyUrl(requestUrl, link.href, engine);
  });

  if (engine) {
    return engines[engine](window);
  }

  const host = new URL(url).hostname;

  return fallback[host]?.(window) || fallback["*"](window);
}

interface Engines {
  [key: string]: EngineFunction;
}

type EngineFunction = (window: DOMWindow) => Promise<IHandlerOutput>;

export const engines: Engines = {
  readability,
  google,
};

export const engineList: string[] = Object.keys(engines);

const fallback: Engines = {
  "www.google.com": engines.google,
  "*": engines.readability,
};
