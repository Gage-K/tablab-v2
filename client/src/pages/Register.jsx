import { Check, Info, X } from "@phosphor-icons/react";
import { Fragment, useEffect, useRef, useState } from "react";
import Header from "../components/Header";
import PageWrapper from "../layouts/PageWrapper";
import Footer from "../components/Footer";
import { Link } from "react-router";
import axios from "../api/axios";

const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const REGISTER_URL = "/api/register";

export default function Register() {
  const userRef = useRef();
  const errRef = useRef();

  const [user, setUser] = useState("");
  const [validName, setValidName] = useState(false);
  const [userFocus, setUserFocus] = useState(false);

  const [pwd, setPwd] = useState("");
  const [validPwd, setValidPwd] = useState(false);
  const [pwdFocus, setPwdFocus] = useState(false);

  const [matchPwd, setMatchPwd] = useState("");
  const [validMatch, setValidMatch] = useState(false);
  const [matchFocus, setMatchFocus] = useState(false);

  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    const result = USER_REGEX.test(user);

    setValidName(result);
  }, [user]);

  useEffect(() => {
    const result = PWD_REGEX.test(pwd);

    setValidPwd(result);
    const match = pwd === matchPwd;
    setValidMatch(match);
  }, [pwd, matchPwd]);

  useEffect(() => {
    setErrMsg("");
  }, [user, pwd, matchPwd]);

  async function handleSubmit(event) {
    event.preventDefault();

    // if button enabled with JS injection
    const v1 = USER_REGEX.test(user);
    const v2 = PWD_REGEX.test(pwd);
    if (!v1 || !v2) {
      setErrMsg("Invalid entry");
      return;
    }
    try {
      const response = await axios.post(
        REGISTER_URL,
        JSON.stringify({ username: user, password: pwd }),
        {
          headers: {
            "Content-Type": "application/json",
            withCredentials: true,
          },
        }
      );
      setSuccess(true);
    } catch (err) {
      if (!err?.response) {
        setErrMsg("No server response");
      } else if (err.response?.status === 409) {
        setErrMsg("Username taken");
      } else {
        setErrMsg("Registration failed");
      }
      errRef.current.focus();
    }
  }

  return (
    <Fragment>
      <Header />
      <PageWrapper>
        <main className="min-h-full">
          <section>
            <p
              ref={errRef}
              className={errMsg ? "errmsg" : "offscreen"}
              aria-live="assertive">
              {errMsg}
            </p>
            <h1>Register</h1>
            <form onSubmit={handleSubmit}>
              <div>
                <label htmlFor="username" className="flex">
                  Username
                  <Check size={16} className={validName ? "valid" : "hidden"} />
                  <X
                    size={16}
                    className={validName || !user ? "hidden" : "invalid"}
                  />
                </label>
                <input
                  type="text"
                  id="username"
                  className="border border-neutral-400"
                  ref={userRef}
                  autoComplete="off"
                  onChange={(e) => setUser(e.target.value)}
                  required
                  aria-invalid={validName ? "false" : "true"}
                  aria-describedby="uidnote"
                  onFocus={() => setUserFocus(true)}
                  onBlur={() => setUserFocus(false)}
                />

                <p
                  id="uidnote"
                  className={
                    userFocus && user && !validName ? "instructions" : "hidden"
                  }>
                  <Info size={16} />
                  4 to 24 characters.
                  <br />
                  Must begin with a letter.
                  <br />
                  Letters, numbers, underscores, hyphens allowed.
                </p>
              </div>

              <div>
                <label htmlFor="password" className="flex">
                  Password:
                  <Check size={16} className={validPwd ? "valid" : "hidden"} />
                  <X
                    size={16}
                    className={validPwd || !pwd ? "hidden" : "invalid"}
                  />
                </label>
                <input
                  type="password"
                  className="border border-neutral-400"
                  id="password"
                  onChange={(e) => setPwd(e.target.value)}
                  value={pwd}
                  required
                  aria-invalid={validPwd ? "false" : "true"}
                  aria-describedby="pwdnote"
                  onFocus={() => setPwdFocus(true)}
                  onBlur={() => setPwdFocus(false)}
                />
                <p
                  id="pwdnote"
                  className={pwdFocus && !validPwd ? "instructions" : "hidden"}>
                  <Info size={16} />
                  8 to 24 characters.
                  <br />
                  Must include uppercase and lowercase letters, a number and a
                  special character.
                  <br />
                  Allowed special characters:{" "}
                  <span aria-label="exclamation mark">!</span>{" "}
                  <span aria-label="at symbol">@</span>{" "}
                  <span aria-label="hashtag">#</span>{" "}
                  <span aria-label="dollar sign">$</span>{" "}
                  <span aria-label="percent">%</span>
                </p>
              </div>

              <div>
                <label htmlFor="confirm_pwd" className="flex">
                  Confirm Password:
                  <Check
                    size={16}
                    className={validMatch && matchPwd ? "valid" : "hidden"}
                  />
                  <X
                    size={16}
                    className={validMatch || !matchPwd ? "hidden" : "invalid"}
                  />
                </label>
                <input
                  type="password"
                  className="border border-neutral-400"
                  id="confirm_pwd"
                  onChange={(e) => setMatchPwd(e.target.value)}
                  value={matchPwd}
                  required
                  aria-invalid={validMatch ? "false" : "true"}
                  aria-describedby="confirmnote"
                  onFocus={() => setMatchFocus(true)}
                  onBlur={() => setMatchFocus(false)}
                />
                <p
                  id="confirmnote"
                  className={
                    matchFocus && !validMatch ? "instructions" : "hidden"
                  }>
                  <Info size={16} />
                  Must match the first password input field.
                </p>
              </div>

              <button
                className={
                  !validName || !validPwd || !validMatch
                    ? "bg-neutral-400 rounded-sm text-neutral-50 p-2"
                    : "bg-neutral-800 rounded-sm text-neutral-50 p-2"
                }
                disabled={
                  !validName || !validPwd || !validMatch ? true : false
                }>
                Sign up
              </button>
            </form>
            <p>Already registered?</p>
            <Link to="/login">Log in</Link>
          </section>
        </main>
      </PageWrapper>
      <Footer />
    </Fragment>
  );
}
