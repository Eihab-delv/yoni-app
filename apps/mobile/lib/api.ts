import createFetchClient, { Middleware } from "openapi-fetch";
import { getAuth } from "@react-native-firebase/auth";
import createClient from "openapi-react-query";
import type { v1 } from "@repo/openapi-schema";
import { env } from "./env";
import { log } from "@/utils";

export const fetchClient = createFetchClient<v1.paths>({
  baseUrl: env.EXPO_PUBLIC_API_BASE_URL,
});

export const $api = createClient(fetchClient);

const authMiddleware: Middleware = {
  async onRequest({ request }) {
    const auth = getAuth();
    if (!auth) throw new Error("Missing auth");
    if (!auth.currentUser) throw new Error("No current user");
    const idToken = await auth.currentUser.getIdToken();
    console.log("idToken", idToken);
    request.headers.set("Authorization", `Bearer ${idToken}`);
    return request;
  },
  onError({ error }) {
    return new Error("Oops, fetch failed", { cause: error });
  },
};

const loggingMiddleware: Middleware = {
  async onRequest({ request }) {
    log.info("Request initiated", {
      url: request.url,
      method: request.method,
      headers: Object.fromEntries(request.headers.entries()),
      body: request.body,
    });
    return request;
  },
  async onResponse({ response }) {
    log.info("Response received", {
      url: response.url,
      status: response.status,
      headers: Object.fromEntries(response.headers.entries()),
      body: await response.clone().json().catch(() => null),
    });
    return response;
  },
  onError({ error, request, }) {
    log.error("Request failed", {
      error,
      url: request.url,
      status: request.body
    });
  },
};

fetchClient.use(authMiddleware);
fetchClient.use(loggingMiddleware);
