import formidable from 'formidable';
import fs from 'fs';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const form = new formidable.IncomingForm();
  form.parse(req, (err, fields, files) => {
    if (err) {
      console.error('Upload error:', err);
      res.status(500).json({ error: 'File upload error' });
      return;
    }
    // ...process files and fields as needed...
    res.status(200).json({ message: 'Upload successful' });
  });
}
