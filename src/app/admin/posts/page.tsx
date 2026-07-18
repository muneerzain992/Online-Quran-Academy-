import type { Metadata } from "next";
import { PostsAdmin } from "@/components/cms/PostsAdmin";

export const metadata: Metadata = { title: "CMS — Blog posts" };

export default function AdminPostsPage() {
  return <PostsAdmin />;
}
