const functions = require("firebase-functions");
const admin = require("firebase-admin");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const BLOG_COLLECTION = "blog_posts";

function slugify(value) {
    return String(value)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
}

async function getRecentTitlesAndSlugs() {
    const snapshot = await admin
        .firestore()
        .collection(BLOG_COLLECTION)
        .orderBy("date", "desc")
        .limit(30)
        .get();

    const titles = [];
    const slugs = new Set();
    snapshot.forEach((doc) => {
        const data = doc.data();
        if (data.title) titles.push(data.title);
        if (data.slug) slugs.add(String(data.slug).toLowerCase());
    });
    return { titles, slugs };
}

async function uniqueSlug(baseSlug, existingSlugs) {
    let slug = baseSlug;
    let suffix = 2;
    while (existingSlugs.has(slug)) {
        slug = `${baseSlug}-${suffix}`;
        suffix++;
    }
    return slug;
}

async function generatePostWithGemini(apiKey, avoidTitles) {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-001" });

    const avoidList = avoidTitles.length
        ? `\n\nDo not repeat these already-published topics/titles: ${avoidTitles.join("; ")}.`
        : "";

    const prompt = `
Write a comprehensive, long-form blog post (at least 1200 words) about a trending, genuinely useful topic in web design, web development, Shopify/e-commerce, branding, or digital marketing — relevant to small/medium Australian businesses.

The output must be a single valid JSON object with these fields only:
- title: A catchy, SEO-optimized title.
- slug: A URL-friendly slug based on the title (lowercase, hyphenated).
- excerpt: A compelling 2-3 sentence summary.
- content: The full post in Markdown. Use ## and ### headings, bullet/numbered lists, and blockquotes where useful. Do not embed images.
- tags: An array of 4-6 relevant tags.

Do not include markdown code fences (like \`\`\`json) in the response — return only the raw JSON string.${avoidList}
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text().trim();
    text = text.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/\s*```$/i, "");

    return JSON.parse(text);
}

// Runs daily and drops a new AI-generated blog post into Firestore as an
// unpublished draft — an admin reviews it on /admin/blog and publishes it
// manually. Never auto-publishes.
exports.generateDailyBlogDraft = functions
    .runWith({ timeoutSeconds: 120, memory: "256MB" })
    .pubsub.schedule("0 9 * * *")
    .timeZone("Australia/Sydney")
    .onRun(async () => {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            console.error("GEMINI_API_KEY is not set — skipping daily blog draft generation.");
            return null;
        }

        const { titles, slugs } = await getRecentTitlesAndSlugs();

        let generated;
        try {
            generated = await generatePostWithGemini(apiKey, titles);
        } catch (error) {
            console.error("Failed to generate blog post with Gemini:", error);
            return null;
        }

        const baseSlug = slugify(generated.slug || generated.title || `post-${Date.now()}`);
        const slug = await uniqueSlug(baseSlug, slugs);

        const post = {
            title: generated.title,
            slug,
            excerpt: generated.excerpt || "",
            content: generated.content || "",
            date: new Date().toISOString().split("T")[0],
            author: "AI Assistant",
            tags: Array.isArray(generated.tags) ? generated.tags : [],
            published: false,
        };

        await admin.firestore().collection(BLOG_COLLECTION).add(post);
        console.log(`Created draft blog post "${post.title}" (${post.slug}) for review.`);
        return null;
    });
