import {
  AIStream,
  type AIStreamParser,
  type AIStreamCallbacksAndOptions,
} from 'ai';


function parseVenusStream(): AIStreamParser {
  return data => {
    console.debug('venus reponse', data)
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
    } & {
      traceId: string;
      code: number;
      message: string;
    };

    // 如果报错了
    if (json.code) {
      return `服务出错了!
      错误码：${json.code}。
      错误信息：${json.message}。`
    }

    return json.data;
  };
}


export function VenusStream(res: Response, cb?: AIStreamCallbacksAndOptions): ReadableStream {
  return AIStream(res, parseVenusStream(), cb)
}

