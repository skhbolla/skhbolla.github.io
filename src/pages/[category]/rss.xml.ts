import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { CATEGORY_MAP } from '../../utils/categories';

export function getStaticPaths() {
  return Object.keys(CATEGORY_MAP).map((category) => {
    return {
      params: { category },
      props: { meta: CATEGORY_MAP[category] },
    };
  });
}

export async function GET(context: any) {
  const { category } = context.params;
  const { meta } = context.props;

  const posts = await getCollection(meta.collection, ({ data }: any) => !data.draft);

  return rss({
    title: meta.title,
    description: meta.description,
    site: context.site,
    items: posts.map((post: any) => ({
      title: post.data.title,
      pubDate: post.data.date,
      description: post.data.description,
      link: `/${category}/${post.id}/`,
    })),
  });
}
