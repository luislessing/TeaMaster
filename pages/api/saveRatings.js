// pages/api/saveRatings.js
import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const ratingsPath = path.join(process.cwd(), 'public', 'data', 'ratings.json');
    await fs.promises.mkdir(path.dirname(ratingsPath), { recursive: true });
    await fs.promises.writeFile(ratingsPath, JSON.stringify(req.body, null, 2));
    res.status(200).json({ message: 'Ratings saved successfully' });
  } catch (error) {
    console.error('Error saving ratings:', error);
    res.status(500).json({ message: 'Error saving ratings' });
  }
}