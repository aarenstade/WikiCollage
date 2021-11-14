import axios from "axios";

export async function authGetRequest(token: string, endpoint: string) {
  return await axios({ url: endpoint, headers: { Authorization: `Bearer ${token}` }, method: "GET" });
}

export async function authPostRequest(token: string, endpoint: string, data: any) {
  return await axios({ url: endpoint, data, headers: { Authorization: `Bearer ${token}` }, method: "POST" });
}
