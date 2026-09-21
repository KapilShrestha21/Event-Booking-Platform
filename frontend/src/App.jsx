import { useAuth } from "./hooks/useAuth";
import AppRoutes from "./routes/AppRoutes";
import { useEffect } from "react";

function App() {

  const { checkingCurrentUser, isCheckingAuth } = useAuth();

  useEffect(() => {
    checkingCurrentUser()
  }, [checkingCurrentUser]);


  if (isCheckingAuth) {
    return <div>Checking authentication...</div>;
  }

  return (
    <AppRoutes />
  )
}

export default App;