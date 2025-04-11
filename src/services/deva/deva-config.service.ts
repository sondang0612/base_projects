import crypto, { Sign } from "node:crypto";
import { HttpMethods } from "../../types/http-methods";
import { AppError } from "../../utils/appError";

class DevaConfigService {
  private AUTH_SCHEME = "DEVAPLAY-SHA256-RSA2048";
  private AUTH_TIME_TOLERANCE = 300;
  private serverUrl;
  private agentCode;
  private callbackPublicKey;
  private signerKey;
  private signer: Sign;
  private verifierKey: any;
  private verifier: any;

  constructor() {
    this.serverUrl = process.env.DEVA_SERVER_URL;
    this.serverUrl = process.env.DEVA_SERVER_URL;
    this.agentCode = process.env.DEVA_AGENT_CODE;
    this.callbackPublicKey = process.env.DEVA_CALLBACK_PUBLIC_KEY;

    this.signerKey = crypto.createPrivateKey({
      key: process.env.DEVA_PRIVATE_KEY || "",
      format: "pem",
      type: "pkcs1",
    });
  }

  protected generateSignature(inputText: any) {
    this.signer = crypto.createSign("SHA256");
    this.signer.write(inputText);
    this.signer.end();
    return this.signer.sign(this.signerKey, "base64");
  }

  protected generateAuthHeader(httpMethod: HttpMethods, apiPath: string) {
    apiPath = apiPath.toLowerCase();
    const timestamp = new Date().getTime();
    const nonceString = crypto.randomUUID();

    const inputText = `${httpMethod} ${apiPath} ${timestamp} ${nonceString}`;
    const signature = this.generateSignature(inputText);

    return `${this.AUTH_SCHEME} ${this.agentCode},${timestamp},${nonceString},${signature}`;
  }

  protected buildUrl(...sections: (string | null | undefined)[]): string {
    return sections
      .filter(
        (section): section is string =>
          typeof section === "string" && section.trim() !== ""
      )
      .map((section) => section.replace(/^\/+|\/+$/g, ""))
      .join("/");
  }

  protected async get<T>(apiPath: string, params?: any): Promise<T | null> {
    let url = this.buildUrl(this.serverUrl, apiPath);
    if (params) url += "?" + new URLSearchParams(params);

    const response = await fetch(url, {
      headers: {
        Authorization: this.generateAuthHeader("GET", apiPath),
      },
    });
    const data = await response.json();

    if (response?.status != 200 || data?.status !== "OK")
      throw new AppError(data?.status, response.status);

    return data?.result;
  }

  protected async post<T>(apiPath: string, body: any): Promise<T | null> {
    let url = this.buildUrl(this.serverUrl, apiPath);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: this.generateAuthHeader("POST", apiPath),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    const data = await response.json();

    if (response?.status != 200 || data?.status !== "OK")
      throw new AppError(data?.status, 500);

    return data;
  }

  protected initVerifier() {
    this.verifierKey = crypto.createPublicKey({
      key: this.callbackPublicKey || "",
      format: "pem",
      type: "pkcs1",
    });
    this.verifier = crypto.createVerify("SHA256");
  }

  protected verifySignature(inputText: any, signature: any) {
    this.verifier.update(inputText);
    this.verifier.end();
    return this.verifier.verify(this.verifierKey, signature, "base64");
  }

  protected verifyTimestamp(strTimestamp: any) {
    const timestamp = +strTimestamp;
    const timeDifference = (new Date().getTime() - timestamp) / 1000.0;
    return Math.abs(timeDifference) <= this.AUTH_TIME_TOLERANCE;
  }

  protected verifyNonceString(nonceString: any) {
    return !!nonceString;
  }

  protected verifyAuthHeader(
    httpMethod: HttpMethods,
    apiPath: string,
    authHeader: any
  ) {
    const parts = authHeader.split(" ");
    if (parts.length != 2) return false;

    if (parts[0] != this.AUTH_SCHEME) return false;

    const authParams = parts[1].split(",");
    if (authParams.length != 4) return false;

    const agentCode = authParams[0];
    const strTimestamp = authParams[1];
    const nonceString = authParams[2];
    const signature = authParams[3];

    if (agentCode != this.agentCode) return false;
    if (!this.verifyNonceString(nonceString)) return false;
    if (!this.verifyTimestamp(strTimestamp)) return false;

    const inputText = `${httpMethod} ${apiPath} ${strTimestamp} ${nonceString}`;
    if (!this.verifySignature(inputText, signature)) return false;

    return true;
  }

  authorize(httpMethod: HttpMethods, apiPath: string, authHeader: any) {
    return this.verifyAuthHeader(httpMethod, apiPath, authHeader);
  }
}

export { DevaConfigService };
