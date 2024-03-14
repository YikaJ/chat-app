import { orderQuery } from './utils'
import urlParse from 'url'
import crypto from 'crypto'

export default class VenusOpenAPI {
  constructor(secretId, secretKey) {
    this.secretId = secretId;
    this.secretKey = secretKey;
  }

  geneVenusSign(req, body, timeStamp) {
    const hmc = crypto.createHmac('sha256', encodeURIComponent(this.secretKey));
    const bodyStr = typeof body === 'object' ? JSON.stringify(body) : '';
    const algorithm = "HMAC-SHA256";
    const pathSign = crypto.createHash('sha256').update(req.pathname).digest("hex").toLocaleUpperCase();
    const querySign = crypto.createHash('sha256').update(req.query).digest("hex").toLocaleUpperCase();
    const bodySign = crypto.createHash('sha256').update(bodyStr).digest("hex").toLocaleUpperCase();
    const signStr = [algorithm, this.secretId, timeStamp, pathSign, querySign, bodySign].join('\n');
    const hmcRet = hmc.update(signStr).digest('hex').toLocaleUpperCase();
    return `${algorithm} Credential=${this.secretId}/${timeStamp} Signature=${hmcRet}`
  }

  async request(url, body = {}, customerHeader = {}) {
    const req = urlParse.parse(url);
    const orderQueryStr = orderQuery(req.query || '');
    req.query = orderQueryStr;
    const timeStamp = parseInt(new Date().getTime() / 1000)
    const venusSign = this.geneVenusSign(req, body, timeStamp)
    const headers = {
      ...customerHeader
    }
    headers['Content-Type'] = "application/json"
    headers["SecretId"] = this.secretId;
    headers["Venusopenapi-Authorization"] = venusSign;

    const response = await fetch(req.href, {
      headers,
      method: 'POST',
      body: JSON.stringify(body),
    })
    return response
  }
}