import { useReducer, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthData } from "../../auth/AuthWrapper";
import { TextField, Button, Snackbar } from "@mui/material";
import { Alert } from "@mui/material";
import "../style/login.css";

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
  const [open, setOpen] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleClose = () => {
    setOpen(false);
  };

  const doLogin = async () => {
    try {
      await login(formData.userName, formData.password);
      navigate("/account");
    } catch (error) {
      setErrorMessage(error.response.data.error || "An error occurred");
      setOpen(true);
    }
  };

  return (
    <div className="page">
      <h2 className="mb-4 text">Login</h2>
      <div className="inputs">
        <TextField
          name="userName"
          value={formData.userName}
          onChange={handleInputChange}
          type="text"
          label="Username"
          variant="outlined"
          className="input"
          fullWidth
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          name="password"
          value={formData.password}
          onChange={handleInputChange}
          type="password"
          label="Password"
          variant="outlined"
          className="input"
          fullWidth
          InputLabelProps={{ shrink: true }}
        />
        <div className="button">
          <Button variant="contained" onClick={doLogin} color="primary">
            Log in
          </Button>
        </div>
        {errorMessage && (
          <Snackbar open={true} autoHideDuration={6000} onClose={handleClose}>
            <Alert onClose={handleClose} severity="error">
              {errorMessage}
            </Alert>
          </Snackbar>
        )}
      </div>
    </div>
  );
};
