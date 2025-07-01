// import { useState } from "react";
// import { useNavigate, Link } from "react-router-dom";

// export default function Signup() {
//   const navigate = useNavigate();
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError(""); // clear previous errors

//     try {
//       const res = await fetch("http://localhost:5000/api/auth/signup", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ email, password }),
//       });

//       const data = await res.json();

//       if (!res.ok) {
//         setError(data.message || "Signup failed");
//       } else {
//         localStorage.setItem("token", data.token); // save JWT token returned from backend
//         navigate("/notes");
//       }
//     } catch (err) {
//       setError("Something went wrong. Please try again.");
//       console.error(err);
//     }
//   };

//   return (
//     <div style={{ maxWidth: 400, margin: "auto", paddingTop: 50 }}>
//       <h2>Signup</h2>
//       <form onSubmit={handleSubmit}>
//         <input
//           type="email"
//           placeholder="Email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           required
//           style={{ width: "100%", marginBottom: 10 }}
//         />
//         <input
//           type="password"
//           placeholder="Password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           required
//           style={{ width: "100%", marginBottom: 10 }}
//         />
//         <button type="submit" style={{ width: "100%" }}>
//           Signup
//         </button>
//       </form>
//       {error && <p style={{ color: "red" }}>{error}</p>}
//       <p>
//         Already have an account? <Link to="/login">Login</Link>
//       </p>
//     </div>
//   );
// }

// import { useState } from "react";
// import { useNavigate, Link } from "react-router-dom";

// export default function Signup() {
//   const navigate = useNavigate();
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     // Fake signup (no backend)
//     if (email && password) {
//       localStorage.setItem("token", "fake-jwt-token");
//       navigate("/notes");
//     } else {
//       setError("Please fill all fields");
//     }
//   };

//   return (
//     <div style={{ maxWidth: 400, margin: "auto", paddingTop: 50 }}>
//       <h2>Signup</h2>
//       <form onSubmit={handleSubmit}>
//         <input
//           type="email"
//           placeholder="Email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           required
//           style={{ width: "100%", marginBottom: 10 }}
//         />
//         <input
//           type="password"
//           placeholder="Password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           required
//           style={{ width: "100%", marginBottom: 10 }}
//         />
//         <button type="submit" style={{ width: "100%" }}>
//           Signup
//         </button>
//       </form>
//       {error && <p style={{ color: "red" }}>{error}</p>}
//       <p>
//         Already have an account? <Link to="/login">Login</Link>
//       </p>
//     </div>
//   );
// }




import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Signup() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Signup failed");
      } else {
        localStorage.setItem("token", data.token);
        // Assuming backend returns username on signup success
        localStorage.setItem("username", data.username || username);
        navigate("/notes");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
  <div className="auth-container">
      <h2>Signup</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          style={{ width: "100%", marginBottom: 10 }}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ width: "100%", marginBottom: 10 }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ width: "100%", marginBottom: 10 }}
        />
        <button type="submit" style={{ width: "100%" }} disabled={loading}>
          {loading ? "Signing up..." : "Signup"}
        </button>
      </form>
      {error && <p style={{ color: "red" }} aria-live="assertive">{error}</p>}
      <p>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
}
