/// <reference types="@cloudflare/workers-types" />

type PagesFunction<
  Env = unknown,
  Params extends string = string,
  Data = unknown
> = (context: {
  env: Env;
  params: Record<Params, string | string[] | undefined>;
  data: Data;
  request: Request;
  waitUntil: (promise: Promise<unknown>) => void;
  next: () => Promise<Response>;
}) => Response | Promise<Response>;
