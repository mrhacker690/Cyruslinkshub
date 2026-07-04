import { signIn } from "next-auth/react"

export default function LoginPage() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "15px", maxWidth: "340px", margin: "100px auto", padding: "25px", fontFamily: "sans-serif", border: "1px solid #ddd", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}>
      <h2 style={{ textAlign: "center", marginBottom: "5px" }}>Welcome</h2>
      <p style={{ textAlign: "center", color: "#666", marginTop: "0", marginBottom: "20px" }}>Sign in to your account</p>
      
      {/* Google Login Button */}
      <button 
        onClick={() => signIn("google")} 
        style={{ width: "100%", padding: "12px", background: "#4285F4", color: "#fff", border: "none", borderRadius: "6px", fontWeight: "bold", cursor: "pointer" }}
      >
        Continue with Google
      </button>

      {/* GitHub Login Button */}
      <button 
        onClick={() => signIn("github")} 
        style={{ width: "100%", padding: "12px", background: "#24292e", color: "#fff", border: "none", borderRadius: "6px", fontWeight: "bold", cursor: "pointer" }}
      >
        Continue with GitHub
      </button>

      {/* Discord Login Button */}
      <button 
        onClick={() => signIn("discord")} 
        style={{ width: "100%", padding: "12px", background: "#5865F2", color: "#fff", border: "none", borderRadius: "6px", fontWeight: "bold", cursor: "pointer" }}
      >
        Continue with Discord
      </button>
    </div>
  )
}
