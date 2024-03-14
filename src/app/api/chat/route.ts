import { OpenAIStream, StreamingTextResponse } from 'ai';
import VenusOpenAPI from '@/lib/node_venus_openai/openapi';
import { VenusStream } from '@/lib/venusStream'

// Create an OpenAI API client (that's edge friendly!)
const secret_id = process.env.AK;
const secret_key = process.env.SK;
const venusOpenAPIClient = new VenusOpenAPI(secret_id, secret_key)


// Set the runtime to edge for best performance
export const runtime = 'nodejs';

export async function POST(req: Request) {
  const { messages } = await req.json();

  // Ask OpenAI for a streaming chat completion given the prompt
  const response = await venusOpenAPIClient.request('http://v2.open.venus.oa.com/chat/single', {
    appGroupId: 2727,
    model: 'gpt-3.5-turbo-16k',
    stream: true,
    messages,

    // 其他配置
    // temperature: 0,
    // top_p: 1,
    // presence_penalty: 0,
    // frequency_penalty: 0,
  })

  // Convert the response into a friendly text-stream
  const stream = VenusStream(response);
  // Respond with the stream
  return new StreamingTextResponse(stream);
}