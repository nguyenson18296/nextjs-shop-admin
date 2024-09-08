import { type Metadata } from "next";
import { ListNews } from "./_components/list-news";

export const metadata = { title: `Dashboard | Danh sách tin tức` } satisfies Metadata;

export default function Page(): React.JSX.Element {

  return (
    <ListNews />
  )
}
