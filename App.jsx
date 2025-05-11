import { Component } from 'react';
import './App.css';
import { callApi, setSession } from './api';
import { 
  FaFacebook, 
  FaWhatsapp, 
  FaTwitter, 
  FaLinkedin, 
  FaSearch, 
  FaMapMarkerAlt, 
  FaUser, 
  FaLock, 
  FaEnvelope, 
  FaChevronDown 
} from 'react-icons/fa';

class App extends Component {
  constructor() {
    super();
    this.userRegistration = this.userRegistration.bind(this);
    this.forgotpassword = this.forgotpassword.bind(this);
    this.signin = this.signin.bind(this);
    this.closesignin = this.closesignin.bind(this);
    this.showsignin = this.showsignin.bind(this);
    this.showsignup = this.showsignup.bind(this);
    this.state = {
      activeCategory: 'All',
      featuredEvents: [
        { id: 1, title: 'Music Festival', category: 'Music', location: 'New York', date: '2024-06-15'},
        { id: 2, title: 'Tech Conference', category: 'Technology', location: 'San Francisco', date: '2024-07-20' },
        { id: 3, title: 'Food Expo', category: 'Food', location: 'Chicago', date: '2024-08-10' },
      ]
    };
  }

  showsignin() {
    let popup = document.getElementById("popup");
    popup.style.display = "block";
    document.body.style.overflow = "hidden";

    let popupcontent = document.getElementById("popupcontent");
    popupcontent.style.display = "block";

    let signup = document.getElementById("signup");
    signup.style.display = "none";

    let popupheader = document.getElementById("popupheader");
    popupheader.innerHTML = "Login";

    document.getElementById("username").value = "";
    document.getElementById("password").value = "";
  }

  closesignin(event) {
    if (event.target.id === "popup") {
      let popup = document.getElementById("popup");
      popup.style.display = 'none';
      document.body.style.overflow = "auto";
    }
  }

  showsignup() {
    let popup = document.getElementById("popup");
    popup.style.display = "block";
    document.body.style.overflow = "hidden";

    let signup = document.getElementById("signup");
    signup.style.display = "block";

    let popupcontent = document.getElementById("popupcontent");
    popupcontent.style.display = "none";

    let popupheader = document.getElementById("popupheader");
    popupheader.innerHTML = "Create an Account";

    document.getElementById("fullname").value = "";
    document.getElementById("email").value = "";
    document.getElementById("role").value = "3";
    document.getElementById("signuppassword").value = "";
    document.getElementById("confirmpassword").value = "";
  }

  userRegistration() {
    let fullname = document.getElementById("fullname");
    let email = document.getElementById("email");
    let role = document.getElementById("role");
    let signuppassword = document.getElementById("signuppassword");
    let confirmpassword = document.getElementById("confirmpassword");

    fullname.style.border = "";
    email.style.border = "";
    role.style.border = "";
    signuppassword.style.border = "";
    confirmpassword.style.border = "";

    if (fullname.value == "") {
      fullname.style.border = "1px solid red";
      fullname.focus();
      return;
    }
    if (email.value == "") {
      email.style.border = "1px solid red";
      email.focus();
      return;
    }
    if (role.value == "") {
      role.style.border = "1px solid red";
      role.focus();
      return;
    }
    if (signuppassword.value == "") {
      signuppassword.style.border = "1px solid red";
      signuppassword.focus();
      return;
    }
    if (confirmpassword.value == "") {
      confirmpassword.style.border = "1px solid red";
      confirmpassword.focus();
      return;
    }
    if (signuppassword.value != confirmpassword.value) {
      signuppassword.style.border = "1px solid red";
      signuppassword.focus();
      return;
    }

    var data = JSON.stringify({
      fullname: fullname.value,
      email: email.value,
      role: role.value,
      password: signuppassword.value,
    })

    callApi("POST", "http://localhost:8080/users/signup", data, this.getResponse)
  }

  getResponse(res) {
    let resp = res.split('::');
    alert(resp[1]);
    if (resp[0] === "200") {
      let popupcontent = document.getElementById("popupcontent");
      let signup = document.getElementById("signup");

      signup.style.display = "none";
      popupcontent.style.display = "block";

      let popupheader = document.getElementById("popupheader");
      popupheader.innerHTML = "LOGIN";
    }
  }

  forgotpassword() {
    let username = document.getElementById("username");
    username.style.border = "";
    if (username.value === "") {
      username.style.border = "1px solid red";
      username.focus();
      return;
    }

    let url = "http://localhost:8080/users/forgotpassword/" + username.value;
    callApi("GET", url, "", this.forgotpasswordresponse);
  }

  forgotpasswordresponse(res) {
    let div1 = document.getElementById("div1");
    let resp1 = res.split('::');

    if (resp1[0] === "200") {
      div1.innerHTML = `<br/><label style="color:green">${resp1[1]}</label>`;
    } else {
      div1.innerHTML = `<br/><label style="color:red">${resp1[1]}</label>`;
    }
  }

  signin() {
    let username = document.getElementById("username");
    let password = document.getElementById("password");
    let div1 = document.getElementById("div1");

    username.style.border = "";
    password.style.border = "";
    div1.innerHTML = "";

    if (username.value === "") {
      username.style.border = "1px solid red";
      username.focus();
      return;
    }
    if (password.value === "") {
      password.style.border = "1px solid red";
      password.focus();
      return;
    }

    let data = JSON.stringify({
      email: username.value,
      password: password.value
    })

    callApi("POST", "http://localhost:8080/users/signin", data, this.signinResponse);
  }

  signinResponse(res) {
    let div1 = document.getElementById("div1");
    let rdata = res.split('::');
    if (rdata[0] === "200") {
      setSession("csrid", rdata[1], 1);
      window.location.replace("/dashboard");
    } else {
      div1.innerHTML = `<br/><label style='color:red'>${rdata[1]}</label>`;
    }
  }

  setActiveCategory(category) {
    this.setState({ activeCategory: category });
  }

  render() {
    const { activeCategory, featuredEvents } = this.state;
    const categories = ['All', 'Music', 'Technology', 'Food', 'Sports', 'Art', 'Business'];

    return (
      <div id="container">
        {/* Login/Signup Popup */}
        <div id='popup' onClick={this.closesignin}>
          <div id='popupwindow'>
            <div id='popupheader'>LOGIN</div>
            <div id='popupcontent'>
              <label className='usernamelabel'>Email*</label>
              <div className="input-with-icon">
                <FaUser className="input-icon" />
                <input type='text' id='username' placeholder='Enter your email'></input>
              </div>
              <label className='passwordlabel'>Password*</label>
              <div className="input-with-icon">
                <FaLock className="input-icon" />
                <input type='password' id='password' placeholder='Enter password'></input>
              </div>
              <div className='forgotpasswordlabel'>Forgot <label onClick={this.forgotpassword}>Password?</label></div>
              <button className='signinbutton' onClick={this.signin}>Sign In</button>
              <div className='responseDiv' id="div1"></div>
              <div className='downdiv'>Don't have an account?<label onClick={this.showsignup}> SIGNUP NOW</label></div>
            </div>
            <div id='signup'>
              <label>Full Name*</label>
              <div className="input-with-icon">
                <FaUser className="input-icon" />
                <input type='text' id='fullname' placeholder='Enter your full name'></input>
              </div>
              <label>Email*</label>
              <div className="input-with-icon">
                <FaEnvelope className="input-icon" />
                <input type='text' id='email' placeholder='Enter your email'></input>
              </div>
              <label>Select Role*</label>
              <div className="select-with-icon">
                <select id='role' defaultValue={3}>
                  <option value={0}>Select Role</option>
                  <option value={1}>Admin</option>
                  <option value={2}>Event Organizer</option>
                  <option value={3}>Event Attendee</option>
                </select>
                <FaChevronDown className="select-arrow" />
              </div>
              <label>Password*</label>
              <div className="input-with-icon">
                <FaLock className="input-icon" />
                <input type='password' id='signuppassword' placeholder='Create password'></input>
              </div>
              <label>Confirm Password*</label>
              <div className="input-with-icon">
                <FaLock className="input-icon" />
                <input type='password' id='confirmpassword' placeholder='Confirm password'></input>
              </div>
              <button className='register-button' onClick={this.userRegistration}>Register</button>
              <div className='signin-link'>Already have an account? <span onClick={this.showsignin}>Sign In</span></div>
            </div>
          </div>
        </div>

        {/* Header */}
        <header id='header'>
          <div className='logo-container'>
            <div className='logo-circle'>
              <span>EE</span>
            </div>
            <div className='logotext'><span>EVENT</span>EASE</div>
          </div>
          <nav className='nav-links'>
            <a href='#home'>Home</a>
            <a href='#events'>Events</a>
            <a href='#about'>About</a>
            <a href='#contact'>Contact</a>
          </nav>
          <div className='auth-section' onClick={this.showsignin}>
            <FaUser className='user-icon' />
            <span>Sign In</span>
          </div>
        </header>

        {/* Hero Section */}
        <section id="hero">
          <div className='hero-content'>
            <h1>WELCOME TO EVENT EASE!</h1>
            <h2>"Where Every Event Becomes an Experience!"</h2>
            <p>Unlock Unforgettable Events–Effortlessly</p>
            <div className='search-container'>
              <div className="search-bar">
                <div className="search-input">
                  <FaSearch className="search-icon" />
                  <input type='text' placeholder='Search by category (e.g. Music, Conference)' />
                </div>
                <div className="search-input">
                  <FaMapMarkerAlt className="search-icon" />
                  <input type='text' placeholder='Location' />
                </div>
                <button className='search-button'>Search Events</button>
              </div>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="categories-section">
          <h3>Browse by Category</h3>
          <div className="categories-container">
            {categories.map(category => (
              <div
                key={category}
                className={`category-card ${activeCategory === category ? 'active' : ''}`}
                onClick={() => this.setActiveCategory(category)}
              >
                {category}
              </div>
            ))}
          </div>
        </section>

        {/* Featured Events */}
        <section className="featured-events">
          <h3>Featured Events</h3>
          <div className="events-grid">
            {featuredEvents.map(event => (
              <div key={event.id} className="event-card">
                <div className="event-image"></div>
                <div className="event-details">
                  <h4>{event.title}</h4>
                  <p className="event-category">{event.category}</p>
                  <p className="event-location">{event.location}</p>
                  <p className="event-date">{event.date}</p>
                  <button className="event-button">View Details</button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Call to Action */}
        <section className="cta-section">
          <h3>Ready to Create Your Next Event?</h3>
          <p>Join thousands of event organizers who trust EventEase for seamless event management.</p>
          <button className="cta-button" onClick={this.showsignup}>Get Started Now</button>
        </section>

        {/* Footer */}
        <footer id="footer">
          <div className="footer-content">
            <div className="footer-section">
              <div className='logo-container footer-logo'>
                <div className='logo-circle'>
                  <span>EE</span>
                </div>
                <div className='logotext'><span>EVENT</span>EASE</div>
              </div>
              <p>"Where Every Event Becomes an Experience!"</p>
              <div className="social-icons">
                <FaFacebook className="social-icon" />
                <FaWhatsapp className="social-icon" />
                <FaTwitter className="social-icon" />
                <FaLinkedin className="social-icon" />
              </div>
            </div>
            <div className="footer-section">
              <h4>Quick Links</h4>
              <a href="#home">Home</a>
              <a href="#events">Events</a>
              <a href="#about">About Us</a>
              <a href="#contact">Contact</a>
            </div>
            <div className="footer-section">
              <h4>Support</h4>
              <a href="#faq">FAQ</a>
              <a href="#privacy">Privacy Policy</a>
              <a href="#terms">Terms of Service</a>
              <a href="#help">Help Center</a>
            </div>
            <div className="footer-section">
              <h4>Contact Us</h4>
              <p>info@eventease.com</p>
              <p>+1 (555) 123-4567</p>
              <p>123 Event Street, San Francisco, CA</p>
            </div>
          </div>
          <div className='footer-bottom'>
            <div className='footertext'>Copyright © 2024 EventEase. All Rights Reserved.</div>
          </div>
        </footer>
      </div>
    )
  }
}

export default App;