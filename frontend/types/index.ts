export interface UserType {
  id: string;
  name: string;
  email: string;
}

export enum PostStatus {
  DRAFT = "DRAFT",
  SCHEDULED = "SCHEDULED",
  PUBLISHED = "PUBLISHED",
  FAILED = "FAILED",
}

export interface Post {
  id: string;
  content: string;
  imageUrls: string[];
  status: PostStatus;
  scheduledAt: string | null;
  createdAt: string;
  updatedAt: string;
}
