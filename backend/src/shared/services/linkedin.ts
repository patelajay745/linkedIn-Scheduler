import { PostStatus } from "@/generated/prisma/enums";
import prisma from "../lib/prisma";
import { ApiError } from "../utils/apiError";

const LINKEDIN_API_VERSION = process.env.LINKEDIN_API_VERSION!;

class LinkedInService {
  private async getToken(userId: string): Promise<{ accessToken: string }> {
    const linkedInToken = await prisma.linkedInToken.findUnique({
      where: {
        userId,
      },
    });

    if (!linkedInToken) throw new ApiError(404, "tokens not found");

    const isExpired =
      linkedInToken.expiresAt.getTime() - Date.now() < 5 * 60 * 1000;

    if (isExpired) {
      if (!linkedInToken.refreshToken)
        throw new ApiError(401, "Re-authentication required");

      const body = new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: linkedInToken.refreshToken as string,
        client_id: process.env.LINKEDIN_CLIENT_ID!,
        client_secret: process.env.LINKEDIN_CLIENT_SECRET!,
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

      const expiresAt = new Date(Date.now() + tokenData.expires_in * 1000);

      await prisma.linkedInToken.update({
        where: { userId },
        data: {
          accessToken: tokenData.access_token,
          expiresAt,
          ...(tokenData.refresh_token && {
            refreshToken: tokenData.refresh_token,
          }),
        },
      });

      return { accessToken: tokenData.access_token };
    }

    return { accessToken: linkedInToken.accessToken };
  }

  private async uploadImageToLinkedIn(
    userId: string,
    imageUrl: string,
    accessToken: string
  ): Promise<string> {
    const response = await fetch(
      "https://api.linkedin.com/rest/images?action=initializeUpload",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
          "LinkedIn-Version": LINKEDIN_API_VERSION,
        },
        body: JSON.stringify({
          initializeUploadRequest: {
            owner: `urn:li:person:${userId}`,
          },
        }),
      }
    );

    if (!response.ok) {
      throw new ApiError(400, "Bad request,Couln't get linkedin response");
    }

    const { value } = (await response.json()) as {
      value: { uploadUrl: string; image: string };
    };

    const imageRes = await fetch(imageUrl);

    const buffer = await imageRes.arrayBuffer();

    const contentType = imageRes.headers.get("content-type") ?? "image/jpeg";

    const uploadRes = await fetch(value.uploadUrl, {
      method: "PUT",
      headers: { "Content-Type": contentType },
      body: buffer,
    });

    if (!uploadRes.ok)
      throw new ApiError(500, "Failed to upload image to LinkedIn");

    return value.image;
  }

  async publishPost(postId: string, userId: string) {
    const post = await prisma.post.findFirst({
      where: {
        id: postId,
        userId,
      },
    });

    if (!post) throw new ApiError(404, "Invalid postId");

    if (post.status === PostStatus.PUBLISHED) {
      throw new ApiError(400, "Post is already published");
    }

    const token = await this.getToken(userId);

    const urns = await Promise.all(
      post.imageUrls.map((url) =>
        this.uploadImageToLinkedIn(userId, url, token.accessToken)
      )
    );

    const baseBody = {
      author: `urn:li:person:${userId}`,
      commentary: post.content,
      visibility: "PUBLIC",
      distribution: {
        feedDistribution: "MAIN_FEED",
        targetEntities: [],
        thirdPartyDistributionChannels: [],
      },
      lifecycleState: "PUBLISHED",
      isReshareDisabledByAuthor: false,
    };

    const content =
      urns.length === 0
        ? {}
        : urns.length === 1
          ? { content: { media: { id: urns[0] } } }
          : {
              content: {
                multiImage: {
                  images: urns.map((id) => ({ id, altText: "" })),
                },
              },
            };

    const postBody = { ...baseBody, ...content };

    const response = await fetch("https://api.linkedin.com/rest/posts", {
      body: JSON.stringify(postBody),
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token.accessToken}`,
        "LinkedIn-Version": LINKEDIN_API_VERSION,
      },
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error("LinkedIn error:", response.status, errorBody);
      throw new ApiError(500, "Something went wrong while uploading post");
    }

    const postUrn = response.headers.get("x-restli-id");

    await prisma.post.update({
      where: {
        id: postId,
      },
      data: {
        status: PostStatus.PUBLISHED,
        publishedAt: new Date(),
        linkedinPostId: postUrn,
      },
    });
  }
}

export const linkedInService = new LinkedInService();
