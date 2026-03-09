export default async function handler(req: any, res: any) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    console.warn('Deprecated upload API called. Client uploads should use Firebase Storage directly.');
    return res.status(410).json({
        message: 'This upload endpoint has been retired. Use the Firebase Storage upload flow instead.'
    });
}
