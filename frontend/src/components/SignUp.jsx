import { Link } from "react-router-dom";
import "./SignUp.css";

function SignUp() {
  return (
    <section className="signup-section">

      <div className="signup-container">

        {/* =================================
            LEFT SIDE
        ================================= */}

        <div className="signup-intro">

          <div className="signup-logo">
            SM <span>EventAura</span>
          </div>

          <p className="signup-label">
            ✦ WELCOME TO SM EVENTAURA ✦
          </p>

          <h1>
            Create Your
            <br />
            Account
          </h1>

          <p className="signup-description">
            Join SM EventAura and make your special celebrations
            beautiful, memorable and truly yours.
          </p>

        </div>


        {/* =================================
            REGISTRATION FORM
        ================================= */}

        <div className="signup-card">

          <div className="signup-heading">

            <h2>Create Account</h2>

            <p>
              Register to book your decoration consultation.
            </p>

          </div>


          <form className="signup-form">

            {/* Full Name */}

            <div className="form-group">

              <label htmlFor="signup-name">
                Full Name
              </label>

              <input
                id="signup-name"
                type="text"
                placeholder="Enter your full name"
                required
              />

            </div>


            {/* Email */}

            <div className="form-group">

              <label htmlFor="signup-email">
                Email Address
              </label>

              <input
                id="signup-email"
                type="email"
                placeholder="Enter your email"
                required
              />

            </div>


            {/* Phone */}

            <div className="form-group">

              <label htmlFor="signup-phone">
                Phone Number
              </label>

              <input
                id="signup-phone"
                type="tel"
                placeholder="Enter your phone number"
                required
              />

            </div>


            {/* Passwords */}

            <div className="form-row">

              <div className="form-group">

                <label htmlFor="signup-password">
                  Password
                </label>

                <input
                  id="signup-password"
                  type="password"
                  placeholder="Create password"
                  required
                />

              </div>


              <div className="form-group">

                <label htmlFor="signup-confirm">
                  Confirm Password
                </label>

                <input
                  id="signup-confirm"
                  type="password"
                  placeholder="Confirm password"
                  required
                />

              </div>

            </div>


            {/* Terms */}

            <label className="terms">

              <input
                type="checkbox"
                required
              />

              <span>
                I agree to the terms and conditions.
              </span>

            </label>


            {/* Submit */}

            <button
              type="submit"
              className="signup-submit"
            >
              Create Account
              <span>✦</span>
            </button>


            {/* Login Link */}

            <p className="login-link">

              Already have an account?

              <Link to="/login">
                Sign In
              </Link>

            </p>

          </form>

        </div>

      </div>

    </section>
  );
}

export default SignUp;