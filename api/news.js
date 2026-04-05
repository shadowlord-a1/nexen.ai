let newsData = [];

export default function handler(req, res) {
    if (req.method === "POST") {
        newsData = req.body.news || [];
        return res.status(200).json({ success: true });
    }

    if (req.method === "GET") {
        return res.status(200).json(newsData);
    }

    res.status(405).end();
}