import axios, { AxiosResponse } from "axios";

export async function authGetRequest(token: string, endpoint: string): Promise<AxiosResponse<any, any>> {
  return await axios({ url: endpoint, headers: { Authorization: `Bearer ${token}` }, method: "GET" });
}

export async function authPostRequest(token: string, endpoint: string, data: any): Promise<AxiosResponse<any, any>> {
  return await axios({ url: endpoint, data, headers: { Authorization: `Bearer ${token}` }, method: "POST" });
}
