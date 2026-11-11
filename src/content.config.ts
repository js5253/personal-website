// 1. Import utilities from `astro:content`
import { defineCollection } from 'astro:content';

// 2. Import loader(s)
import { glob, file } from 'astro/loaders';

// 3. Import Zod
import { z } from 'astro/zod';

// 4. Define a `loader` and `schema` for each collection
const blog = defineCollection({
    loader: glob({ base: './src/pages/blog', pattern: '**/*.{md,mdx}' }),
    schema: z.object({
        title: z.string(),
        subtitle: z.string(),
        date: z.coerce.date().optional(),
    }),
});

const project = defineCollection({
    loader: glob({ base: './src/pages/projects', pattern: '**/*.{md,mdx}' }),
    schema: z.object({
        title: z.string(),
        type: z.string(),
        subtitle: z.string().optional(),
        technologiesUsed: z.array(z.string()).optional(),
        codeLink: z.string().optional(),
        screenshots: z.array(z.string()).optional()
    }),
});

const workExperience = defineCollection({
    loader: glob({ base: './src/pages/work-experience', pattern: '**/*.{md,mdx}' }),
    schema: z.object({
        title: z.string(),
        subtitle: z.string().optional()
    }),
});
// 5. Export a single `collections` object to register your collection(s)
export const collections = { blog, project, workExperience};