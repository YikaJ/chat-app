import {
  AIStream,
  type AIStreamParser,
  type AIStreamCallbacksAndOptions,
} from 'ai';


function parseVenusStream(): AIStreamParser {
  return data => {
    const json = JSON.parse(data) as {
      id: string;
      username: string;
      sessionId: string;
      spanId: string;
      alias: string;
      model: string;
      avatarUrl: string;
      request: { role: string; content: string }[];
      response: any;
      remark: string | null;
      rating: number | null;
      attachments: any[];
      responseAttachments: any[];
      subChatRecords: any[];
      createTime: string;
      updateTime: string;
      status: number;
      isLangChain: boolean;
      isLangFlow: boolean;
      isShowOnly: boolean;
      data: string
    };
    return json.data;
  };
}


export function VenusStream(res: Response, cb?: AIStreamCallbacksAndOptions): ReadableStream {
  return AIStream(res, parseVenusStream(), cb)
}

