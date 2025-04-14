import Header from "../components/Header";
import Footer from "../components/Footer";
import PageWrapper from "../layouts/PageWrapper";
import { Fragment, useEffect, useState, useRef, useContext } from "react";
import AuthContext from "../context/authProvider";
import { Link, useNavigate, useLocation } from "react-router";
import axios from "../api/axios";
import useAuth from "../hooks/useAuth";

const LOGIN_URL = "/api/login";

export default function Login() {
  const { setAuth } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const userRef = useRef();
  const errRef = useRef();

  const [user, setUser] = useState("");
  const [pwd, setPwd] = useState("");
  const [errMsg, setErrMsg] = useState("");

  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    setErrMsg("");
  }, [user, pwd]);

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const response = await axios.post(
        LOGIN_URL,
        JSON.stringify({ username: user, password: pwd }),
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      const accessToken = response.data.token;
      setAuth({ user, pwd, accessToken });
      navigate(from, { replace: true });
    } catch (err) {
      if (!err?.response) {
        setErrMsg("No server response.");
      } else if (err.response?.status === 400) {
        setErrMsg("Missing username or password");
      } else if (err.response?.status === 401) {
        setErrMsg("Unauthorized");
      } else {
        setErrMsg("Login failed");
      }
      errRef.current.focus();

      console.error(err);
    }

    setUser("");
    setPwd("");
  }

  return (
    <Fragment>
      <Header />
      <PageWrapper>
        <main className="min-h-screen">
          <section>
            <p
              ref={errRef}
              className={errMsg ? "errmsg" : "hidden"}
              aria-live="assertive">
              {errMsg}
            </p>
            <h1>Log in</h1>
            <form onSubmit={handleSubmit}>
              <div>
                <label htmlFor="username" className="flex">
                  Username:
                </label>
                <input
                  type="text"
                  className="border border-neutral-400"
                  id="username"
                  ref={userRef}
                  autoComplete="off"
                  onChange={(e) => setUser(e.target.value)}
                  value={user}
                  required
                />
              </div>
              <div>
                <label htmlFor="password" className="flex">
                  Password:
                </label>
                <input
                  type="password"
                  className="border border-neutral-400"
                  id="password"
                  onChange={(e) => setPwd(e.target.value)}
                  value={pwd}
                  required
                />
              </div>
              <button>Sign in</button>
            </form>
            <p>Don't have an account?</p>
            <Link to="/register">Sign up</Link>
          </section>
        </main>
      </PageWrapper>
      <Footer />
    </Fragment>
  );
}
