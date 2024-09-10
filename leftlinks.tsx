import React from 'react';
 
type LeftPanelProps = {
  handleLinkClick: (content: string) => void;
  selectedContent: string;
};
 
const LeftPanel: React.FC<LeftPanelProps> = ({ handleLinkClick, selectedContent }) => {
  const handleClick = (content: string) => {
    handleLinkClick(content);
  };
 
  return (
    <div className="left-div">
        <button onClick={() => handleClick("Profile")}id="link-button" className={selectedContent === 'Profile' ? 'active' : 'inactive'}>Profile</button>
        <button onClick={() => handleClick("Settings")}id="link-button" className={selectedContent === 'Settings' ? 'active' : 'inactive'}>Settings</button>
        <button onClick={() => handleClick("Invite")}id="link-button" className={selectedContent === 'Invite' ? 'active' : 'inactive'}>Invite</button>
    </div>
  );
}
 
export default LeftPanel;