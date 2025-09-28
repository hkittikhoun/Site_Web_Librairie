import { useState } from "react";
import "./Signup.css";
import { useNavigate, Link } from "react-router-dom";
import Spinner from "../UIElements/LoadingSpinner";
import ModalMessageErreur from "../UIElements/ModalMessageErreur";

export default function Signup() {
  const [passwordAreNotEqual, setPasswordAreNotEqual] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  async function handleSubmit(event) {
    setIsLoading(true);
    event.preventDefault();
    const fd = new FormData(event.target);
    const data = Object.fromEntries(fd.entries());

    if (data.password !== data["confirm-password"]) {
      setPasswordAreNotEqual(true);
      setIsLoading(false);
      return;
    }

    const userData = {
      name: `${data["first-name"]} ${data["last-name"]}`,
      email: data.email,
      password: data.password,
    };

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}api/users/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        }
      );

      if (!response.ok) {
        throw new Error(`Une erreur est survenue : ${response.status}`);
      }

      const responseData = await response.json();
      console.log("Retour : ", responseData);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
      navigate("/login");
    }

    event.target.reset();
    setPasswordAreNotEqual(false);
  }

  return (
    <>
      <div>
        {isLoading && <Spinner />}
        <ModalMessageErreur message={error} onClose={() => setError(null)} />
      </div>
      <form onSubmit={handleSubmit}>
        <h2>Welcome on board!</h2>
        <p>We just need a little bit of data from you to get you started 🚀</p>

        <div className="control">
          <label htmlFor="email">Email</label>
          <input id="email" type="email" name="email" required />
        </div>

        <div className="control-row">
          <div className="control">
            <label htmlFor="password">Password</label>
            <input id="password" type="password" name="password" required />
          </div>
          <div className="control">
            <label htmlFor="confirm-password">Confirm Password</label>
            <input
              id="confirm-password"
              type="password"
              name="confirm-password"
              required
            />
            {passwordAreNotEqual && (
              <div className="control-error">
                <p>Passwords must match.</p>
              </div>
            )}
          </div>
        </div>

        <hr />

        <div className="control-row">
          <div className="control">
            <label htmlFor="first-name">First Name</label>
            <input type="text" id="first-name" name="first-name" required />
          </div>

          <div className="control">
            <label htmlFor="last-name">Last Name</label>
            <input type="text" id="last-name" name="last-name" required />
          </div>
        </div>

        <div className="control">
          <label htmlFor="terms-and-conditions">
            <input
              type="checkbox"
              id="terms-and-conditions"
              name="terms"
              required
            />{" "}
            I agree to the terms and conditions
          </label>
        </div>

        <p className="form-actions">
          <Link to="/auth" className="button button-flat">
            Login
          </Link>
          <button type="submit" className="button">
            Sign up
          </button>
        </p>
      </form>
    </>
  );
}
