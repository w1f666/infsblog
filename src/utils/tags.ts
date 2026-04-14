import type { CollectionEntry } from 'astro:content';

export function getTagSlug(tag: string) {
	return tag;
}

export function getTagHref(tag: string) {
	return `/tags/${getTagSlug(tag)}/`;
}

export function getTagMap(posts: CollectionEntry<'blog'>[]) {
	const tagMap = new Map<string, CollectionEntry<'blog'>[]>();

	for (const post of posts) {
		for (const tag of post.data.tags) {
			const existing = tagMap.get(tag) ?? [];
			tagMap.set(tag, [...existing, post]);
		}
	}

	return [...tagMap.entries()]
		.map(([tag, taggedPosts]) => ({
			tag,
			posts: taggedPosts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf()),
			count: taggedPosts.length,
		}))
		.sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag, 'zh-CN'));
}