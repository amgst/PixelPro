// Saves an admin-uploaded product image into the GitHub repo at
// public/products/<name>. The commit triggers a Vercel redeploy, after which
// the image is served from https://<site>/products/<name>.
//
// Required env vars (Vercel project settings):
//   GITHUB_TOKEN   fine-grained token with "Contents: Read and write" on the repo
//   GITHUB_REPO    "owner/repo", e.g. "amgst/PixelPro"
//   GITHUB_BRANCH  optional, defaults to "main"
//   VITE_FIREBASE_API_KEY (already set) used to verify the caller's Firebase ID token
//   VITE_ADMIN_EMAILS / ADMIN_EMAILS optional email allowlist, same as the admin UI

const MAX_BYTES = 3 * 1024 * 1024; // decoded image size
const FILENAME_RE = /^[a-z0-9][a-z0-9-]{0,80}\.(jpg|png|webp)$/;

const getAdminAllowlist = (): string[] =>
    [process.env.ADMIN_EMAILS, process.env.VITE_ADMIN_EMAILS]
        .filter(Boolean)
        .join(',')
        .split(',')
        .map(e => e.trim().toLowerCase())
        .filter(Boolean);

// Validates the Firebase ID token with Google's Identity Toolkit (which rejects
// invalid or expired tokens) and applies the same admin rules as the admin UI:
// the `admin` custom claim, or a verified email on the allowlist.
async function isAdminToken(idToken: string): Promise<boolean> {
    const apiKey = process.env.FIREBASE_API_KEY || process.env.VITE_FIREBASE_API_KEY;
    if (!apiKey) throw new Error('Firebase API key is not configured on the server.');

    const res = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken }),
    });
    if (!res.ok) return false;

    const data: any = await res.json();
    const user = data?.users?.[0];
    if (!user || user.disabled) return false;

    try {
        if (user.customAttributes && JSON.parse(user.customAttributes).admin === true) return true;
    } catch {
        // ignore malformed claims
    }

    const email = typeof user.email === 'string' ? user.email.toLowerCase() : '';
    return !!email && user.emailVerified === true && getAdminAllowlist().includes(email);
}

function hasImageSignature(buf: Buffer, ext: string): boolean {
    if (ext === 'jpg') return buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff;
    if (ext === 'png') return buf.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
    if (ext === 'webp') return buf.subarray(0, 4).toString('ascii') === 'RIFF' && buf.subarray(8, 12).toString('ascii') === 'WEBP';
    return false;
}

export default async function handler(req: any, res: any) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const token = process.env.GITHUB_TOKEN;
    const repo = process.env.GITHUB_REPO;
    const branch = process.env.GITHUB_BRANCH || 'main';
    if (!token || !repo) {
        return res.status(500).json({ message: 'Image uploads are not configured (GITHUB_TOKEN / GITHUB_REPO missing).' });
    }

    const authHeader: string = req.headers?.authorization || '';
    const idToken = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';
    if (!idToken) {
        return res.status(401).json({ message: 'Not signed in.' });
    }

    try {
        if (!(await isAdminToken(idToken))) {
            return res.status(403).json({ message: 'Only admins can upload images.' });
        }
    } catch (err: any) {
        console.error('Admin check failed:', err);
        return res.status(500).json({ message: 'Could not verify your sign-in.' });
    }

    const { filename, content } = (req.body || {}) as { filename?: string; content?: string };
    if (typeof filename !== 'string' || !FILENAME_RE.test(filename)) {
        return res.status(400).json({ message: 'Invalid file name.' });
    }
    if (typeof content !== 'string' || content.length === 0) {
        return res.status(400).json({ message: 'No image data received.' });
    }

    const buf = Buffer.from(content, 'base64');
    if (buf.length > MAX_BYTES) {
        return res.status(413).json({ message: 'Image is too large (max 3MB after compression).' });
    }
    const ext = filename.split('.').pop()!;
    if (!hasImageSignature(buf, ext)) {
        return res.status(400).json({ message: 'File is not a valid image.' });
    }

    const repoPath = `public/products/${filename}`;
    const ghRes = await fetch(`https://api.github.com/repos/${repo}/contents/${repoPath}`, {
        method: 'PUT',
        headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/vnd.github+json',
            'X-GitHub-Api-Version': '2022-11-28',
            'User-Agent': 'wbify-admin-upload',
        },
        body: JSON.stringify({
            message: `chore: add product image ${filename}`,
            content: buf.toString('base64'),
            branch,
        }),
    });

    if (!ghRes.ok) {
        const text = await ghRes.text();
        console.error('GitHub upload failed:', ghRes.status, text);
        const message =
            ghRes.status === 422
                ? 'A file with this name already exists. Please try again.'
                : 'Saving the image to GitHub failed.';
        return res.status(502).json({ message });
    }

    return res.status(200).json({ path: `/products/${filename}` });
}
