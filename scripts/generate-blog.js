import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Gemini API
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
    console.error("Error: GEMINI_API_KEY environment variable is not set.");
    process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const DATA_FILE = path.join(__dirname, "../data/blog-posts.json");

async function generateBlogPost() {
    try {
        console.log("Generating blog post...");

        const prompt = `
      Write a blog post about a trending topic in web design, development, or digital marketing.
      The output must be a valid JSON object with the following fields:
      - title: A catchy title.
      - slug: A URL-friendly slug based on the title.
      - excerpt: A short summary (1-2 sentences).
      - content: The full blog post content in Markdown format. Use ## for headings.
      - tags: An array of 3-5 relevant tags.
      
      Do not include markdown code blocks (like \`\`\`json) in the response, just the raw JSON string.
    `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        let text = response.text();

        // Clean up potential markdown code blocks if the model adds them despite instructions
        text = text.replace(/^```json\s*/, "").replace(/\s*```$/, "");

        const newPost = JSON.parse(text);

        // Add metadata
        newPost.id = Date.now().toString();
        newPost.date = new Date().toISOString().split("T")[0];
        newPost.author = "PixelPro AI";

        // Read existing posts
        let posts = [];
        if (fs.existsSync(DATA_FILE)) {
            const fileContent = fs.readFileSync(DATA_FILE, "utf-8");
            posts = JSON.parse(fileContent);
        }

        // Prepend new post
        posts.unshift(newPost);

        // Save back to file
        fs.writeFileSync(DATA_FILE, JSON.stringify(posts, null, 2));

        console.log(`Successfully generated and saved: "${newPost.title}"`);

    } catch (error) {
        console.error("Error generating blog post:", error);
    }
}

generateBlogPost();
