import { XRPC, CredentialManager } from "@atcute/client";
import { SocialPskyFeedPost } from "@atcute/client/lexicons";
import "@atcute/bluesky/lexicons";
import { env } from "./env.js";

export const getRPC = async () => {
  const manager = new CredentialManager({ service: env.SERVICE });
  const rpc = new XRPC({ handler: manager });
  await manager.login({ identifier: env.DID, password: env.PASSWORD });
  return rpc;
};

export const writeRecord = async (rpc: XRPC, post: string, rkey: string) => {
  await rpc
    .call("com.atproto.repo.putRecord", {
      data: {
        repo: env.DID,
        collection: "social.psky.feed.post",
        rkey: rkey,
        record: {
          $type: "social.psky.feed.post",
          text: post,
        } as SocialPskyFeedPost.Record,
      },
    })
    .catch((err) => console.log(err));

  return rkey;
};
