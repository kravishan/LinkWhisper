// import { About } from "../pages/About"
import { Account } from "../pages/Account"
import { Home } from "../pages/Home"
import { Login } from "../pages/Login"
import { Signup } from "../pages/Signup"
import Shortner from '../pages/Shortner';
import { Protected } from "../pages/Protected"

export const nav = [
     { path:     "/",         name: "Home",        element: <Home />,       isMenu: true,     isPrivate: false  },
     // { path:     "/about",    name: "About",       element: <About />,      isMenu: true,     isPrivate: false  },
     { path:     "/login",    name: "Login",       element: <Login />,      isMenu: false,    isPrivate: false  },
     { path:     "/signup",    name: "Sign Up",       element: <Signup />,      isMenu: true,    isPrivate: false  },
     { path:     "/protected",  name: "Protected",     element: <Protected />,    isMenu: false,     isPrivate: false  },
     // { path:     "/shortner",  name: "Shortner",     element: <Shortner />,    isMenu: true,     isPrivate: true  },
     { path:     "/account",  name: "Account",     element: <Account />,    isMenu: true,     isPrivate: true  },
     { path:     "/shortner",  name: "Shortner",     element: <Shortner />,    isMenu: true,     isPrivate: true  },
]