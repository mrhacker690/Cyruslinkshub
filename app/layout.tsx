import './globals.css'; // Make sure this file exists in your app folder

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <nav>
          {/* Your Navigation Menu */}
          <a href="/">Home</a>
          <a href="/games">Games</a>
          <a href="/tools">Tools</a>
        </nav>
        {children} {/* This is where your page content will appear */}
      </body>
    </html>
  );
}
