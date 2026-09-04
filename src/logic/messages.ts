import type {InjectionKey, Reactive} from 'vue'
import {inject, reactive} from 'vue'
import type {Post} from '@/logic/models'

/**
 * All user-visible strings in tg-blog. Interpolated messages are functions so
 * consumers aren't locked into any i18n library's placeholder syntax.
 */
export interface TgBlogMessages {
    /** Search input placeholder */
    searchPlaceholder: string
    /** Error card heading, followed by the posts URL */
    loadFailed: string
    /** Header above forwarded posts */
    forwardedFrom: string
    /** Header above reply context */
    replyTo: string
    /** Fallback title for voice messages without metadata */
    voiceMessage: string
    /** Share button tooltip (idle) */
    copyShareLink: string
    /** Share button tooltip (after click) */
    linkCopied: string
    /** Poll subtitle, non-anonymous regular poll */
    poll: string
    /** Poll subtitle, quiz type */
    quiz: string
    /** Prepended to poll/quiz when anonymous (include trailing separator if wanted) */
    anonymousPrefix: string
    /** Poll footer with total response count */
    pollResults: (count: number) => string
    /** Image viewer position label, 1-based index of total */
    photoIndex: (index: number, total: number) => string
    /** moment.js format string for post timestamps */
    dateFormat: string
}

/** English defaults matching tg-blog's historical literals. */
export const defaultMessages: TgBlogMessages = {
    searchPlaceholder: 'Search...',
    loadFailed: 'Failed loading posts from:',
    forwardedFrom: 'Forwarded from:',
    replyTo: 'Reply to:',
    voiceMessage: 'Voice Message',
    copyShareLink: 'Copy share link',
    linkCopied: 'Link copied!',
    poll: 'Poll',
    quiz: 'Quiz',
    anonymousPrefix: 'Anonymous ',
    pollResults: (count) => `Final Results - ${count} Responses`,
    photoIndex: (index, total) => `Photo ${index} of ${total}`,
    dateFormat: 'YYYY-MM-DD H:mm',
}

export const tgbMessagesKey: InjectionKey<Reactive<TgBlogMessages>> = Symbol('tgb-messages')

/** Merge consumer overrides over the English defaults. Reactive so a consumer switching languages live-updates. */
export function createMessages(overrides?: Partial<TgBlogMessages>): Reactive<TgBlogMessages> {
    return reactive({...defaultMessages, ...overrides})
}

/** For child components; falls back to English defaults when used outside <TgBlog>. */
export function useTgbMessages(): TgBlogMessages {
    return inject(tgbMessagesKey, defaultMessages)
}

/**
 * Per-post content translations keyed by post id. Partial: override only the
 * fields that differ (typically just `text`); media, author, dates stay canonical.
 */
export type TgBlogTranslations = Record<number, Partial<Post>>

/** Merge translations over canonical posts. Untranslated posts pass through unchanged. */
export function applyTranslations(posts: Post[], translations?: TgBlogTranslations): Post[] {
    if (!translations) return posts
    return posts.map(p => {
        const t = translations[p.id]
        return t ? {...p, ...t, id: p.id} : p
    })
}
