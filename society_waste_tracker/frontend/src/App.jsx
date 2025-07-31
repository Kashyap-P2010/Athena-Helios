import { useEffect, useState } from 'react';
import "./static/css/App.css"
import { Link, Outlet, useNavigate } from 'react-router-dom';

function App() {
  const developmentBackendLink = "http://localhost:7700"
  const productionBackendLink = ""

  const [loggedIn, setLoggedIn] = useState(false);
  const [errorAlert, setErrorAlert] = useState(null);
  const [successAlert, setSuccessAlert] = useState(null);
  const navigate = useNavigate();

  var user_resident = sessionStorage.getItem("resident")
  var user_apartment = sessionStorage.getItem("apartment")

  useEffect(() => {    
    if (user_resident || user_apartment) {      
      setLoggedIn(true)
    } else {
      setLoggedIn(false)
    }
  }, [user_apartment, user_resident])

  return (
    <div className="App">
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container-fluid">
          <Link className="navbar-brand" to="#">HomeScrap</Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item">
                <Link className="nav-link active" to="/">Home</Link>
              </li>
              

              {loggedIn === false ?
                <>
                  <li className="nav-item dropdown">
                    <Link className="nav-link active dropdown-toggle" to="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                      Apartment Admins
                    </Link>
                    <ul className="dropdown-menu">
                      <li><Link className="dropdown-item" to="/apartment-login">Login</Link></li>
                      <li><Link className="dropdown-item" to="/apartment-register">Register</Link></li>
                    </ul>
                  </li>

                  <li className="nav-item dropdown">
                    <Link className="nav-link active dropdown-toggle" to="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                      Residents
                    </Link>
                    <ul className="dropdown-menu">
                      <li><Link className="dropdown-item" to="/resident-login">Login</Link></li>
                      <li><Link className="dropdown-item" to="/resident-register">Register</Link></li>
                    </ul>
                  </li>
                </>
              : 
                <>
                  <li className="nav-item">
                    <Link className="nav-link" to="/logout">Logout</Link>
                  </li>
                </>
              }
                
            </ul>
          </div>
        </div>
      </nav>

      {errorAlert &&
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          {errorAlert}
          <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
      }

      {successAlert &&
        <div className="alert alert-success alert-dismissible fade show" role="alert">
          {successAlert}
          <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
      }

      <div className="content">
        <Outlet className="content" context={{
            developmentBackendLink,
            productionBackendLink,
            setErrorAlert,
            navigate,
            setSuccessAlert,
          }}        
        />
      </div>
    </div>
  );
}

export default App;
