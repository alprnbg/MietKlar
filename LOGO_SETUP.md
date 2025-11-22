# Munich Logo Setup Instructions

## Important: Save Logo Images

The application expects two logo images in the `public/images/` directory:

### 1. Dark Mode Logo
- **File name:** `munich-logo-dark.png`
- **Location:** `public/images/munich-logo-dark.png`
- **Description:** Black and white Münchner Kindl logo (for dark mode)
- **Source:** The first image you provided in the chat

### 2. Light Mode Logo
- **File name:** `munich-logo-light.png`
- **Location:** `public/images/munich-logo-light.png`
- **Description:** Colored Münchner Kindl logo with yellow/red accents (for light mode)
- **Source:** The second image you provided in the chat

## Steps to Add the Logos:

1. Create the directory if it doesn't exist:
   ```bash
   mkdir -p public/images
   ```

2. Save the two logo images you provided:
   - Save the **black and white** logo as `public/images/munich-logo-dark.png`
   - Save the **colored** logo as `public/images/munich-logo-light.png`

3. The logos will automatically appear:
   - In the header (top left)
   - In the legend (bottom left)
   - On the start page (centered at top)

## Logo Display Behavior:

- **Light Mode**: Shows `munich-logo-light.png` (colored version)
- **Dark Mode**: Shows `munich-logo-dark.png` (black & white version)
- Logos automatically switch when you toggle between light/dark themes

## If Logos Don't Load:

If the images don't load, the application will gracefully hide the `<img>` elements without breaking the layout.
