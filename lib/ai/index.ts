import { experimental_wrapLanguageModel as wrapLanguageModel } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';
import { openai } from '@ai-sdk/openai';
import { customMiddleware } from './custom-middleware';

export const customModel = (apiIdentifier: string) => {
  const isOpenAI = apiIdentifier.includes('gpt') || apiIdentifier.includes('o1');
  const isClaude = apiIdentifier.includes('claude');

  if (isOpenAI) {
    return wrapLanguageModel({
      model: openai(apiIdentifier),
      middleware: customMiddleware,
    });
  } else if (isClaude) {
    return wrapLanguageModel({
      model: anthropic(apiIdentifier),
      middleware: customMiddleware,
    });
  }
  return wrapLanguageModel({
    model: anthropic('claude-3-5-sonnet-latest'),
    middleware: customMiddleware,
  });
};