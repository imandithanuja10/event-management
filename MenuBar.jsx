import { Component } from 'react';
import { callApi } from './Api';
import './MenuBar.css';

class MenuBar extends Component {
  
  constructor() {
    super();
    this.state = {menuItems: []
    };
    this.loadMenus = this.loadMenus.bind(this);
  }

  componentDidMount() {
    callApi("POST", "http://localhost:8080/menus/getmenus", "" , this.loadMenus);
  }

  loadMenus(response) {
    const data = JSON.parse(response);
    this.setState({ menuItems: data });
  }

  render() {
    const { menuItems } = this.state;
    return (
      <div className="menubar">
        <div className="menuheader">
          <img src="/Menu.jpg" alt="menu" className="menu-icon" />
          <span className="menu-title">Menu</span>
        </div>
        <div className="menulist">
          <ul>
            {menuItems.map((row, index) => (
              <li key={index}>
                <img src={row.icon} alt={row.menu} className="menu-img" />
                <span>{row.menu}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }
}

export default MenuBar;