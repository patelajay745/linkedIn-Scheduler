import prisma from "@/shared/lib/prisma";
import { ApiError } from "@/shared/utils/apiError";
import { ApiResponse } from "@/shared/utils/apiResponse";
import { asyncHandler } from "@/shared/utils/asyncHandler";
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
    throw new ApiError(400, "Code not found in url,something went wrong");

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

  if (!tokenRes.ok)
    throw new ApiError(400, "Bad request,Couln't get linkedin token");

  const tokenData = (await tokenRes.json()) as {
    access_token: string;
    expires_in: number;
    refresh_token?: string;
  };

  const profileData = await fetch("https://api.linkedin.com/v2/userinfo", {
    method: "GET",
    headers: { Authorization: `Bearer ${tokenData.access_token}` },
  });

  if (!profileData.ok)
    throw new ApiError(400, "Bad request,Couln't get linkedin profile");

  const profile = (await profileData.json()) as {
    sub: string;
    name: string;
    email: string;
  };

  if (profile.sub !== process.env.ALLOWED_LINKEDIN_ID)
    throw new ApiError(403, "Access denied");

  const expiresAt = new Date(Date.now() + tokenData.expires_in * 1000);

  const user = await prisma.user.upsert({
    where: { id: profile.sub },
    update: { name: profile.name, email: profile.email },
    create: {
      id: profile.sub,
      name: profile.name,
      email: profile.email,
    },
  });

  await prisma.linkedInToken.upsert({
    where: { userId: user.id },
    update: {
      accessToken: tokenData.access_token,
      refreshToken: tokenData.refresh_token,
      expiresAt,
    },
    create: {
      accessToken: tokenData.access_token,
      refreshToken: tokenData.refresh_token,
      expiresAt,
      userId: user.id,
    },
  });

  req.session.user = {
    id: profile.sub,
    name: profile.name,
    email: profile.email,
  };

  return res.redirect(process.env.FRONTEND_URL!);
});

export const getUserProfile = asyncHandler(
  async (req: Request, res: Response) => {
    return res.status(200).json(
      new ApiResponse(200, "User is fetched", {
        id: req.session.user?.id,
        name: req.session.user?.name,
        email: req.session.user?.email,
      })
    );
  }
);
