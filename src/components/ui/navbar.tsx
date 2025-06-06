import React from 'react';
// Assuming CalendarIcon would be imported, e.g., from 'lucide-react'
// import { CalendarIcon } from 'lucide-react';

// Define a type for nav items
interface NavItem {
  name: string;
  href: string;
  icon?: React.ElementType; // Icon is optional or could be a specific type
}

// Assume the snippet was part of an array of navigation items
const navItems: NavItem[] = [
  {
    name: 'Smart Calendar',
    href: '/calendar',
    // icon: CalendarIcon, // Commenting out until CalendarIcon is properly handled
  },
  // Add other navigation items here if necessary
];

const Navbar = () => {
  return (
    <nav>
      <ul>
        {navItems.map((item) => (
          <li key={item.href}>
            <a href={item.href}>
              {item.icon && <item.icon className="nav-icon" />}
              {item.name}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navbar;