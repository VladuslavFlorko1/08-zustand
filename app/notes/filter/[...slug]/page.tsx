import type { Metadata } from "next";
import { fetchNotes } from "@/lib/api";
import NotesClient from "./Notes.client";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";

type Props = {
  params: Promise<{ slug: string[] }>;
};

export async function generateMetadata(
  { params }: Props
): Promise<Metadata> {
  const { slug } = await params;
  const tag = slug[0];

  const tagTitle = tag === "All" ? "All notes" : `Notes with tag "${tag}"`;
  const description =
    tag === "All"
      ? "Browse all notes in NoteHub."
      : `Browse notes filtered by tag "${tag}" in NoteHub.`;

  return {
    title: `${tagTitle} | NoteHub`,
    description,
    openGraph: {
      title: `${tagTitle} | NoteHub`,
      description,
      url: `https://notehub.app/notes/filter/${tag}`,
      images: [
        {
          url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
          width: 1200,
          height: 630,
          alt: "NoteHub",
        },
      ],
    },
  };
}

const NotesByTag = async ({ params }: Props) => {
  const { slug } = await params;

  const queryClient = new QueryClient();
  const currentPage = 1;
  const searchQuery = "";

  const tagName = slug[0] === "All" ? undefined : slug[0];

  await queryClient.prefetchQuery({
    queryKey: ["notes", currentPage, searchQuery, tagName],
    queryFn: () =>
      fetchNotes({
        page: currentPage,
        perPage: 12,
        search: searchQuery,
        tag: tagName,
      }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient tag={tagName} />
    </HydrationBoundary>
  );
};

export default NotesByTag;
