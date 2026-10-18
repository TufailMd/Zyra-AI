import { useContext, useState, useEffect } from "react";
import bg from "../assets/authBg.png";
import mobileBg from "../assets/authBgMobile.png";
import tabBg from "../assets/authBgTab.png";
import { IoEye, IoEyeOff } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { userDataContext } from "../context/UserContext";
import axios from "axios";

function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const { serverUrl, setUserData } = useContext(userDataContext);
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  const [screen, setScreen] = useState(() => {
    if (typeof window === "undefined") return "desktop";

    if (window.matchMedia("(max-width: 640px)").matches) {
      return "mobile";
    }

    if (window.matchMedia("(max-width: 1024px)").matches) {
      return "tablet";
    }

    return "desktop";
  });

  useEffect(() => {
    const mobileQuery = window.matchMedia("(max-width: 640px)");
    const tabletQuery = window.matchMedia(
      "(min-width: 641px) and (max-width: 1024px)"
    );

    const updateScreen = () => {
      if (mobileQuery.matches) {
        setScreen("mobile");
      } else if (tabletQuery.matches) {
        setScreen("tablet");
      } else {
        setScreen("desktop");
      }
    };

    updateScreen();

    mobileQuery.addEventListener("change", updateScreen);
    tabletQuery.addEventListener("change", updateScreen);

    return () => {
      mobileQuery.removeEventListener("change", updateScreen);
      tabletQuery.removeEventListener("change", updateScreen);
    };
  }, []);

  const backgroundImage =
    screen === "mobile"
      ? mobileBg
      : screen === "tablet"
        ? tabBg
        : bg;

  const handleSignUp = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);

    try {
      const result = await axios.post(
        `${serverUrl}/api/auth/signup`,
        { name, email, password },
        { withCredentials: true }
      );

      setUserData(result.data.user);
      navigate("/customize");
    } catch (error) {
      console.error("Signup failed:", error);
      setUserData(null);

      setErr(
        error.response?.data?.message ||
        "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen w-full bg-cover bg-center bg-no-repeat flex justify-center items-center px-4 py-6"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <form
        className="w-full max-w-125 min-h-150 bg-[#00000062] backdrop-blur shadow-lg shadow-black flex flex-col items-center justify-center gap-5 px-5 py-8 rounded-2xl"
        onSubmit={handleSignUp}
      >
        <h1 className="text-white text-2xl sm:text-[30px] font-semibold text-center mb-4">
          Register to{" "}
          <span className="text-blue-400">Virtual Assistant</span>
        </h1>

        <input
          type="text"
          placeholder="Enter your Name"
          className="w-full h-14 outline-none border-2 border-white bg-transparent text-white placeholder-gray-300 px-5 rounded-full text-lg"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="email"
          placeholder="Email"
          className="w-full h-14 outline-none border-2 border-white bg-transparent text-white placeholder-gray-300 px-5 rounded-full text-lg"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <div className="w-full h-14 border-2 border-white bg-transparent text-white rounded-full text-lg relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="w-full h-full outline-none bg-transparent text-white placeholder-gray-300 px-5 pr-14 rounded-full"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            autoComplete="new-password"
          />

          <button
            type="button"
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="absolute top-1/2 -translate-y-1/2 right-5"
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? (
              <IoEyeOff className="w-6 h-6 cursor-pointer" />
            ) : (
              <IoEye className="w-6 h-6 cursor-pointer" />
            )}
          </button>
        </div>

        {err && (
          <p role="alert" className="text-red-400 text-sm">
            *{err}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="min-w-36 h-14 mt-4 px-6 text-black font-semibold bg-white rounded-full text-lg disabled:opacity-60"
        >
          {loading ? "Loading..." : "Sign Up"}
        </button>

        <p className="text-white text-center text-base sm:text-lg">
          Already have an account?{" "}
          <span
            className="text-blue-400 cursor-pointer"
            onClick={() => navigate("/signin")}
          >
            Sign In
          </span>
        </p>
      </form>
    </div>
  );
}

export default SignUp;
