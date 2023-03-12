/** @file Registration container responsible for rendering and interactions in sign up flow. */
import * as router from "react-router-dom";
import toast from "react-hot-toast";

import * as auth from "../providers/auth";
import withRouter from "../../navigation";
import * as hooks from "../../hooks";
import * as utils from "../../utils";
import * as app from "../../components/app";
import * as icons from "../../components/svg";

// =============================
// === registrationContainer ===
// =============================

const registrationContainer = () => {
  const { signUp } = auth.useAuth();
  const { value: email, bind: bindEmail } = hooks.useInput("");
  const { value: password, bind: bindPassword } = hooks.useInput("");
  const { value: confirmPassword, bind: bindConfirmPassword } =
    hooks.useInput("");

  const handleSubmit = () => {
    /** The password & confirm password fields must match. */
    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return Promise.resolve();
    }

    return signUp(email, password);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-300 px-4 py-8">
      <div className="rounded-md bg-white w-full max-w-sm sm:max-w-md border border-gray-200 shadow-md px-4 py-6 sm:p-8">
        <div className="font-medium self-center text-xl sm:text-2xl uppercase text-gray-800">
          Create new account
        </div>

        <form onSubmit={utils.handleEvent(handleSubmit)}>
          <div className="flex flex-col mb-4">
            <label
              htmlFor="email"
              className="mb-1 text-xs sm:text-sm tracking-wide text-gray-600"
            >
              E-Mail Address:
            </label>
            <div className="relative">
              <div className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400">
                <icons.Svg data={icons.PATHS.at} />
              </div>

              <input
                {...bindEmail}
                id="email"
                type="email"
                name="email"
                className="text-sm sm:text-base placeholder-gray-500 pl-10 pr-4 rounded-lg border border-gray-400 w-full py-2 focus:outline-none focus:border-indigo-400"
                placeholder="E-Mail Address"
              />
            </div>
          </div>
          <div className="flex flex-col mb-4">
            <label
              htmlFor="password"
              className="mb-1 text-xs sm:text-sm tracking-wide text-gray-600"
            >
              Password:
            </label>
            <div className="relative">
              <div className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400">
                <span>
                  <icons.Svg data={icons.PATHS.lock} />
                </span>
              </div>

              <input
                {...bindPassword}
                id="password"
                type="password"
                name="password"
                className="text-sm sm:text-base placeholder-gray-500 pl-10 pr-4 rounded-lg border border-gray-400 w-full py-2 focus:outline-none focus:border-indigo-400"
                placeholder="Password"
              />
            </div>
          </div>
          <div className="flex flex-col mb-4">
            <label
              htmlFor="password_confirmation"
              className="mb-1 text-xs sm:text-sm tracking-wide text-gray-600"
            >
              Confirm Password:
            </label>
            <div className="relative">
              <div className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400">
                <span>
                  <icons.Svg data={icons.PATHS.lock} />
                </span>
              </div>

              <input
                {...bindConfirmPassword}
                id="password_confirmation"
                type="password"
                name="password_confirmation"
                className="text-sm sm:text-base placeholder-gray-500 pl-10 pr-4 rounded-lg border border-gray-400 w-full py-2 focus:outline-none focus:border-indigo-400"
                placeholder="Confirm Password"
              />
            </div>
          </div>

          <div className="flex w-full mt-6">
            <button
              type="submit"
              className="flex items-center justify-center focus:outline-none text-white text-sm sm:text-base bg-indigo-600 hover:bg-indigo-700 rounded py-2 w-full transition duration-150 ease-in"
            >
              <span className="mr-2 uppercase">Register</span>
              <span>
                <icons.Svg data={icons.PATHS.createAccount} />
              </span>
            </button>
          </div>
        </form>
      </div>
      <div className="flex justify-center items-center mt-6">
        <router.Link
          to={app.LOGIN_PATH}
          className="inline-flex items-center font-bold text-indigo-500 hover:text-indigo-700 text-sm text-center"
        >
          <span>
            <icons.Svg data={icons.PATHS.goBack} />
          </span>
          <span className="ml-2">Already have an account?</span>
        </router.Link>
      </div>
    </div>
  );
};

export default withRouter(registrationContainer);
