import { useReducer, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthData } from "../../auth/AuthWrapper";

export const Login = () => {
  const navigate = useNavigate();
  const { login } = AuthData();
  const [formData, setFormData] = useReducer(
    (formData, newItem) => {
      return { ...formData, ...newItem };
    },
    { userName: "", password: "" }
  );
  const [errorMessage, setErrorMessage] = useState(null);

  const doLogin = async () => {
    try {
      await login(formData.userName, formData.password);
      navigate("/account");
    } catch (error) {
      setErrorMessage(error);
    }
  };

  return (
    <div className="page">
      <h2>Login page</h2>
      <div className="inputs">
        <div className="input">
          <input
            value={formData.userName}
            onChange={(e) =>
              setFormData({ userName: e.target.value, password: formData.password })
            }
            type="text"
            placeholder="Username"
          />
        </div>
        <div className="input">
          <input
            value={formData.password}
            onChange={(e) =>
              setFormData({ userName: formData.userName, password: e.target.value })
            }
            type="password"
            placeholder="Password"
          />
        </div>
        <div className="button">
          <button onClick={doLogin}>Log in</button>
        </div>
        {errorMessage ? <div className="error">{errorMessage}</div> : null}
      </div>
    </div>
  );
};
