export const metadata = {
  title: "Cyrus Links Hub",
  description: "Your personalized landing hub",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, backgroundColor: "#fafafa" }}>
        {children}
      </body>
    </html>
  )
}
