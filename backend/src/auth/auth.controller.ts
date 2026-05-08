import { ApiError } from "@/utils/apiError";
import { ApiResponse } from "@/utils/apiResponse";
import { asyncHandler } from "@/utils/asyncHandler";
import type { Request, Response } from "express";

export const redirectToLinkedIn = asyncHandler(
  async (req: Request, res: Response) => {
    const params = new URLSearchParams({
      response_type: "code",
      client_id: process.env.LINKEDIN_CLIENT_ID!,
      redirect_uri: process.env.LINKEDIN_REDIRECT_URI!,
      scope: "openid profile email w_member_social",
    });

    res.redirect(`https://www.linkedin.com/oauth/v2/authorization?${params}`);
  }
);

export const callback = asyncHandler(async (req: Request, res: Response) => {
  const code = req.query["code"];

  if (!code)
    throw new ApiError(500, "Code not found in url,something went wrong");

  const body = new URLSearchParams({
    grant_type: "authorization_code",
    code: code as string,
    client_id: process.env.LINKEDIN_CLIENT_ID!,
    client_secret: process.env.LINKEDIN_CLIENT_SECRET!,
    redirect_uri: process.env.LINKEDIN_REDIRECT_URI!,
  });

  const tokenRes = await fetch(
    "https://www.linkedin.com/oauth/v2/accessToken",
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
    }
  );

  const tokenData = (await tokenRes.json()) as {
    access_token: string;
    expires_in: number;
    refresh_token?: string;
  };

  return res
    .status(200)
    .json(new ApiResponse(200, "Code are fetched", tokenData));
});
