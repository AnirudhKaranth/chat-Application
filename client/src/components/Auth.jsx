import React, {  useState } from "react";
import { useNavigate } from "react-router-dom";


const Auth = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setisSignUp] = useState(false);

  const navigate = useNavigate();

  const signUp = async (currentuser) => {
    try {
      const response = await fetch("http://localhost:8000/api/v1/user/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(currentuser),
      });
      const json = await response.json();

      if (response.ok) {
        console.log(json);
        localStorage.setItem("token", json.token);
        localStorage.setItem("user", JSON.stringify(json.User));

        navigate("/chat");
      } else {
        alert("Invalid credentials");
      }
    } catch (error) {
      alert("something went wrong");
    }
  };

  const login = async (currentuser) => {
    try {
      const response = await fetch("http://localhost:8000/api/v1/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(currentuser),
      });
      const json = await response.json();

      if (response.ok) {
        localStorage.setItem("token", json.token); //save token

        localStorage.setItem("user", JSON.stringify(json.User));

        navigate("/chat");
      } else {
        alert("Invalid credentials");
      }
    } catch (error) {
      alert("something went wrong");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isSignUp) {
      const currentuser = { name, email, password };
      signUp(currentuser);
    } else {
      const currentuser = { email, password };
      login(currentuser);
    }
  };

  const toggleMember = () => {
    setisSignUp(!isSignUp);
  };

  return (
    <div
      className="
        h-screen w-full flex flex-col justify-center items-center relative"
    >
      <form
        className="flex flex-col justify-center p-2 items-center shadow-lg border-2 border-gray-100 rounded-sm 
            h-full sm:h-5/6 w-full m-3  sm:w-3/4  md:w-2/3 lg:w-2/4"
        onSubmit={handleSubmit}
      >
        <div className="flex flex-row justify-center items-center m-5">
          <div className="text-3xl font-medium font-serif">chat-app</div>
        </div>
        <div className="text-3xl font-medium m-2 mb-5">
          {isSignUp ? "Signup" : "Login"}
        </div>
        {isSignUp && (
          <div className="border-2 border-gray-200 w-4/5 h-12 my-6 rounded-md shadow-sm">
            <label className="w-full h-full">
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full h-full p-2"
                required
              />
            </label>
          </div>
        )}
        <div className="border-2 border-gray-200 w-4/5 h-12 my-6 rounded-md shadow-sm">
          <label>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-full p-2"
              required
            />
          </label>
        </div>
        <div className="border-2 border-gray-200 w-4/5 h-12 my-6 rounded-md shadow-sm">
          <label>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-full p-2"
              required
            />
          </label>
        </div>
        <div
          className="border-2 border-blue-400  w-4/5 m-4 h-12 rounded-md flex flex-col justify-around items-center"
          style={{ backgroundColor: "#73b2ff" }}
        >
          <button type="submit" className="w-full h-full hover:bg-blue-400">
            submit
          </button>
        </div>
        <div
          className="w-auto flex flex-row items-center justify-center"
          style={{ color: "#70b7f9" }}
        >
          <p>{isSignUp ? "Already a member? " : "Don't have an account? "}</p>
          <button
            type="button"
            onClick={toggleMember}
            className="hover:text-blue-600 p-1"
          >
            {isSignUp ? "Login" : " Signup"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Auth;
