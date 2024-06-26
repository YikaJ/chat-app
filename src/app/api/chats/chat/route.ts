import { Message, OpenAIStream, StreamingTextResponse } from 'ai';
import VenusOpenAPI from '@/lib/node_venus_openai/openapi';
import { VenusStream } from '@/lib/venusStream'
import { Readable } from 'stream';
import { NextRequest } from 'next/server';

// Create an OpenAI API client (that's edge friendly!)
const secret_id = process.env.AK;
const secret_key = process.env.SK;
const venusOpenAPIClient = new VenusOpenAPI(secret_id, secret_key)


// Set the runtime to edge for best performance
// export const runtime = 'nodejs';

export const AIChat = async (messages: Message[]) => {
  const response = await venusOpenAPIClient.request('http://v2.open.venus.oa.com/chat/single', {
    appGroupId: 2727,
    model: 'gpt-3.5-turbo-16k',
    // model: 'gpt-4-0125-preview',
    stream: true,
    messages,

    // 其他配置
    // temperature: 0,
    // top_p: 1,
    // presence_penalty: 0,
    // frequency_penalty: 0,
  })
  // Ask OpenAI for a streaming chat completion given the prompt
  const stream = VenusStream(response);
  return new StreamingTextResponse(stream);
}

export async function POST(req: NextRequest) {
  const { messages } = await req.json();
  return AIChat(messages)
}

// import { OpenAIClient, AzureKeyCredential } from '@azure/openai';
// import { OpenAIStream, StreamingTextResponse } from 'ai';

// // Create an OpenAI API client (that's edge friendly!)
// const client = new OpenAIClient(
//   'https://yika-openai.openai.azure.com/',
//   new AzureKeyCredential(process.env.AZURE_OPENAI_API_KEY!),
//   {
//     apiVersion: '2024-02-15-preview'
//   }
// );

// // IMPORTANT! Set the runtime to edge
// export const runtime = 'edge';

// export async function POST(req: Request) {
//   const { messages } = await req.json();

//   // Ask Azure OpenAI for a streaming chat completion given the prompt
//   const response = await client.streamChatCompletions(
//     'gpt-35-turbo',
//     messages
//   );

//   // Convert the response into a friendly text-stream
//   const stream = OpenAIStream(response);
//   // Respond with the stream
//   return new StreamingTextResponse(stream);
// }