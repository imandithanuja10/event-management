import { Component } from 'react';
import './Dashboard.css';
import { callApi, getSession, setSession } from './api';
import MenuBar from './MenuBar';

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fullname: '',
      events: [],
      allEvents: [
        {
          id: 1,
          name: "Tech Conference",
          date: "2025-08-15",
          location: "Virtual",
          description: "Annual technology conference featuring the latest innovations in AI, blockchain, and cloud computing. Network with industry leaders and attend hands-on workshops.",
          type: "business",
          imageUrl: "/conference.png",
          speakers: ["Dr. Sarah Johnson", "Mark Williams"],
          price: "$199",
          capacity: "500 attendees",
          organizer: "Tech Events Inc."
        },
        {
          id: 2,
          name: "Music Festival",
          date: "2025-01-20",
          location: "Central Park",
          description: "Experience three days of live music across multiple stages. Featuring international artists, food trucks, and art installations. All ages welcome!",
          type: "music",
          imageUrl: "/music-feast.png",
          lineup: ["The Arctic Monkeys", "Billie Eilish", "Local Band Contest"],
          price: "$85-$250",
          duration: "3 days"
        },
        {
          id: 3,
          name: "Marathon 2.0",
          date: "2025-02-10",
          location: "Convention Center",
          description: "Annual city marathon with 5K, 10K, and full marathon options. Professional timing, hydration stations, and post-race celebration included.",
          type: "sports",
          imageUrl: "/marathon.png",
          categories: ["5K", "10K", "Full Marathon"],
          price: "$50-$120",
          startTime: "7:00 AM"
        },
        {
          id: 4,
          name: "Art Exhibition",
          date: "2025-03-15",
          location: "City Museum",
          description: "Modern art showcase featuring contemporary artists from around the world. Includes interactive installations and artist talks.",
          type: "art",
          imageUrl: "/art.png",
          featuredArtists: ["Mia Chen", "James Peterson", "Sophia Rodriguez"],
          price: "$150",
          hours: "10AM-8PM"
        },
        {
          id: 5,
          name: "Food Fair",
          date: "2025-04-22",
          location: "Downtown Square",
          description: "International cuisines from 20+ countries. Cooking demonstrations, live music, and family-friendly activities throughout the day.",
          type: "food",
          imageUrl: "/food-fair.png",
          cuisines: ["Italian", "Mexican", "Thai", "Indian", "Japanese"],
          entryFee: "$10 (kids free)",
          price: "$35"
        }
      ],
      loading: false,
      error: null,
      selectedEventType: 'all',
      simpleView: true,
      selectedEvent: null,
      showPayment: false,
      showShareModal: false,
      paymentDetails: {
        name: '',
        email: '',
        cardNumber: '',
        expiry: '',
        cvv: ''
      }
    };

    this.showFullname = this.showFullname.bind(this);
    this.handleEventTypeChange = this.handleEventTypeChange.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleViewDetails = this.handleViewDetails.bind(this);
    this.handleBackToList = this.handleBackToList.bind(this);
    this.handleRegisterNow = this.handleRegisterNow.bind(this);
    this.handlePaymentInputChange = this.handlePaymentInputChange.bind(this);
    this.handlePaymentSubmit = this.handlePaymentSubmit.bind(this);
    this.handleBackToDetails = this.handleBackToDetails.bind(this);
    this.handleShareClick = this.handleShareClick.bind(this);
    this.closeShareModal = this.closeShareModal.bind(this);
    this.logout = this.logout.bind(this);
  }

  componentDidMount() {
    let csr = getSession("csrid");
    if (csr === "") {
      this.logout();
      return;
    }
    
    let data = JSON.stringify({ csrid: csr });
    callApi("POST", "http://localhost:8080/users/getfullname", data, this.showFullname);
    this.fetchEvents('all');
  }

  fetchEvents(eventType = 'all') {
    this.setState({ loading: true, error: null, selectedEvent: null, showPayment: false, showShareModal: false });
    
    setTimeout(() => {
      try {
        let filteredEvents = [];
        if (eventType === 'all') {
          filteredEvents = this.state.allEvents;
          this.setState({ 
            events: filteredEvents,
            loading: false,
            simpleView: true
          });
        } else {
          filteredEvents = this.state.allEvents.filter(event => 
            event.type === eventType
          );
          this.setState({ 
            events: filteredEvents,
            loading: false,
            simpleView: false
          });
        }
      } catch (error) {
        this.setState({ error: error.message, loading: false });
      }
    }, 500);
  }

  showFullname(response) {
    this.setState({ fullname: response });
  }

  handleEventTypeChange(eventType) {
    this.setState({ selectedEventType: eventType });
  }

  handleSearch() {
    this.fetchEvents(this.state.selectedEventType);
  }

  handleViewDetails(event) {
    this.setState({ selectedEvent: event, showPayment: false, showShareModal: false });
  }

  handleBackToList() {
    this.setState({ selectedEvent: null, showPayment: false, showShareModal: false });
  }

  handleRegisterNow() {
    this.setState({ showPayment: true });
  }

  handlePaymentInputChange(e) {
    const { name, value } = e.target;
    this.setState(prevState => ({
      paymentDetails: {
        ...prevState.paymentDetails,
        [name]: value
      }
    }));
  }

  handlePaymentSubmit(e) {
    e.preventDefault();
    alert(`Payment successful for ${this.state.selectedEvent.name}! You will receive a confirmation email shortly.`);
    this.setState({ 
      showPayment: false,
      selectedEvent: null,
      paymentDetails: {
        name: '',
        email: '',
        cardNumber: '',
        expiry: '',
        cvv: ''
      }
    });
  }

  handleBackToDetails() {
    this.setState({ showPayment: false });
  }

  handleShareClick() {
    this.setState({ showShareModal: true });
  }

  closeShareModal() {
    this.setState({ showShareModal: false });
  }

  logout() {
    setSession("csrid", "", -1);
    window.location.replace("/");
  }

  renderPaymentForm() {
    const { selectedEvent, paymentDetails } = this.state;
    
    return (
      <div className="payment-container">
        <div className="payment-form">
          <button className="back-button" onClick={this.handleBackToDetails}>
            ← Back to Event
          </button>
          
          <h2>Register for {selectedEvent.name}</h2>
          
          <div className="payment-summary">
            <h3>Order Summary</h3>
            <div className="summary-item">
              <span>Event:</span>
              <span>{selectedEvent.name}</span>
            </div>
            <div className="summary-item">
              <span>Date:</span>
              <span>{selectedEvent.date}</span>
            </div>
            <div className="summary-item">
              <span>Location:</span>
              <span>{selectedEvent.location}</span>
            </div>
            <div className="summary-item">
              <span>Price:</span>
              <span>{selectedEvent.price}</span>
            </div>
          </div>
          
          <form onSubmit={this.handlePaymentSubmit}>
            <h3>Payment Information</h3>
            
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                name="name"
                value={paymentDetails.name}
                onChange={this.handlePaymentInputChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={paymentDetails.email}
                onChange={this.handlePaymentInputChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label>Card Number</label>
              <input
                type="text"
                name="cardNumber"
                value={paymentDetails.cardNumber}
                onChange={this.handlePaymentInputChange}
                placeholder="1234 5678 9012 3456"
                required
              />
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label>Expiry Date</label>
                <input
                  type="text"
                  name="expiry"
                  value={paymentDetails.expiry}
                  onChange={this.handlePaymentInputChange}
                  placeholder="MM/YY"
                  required
                />
              </div>
              
              <div className="form-group">
                <label>CVV</label>
                <input
                  type="text"
                  name="cvv"
                  value={paymentDetails.cvv}
                  onChange={this.handlePaymentInputChange}
                  placeholder="123"
                  required
                />
              </div>
            </div>
            
            <button type="submit" className="submit-payment">
              Complete Registration
            </button>
          </form>
        </div>
      </div>
    );
  }

  renderShareModal() {
    const { selectedEvent } = this.state;
    return (
      <div className="modal-overlay">
        <div className="share-modal">
          <button className="close-modal" onClick={this.closeShareModal}>
            &times;
          </button>
          <h3>Share {selectedEvent.name}</h3>
          <div className="share-options">
            <button className="share-option">
              <span className="icon-email">✉️</span> Email
            </button>
            <button className="share-option">
              <span className="icon-facebook">👍</span> Facebook
            </button>
            <button className="share-option">
              <span className="icon-twitter">🐦</span> Twitter
            </button>
            <button className="share-option">
              <span className="icon-link">🔗</span> Copy Link
            </button>
          </div>
        </div>
      </div>
    );
  }

  renderEventDetails() {
    const { selectedEvent } = this.state;
    
    return (
      <div className="event-details-container">
        <div className="event-details">
          <button className="back-button" onClick={this.handleBackToList}>
            ← Back to Events
          </button>
          
          <div className="event-header">
            <img 
              src={selectedEvent.imageUrl} 
              alt={selectedEvent.name}
              className="event-detail-image"
            />
            <div className="event-header-info">
              <h2>{selectedEvent.name}</h2>
              <div className="event-meta">
                <span className="event-date">{selectedEvent.date}</span>
                <span className="event-location">{selectedEvent.location}</span>
              </div>
            </div>
          </div>
          
          <div className="event-description">
            <h3>About the Event</h3>
            <p>{selectedEvent.description}</p>
          </div>
          
          <div className="event-specs">
            <div className="specs-column">
              {selectedEvent.price && (
                <div className="spec-item">
                  <span className="spec-label">Price:</span>
                  <span className="spec-value">{selectedEvent.price}</span>
                </div>
              )}
              
              {selectedEvent.speakers && (
                <div className="spec-item">
                  <span className="spec-label">Speakers:</span>
                  <ul className="spec-value">
                    {selectedEvent.speakers.map((speaker, index) => (
                      <li key={index}>{speaker}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {selectedEvent.lineup && (
                <div className="spec-item">
                  <span className="spec-label">Lineup:</span>
                  <ul className="spec-value">
                    {selectedEvent.lineup.map((artist, index) => (
                      <li key={index}>{artist}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            
            <div className="specs-column">
              {selectedEvent.categories && (
                <div className="spec-item">
                  <span className="spec-label">Categories:</span>
                  <ul className="spec-value">
                    {selectedEvent.categories.map((category, index) => (
                      <li key={index}>{category}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {selectedEvent.organizer && (
                <div className="spec-item">
                  <span className="spec-label">Organizer:</span>
                  <span className="spec-value">{selectedEvent.organizer}</span>
                </div>
              )}
              
              {selectedEvent.startTime && (
                <div className="spec-item">
                  <span className="spec-label">Start Time:</span>
                  <span className="spec-value">{selectedEvent.startTime}</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="event-actions">
            <button 
              className="register-button"
              onClick={this.handleRegisterNow}
            >
              Register Now
            </button>
            <button 
              className="share-button"
              onClick={this.handleShareClick}
            >
              Share Event
            </button>
          </div>
        </div>
      </div>
    );
  }

  renderEvents() {
    const { events, loading, error, simpleView, selectedEvent, showPayment } = this.state;

    if (showPayment) {
      return this.renderPaymentForm();
    }

    if (selectedEvent) {
      return this.renderEventDetails();
    }

    if (loading) {
      return <div className="loading">Loading events...</div>;
    }

    if (error) {
      return <div className="error">Error: {error}</div>;
    }

    if (events.length === 0) {
      return <div className="no-events">No events found</div>;
    }

    if (simpleView) {
      return (
        <div className="simple-events-list">
          <h2>Upcoming Events</h2>
          {events.map(event => (
            <div key={event.id} className="simple-event-card">
              <h3>{event.name}</h3>
              <p>Date: {event.date}</p>
              <p>Location: {event.location}</p>
              <button 
                className="details-button"
                onClick={() => this.handleViewDetails(event)}
              >
                View Details
              </button>
            </div>
          ))}
        </div>
      );
    }

    return (
      <div className="events-grid">
        {events.map(event => (
          <div key={event.id} className="event-card">
            <img src={event.imageUrl} alt={event.name} />
            <h3>{event.name}</h3>
            <p>{event.date}</p>
            <p>{event.location}</p>
            <button 
              className="details-button"
              onClick={() => this.handleViewDetails(event)}
            >
              View Details
            </button>
          </div>
        ))}
      </div>
    );
  }

  render() {
    const { fullname, selectedEventType, selectedEvent, showPayment, showShareModal } = this.state;
    const eventTypes = ['all', 'music', 'sports', 'art', 'business', 'food'];

    return (
      <div className='dashboard'>
        <div className='header'>
          <img className='logo' src='eventsearchlogo.png' alt="Event Ease Logo"></img>
          <div className='logoText'>EVENT <span>EASE</span></div>
          <img className='logout' onClick={this.logout} src='/logout.png' alt="Logout"></img>
          <label>{fullname}</label>
        </div>
        <div className='menu'>
          <MenuBar onSearchClick={this.handleSearch} />
        </div>
        <div className='outlet'>
          {!selectedEvent && !showPayment && (
            <div className="event-filters">
              {eventTypes.map(type => (
                <button
                  key={type}
                  className={`filter-button ${selectedEventType === type ? 'active' : ''}`}
                  onClick={() => this.handleEventTypeChange(type)}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
              <button className="search-button" onClick={this.handleSearch}>
                Apply Filters
              </button>
            </div>
          )}
          {this.renderEvents()}
          {showShareModal && this.renderShareModal()}
        </div>
      </div>
    );
  }
}

export default Dashboard;