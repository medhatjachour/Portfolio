# Resume Setup Instructions

## Adding Your Resume

To enable the resume download feature:

1. **Create/Export your resume as a PDF file**
2. **Name it `resume.pdf`**
3. **Replace the placeholder file** at `/public/resume.pdf` with your actual resume

The resume download button in the Hero section will automatically link to `/resume.pdf`.

## Alternative Approach

If you prefer to host your resume elsewhere (Google Drive, Dropbox, etc.):

1. Open `/src/components/organisms/Hero.jsx`
2. Find the resume download link (search for `href="/resume.pdf"`)
3. Replace it with your external URL: `href="https://your-url-here.com/resume.pdf"`

## Tips

- Keep your resume PDF file size under 2MB for faster downloads
- Make sure the filename doesn't contain spaces or special characters
- Update your resume regularly to showcase your latest achievements
