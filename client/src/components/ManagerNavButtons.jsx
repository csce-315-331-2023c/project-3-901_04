import React from 'react';
import Button from '@mui/material/Button';
import '../styles/Manager.css'

const ManagerNavButtons = ({ items }) => {
  console.log('About to add these buttons: ', items);
  return (
    <div className="scrollView" style={{ height: '600px', overflowY: 'scroll' }}>
      <div>
        {items.map((item) => (
          <Button variant="outlined" className="managerMenuButton" key={item}>
            {item.item_name}
          </Button>
        ))}
      </div>
    </div>
    
  );
};

export default ManagerNavButtons;