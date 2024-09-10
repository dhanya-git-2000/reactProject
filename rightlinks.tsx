import React, { useState, ChangeEvent } from 'react';

import { useNavigate } from 'react-router-dom';

import { authState, loggedUserState } from "../UiState.ts";

import { FaEye, FaEyeSlash } from 'react-icons/fa';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { faTimes } from '@fortawesome/free-solid-svg-icons';

import { useRecoilValue } from "recoil";

import axios from "axios";





type RightPanelProps = {

    selectedContent: string;

};



const RightPanel: React.FC<RightPanelProps> = ({ selectedContent }) => {

    const userdetails = useRecoilValue(loggedUserState);

    const navigate = useNavigate();

    const languages = ["English", "Spanish", "French", "German", "Chinese", "Japanese", "Korean"];

    const locations = ["India", "USA", "Australia"];

    const currencies = ["US DOLLAR $", "India rupees"];

    const [settingData, setSettingData] = useState({ language: 'English', location: 'India', currency: 'US DOLLAR $', notificationsEnabled: false })

    const [selectedData, setSelectedData] = useState({ language: settingData.language, location: settingData.location, currency: settingData.currency, notificationsEnabled: settingData.notificationsEnabled });

    //const [selectedLanguage, setSelectedLanguage] = useState(languages[0]);

    //const [selectedLocation, setSelectedLocation] = useState(languages[0]);

    //const [selectedCurrency, setSelectedCurrency] = useState(languages[0]);

    //const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(false);

    const [isSideEditBarOpen, setIsSideEditBarOpen] = useState<boolean>(false);

    const [isSidePasswordBarOpen, setIsSidePasswordBarOpen] = useState<boolean>(false);

    const [password, setPassword] = useState<string>('');

    const [newpassword, setNewPassword] = useState<string>('');

    const [reEnterpassword, setReEnterPassword] = useState<string>('');

    const [isValid, setIsValid] = useState<boolean>(false);

    const [error, setError] = useState<string>('');

    const [hasUppercase, setHasUppercase] = useState<boolean>(false);

    const [hasNumber, setHasNumber] = useState<boolean>(false);

    const [showPassword, setShowPassword] = useState<boolean>(false);

    const [showNewPassword, setShowNewPassword] = useState<boolean>(false);

    const [showReEnterPassword, setShowReEnterPassword] = useState<boolean>(false);

    const [showErrorBox, setShowErrorBox] = useState<boolean>(false);

    const [show, setShow] = useState<boolean>(false);

    const [loading, setLoading] = useState<boolean>(false);

    const [formSubmitted, setFormSubmitted] = useState(false);



    const uppercaseRegex = /[A-Z]/;

    const numberRegex = /[0-9]/;

    const specialCharacterRegex = /[!@#$%^&*(),.?":{}|<>]/;



    const toggleShow = () => {

        setShow(true);

        setTimeout(() => setShow(false), 3000);

    };



    const handleSettingChange = (event: ChangeEvent<HTMLSelectElement>) => {

        const name = event.target.name;

        const value = event.target.value;

        setSelectedData({ ...selectedData, [name]: value });

        console.log(`Selected language: ${event.target.value}`);

    };

    const handleToggleChange = (event: ChangeEvent<HTMLInputElement>) => {

        const { name, checked } = event.target;

        setSelectedData({ ...selectedData, [name]: checked });

        console.log(`Notifications enabled: ${checked}`);

    };

    const togglePasswordVisibility = () => {

        setShowPassword(!showPassword);

    };

    const toggleNewPasswordVisibility = () => {

        setShowNewPassword(!showNewPassword);

    };

    const togglerReEnterPasswordVisibility = () => {

        setShowReEnterPassword(!showReEnterPassword);

    };

    const handleOldPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {

        const oldPassword = e.target.value;

        setPassword(oldPassword);

        setIsValid(specialCharacterRegex.test(oldPassword));

        setHasUppercase(uppercaseRegex.test(oldPassword));

        setHasNumber(numberRegex.test(oldPassword));

        setError('');

    };

    const handleNewPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {

        const newPassword = e.target.value;

        setNewPassword(newPassword);

        setIsValid(specialCharacterRegex.test(newPassword));

        setHasUppercase(uppercaseRegex.test(newPassword));

        setHasNumber(numberRegex.test(newPassword));

        setError('');

    };

    const handleReEnterPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {

        const rePassword = e.target.value;

        setReEnterPassword(rePassword);

        setError('');

    };





    /*const handleLocationChange = (event: ChangeEvent<HTMLSelectElement>) => {

        setSelectedLocation(event.target.value);

        console.log(`Selected Location: ${event.target.value}`);

    };



    const handleCurrencyChange = (event: ChangeEvent<HTMLSelectElement>) => {

        setSelectedCurrency(event.target.value);

        console.log(`Selected language: ${event.target.value}`);

    };*/





    const toggleSidebar = () => {

        setIsSideEditBarOpen(!isSideEditBarOpen);

    }

    const togglePasswordBar = () => {

        setError('');

        setShowErrorBox(false);

        setIsSidePasswordBarOpen(!isSidePasswordBarOpen);

    }





    const handleSaveButton = () => {

        setSettingData({ ...selectedData });

        toggleSidebar();

    }



    const handleUpdateButton = async () => {

        setFormSubmitted(true);

        let errorMessage = '';

        if (!password.trim()&&!newpassword.trim()&&!reEnterpassword.trim()) {

            errorMessage = 'All fields are required';

        }else if (!password.trim()) {

            errorMessage = 'CurrentPassword is required';

        }else if (!newpassword.trim()) {

            errorMessage = 'NewPassword is required';

        }else if (!reEnterpassword.trim()) {

            errorMessage = 'ReEnter Password is required';

        }

        else if(newpassword !== reEnterpassword) {

            setShowErrorBox(true);

            errorMessage = " Both the fields should be same "

        }

        else {

            console.log("No error");

        }

        if (errorMessage) {

            setError(errorMessage);

            toggleShow();

        } else {

            try {

                setLoading(true);

                const accessToken = localStorage.getItem('accessToken');

                const refreshToken = localStorage.getItem('refreshToken');

                const payload = {

                    "current_password": password,

                    "new_password": newpassword,

                    "confirm_new_password": reEnterpassword,

                    "refresh": refreshToken,

                }

                const passwordresponse = await axios.put('/users/change-password/', payload, {

                    headers: {

                        Authorization: 'Bearer ' + accessToken

                    }

                });

                if (passwordresponse.data) {

                    navigate('/');

                    alert("Succesful");

                    setLoading(false);



                } else {

                    alert('Wrong Old Password');

                    setShowErrorBox(false);

                    setLoading(false);

                }

            } catch (error) {

                console.error('Error:', error);

                alert(error);

                setShowErrorBox(false);

                setLoading(false);

            }

        }



    };





    const getContent = () => {

        switch (selectedContent) {

            case 'Profile':

                return (

                    <div className='profile'>

                        <h2>Profile</h2>

                        <hr />

                        <h4>Name: </h4>

                        {userdetails.name}

                        <h4>Company: </h4>

                        {userdetails.company}

                        <h4>Email ID:</h4>

                        {userdetails.email_id}

                        <h4>Phone number:</h4>

                        {userdetails.phone_number}

                    </div>

                );

            case 'Settings':

                return (

                    <div>

                        <h2>Settings</h2>

                        <button className="password-button" onClick={togglePasswordBar}>Change Password</button>

                        <button className="edit-button" onClick={toggleSidebar}>Edit Settings</button>

                        <hr />

                        <div>

                            <label>Language</label>

                            <select className="Dropdown" value={settingData.language} disabled={true} >

                                {languages.map((language, index) => (

                                    <option key={index} value={language}>

                                        {language}

                                    </option>

                                ))}

                            </select>

                        </div>

                        <br />

                        <div>

                            <label>Location Focus </label>

                            <select className="Dropdown" name='location' value={settingData.location} disabled={true} >

                                {locations.map((location, index) => (

                                    <option key={index} value={location}>

                                        {location}

                                    </option>

                                ))}

                            </select>

                        </div>

                        <br />

                        <div>

                            <label>Currency preference </label>

                            <select className="Dropdown" value={settingData.currency} disabled={true}>

                                {currencies.map((currency, index) => (

                                    <option key={index} value={currency}>

                                        {currency}

                                    </option>

                                ))}

                            </select>

                        </div>

                        <br />

                        <label> Notifications</label>

                        <span>

                            <input

                                type="checkbox"

                                id="notificationsToggle"

                                className="toggle-checkbox"

                                checked={settingData.notificationsEnabled}

                                disabled={true}



                            />

                            <label htmlFor="notificationsToggle" className="toggle-slider"></label>

                        </span>

                        {

                            isSideEditBarOpen && (

                                <div className="sidebar">

                                    <div className="sidebar-header">

                                        <h2>Edit Settings</h2>

                                        <FontAwesomeIcon icon={faTimes} className="cancel-icon" onClick={toggleSidebar} />

                                    </div>

                                    <form>

                                        <label>Language</label>

                                        <select className="Dropdown" name='language' value={selectedData.language} onChange={handleSettingChange}>

                                            {languages.map((language, index) => (

                                                <option key={index} value={language}>

                                                    {language}

                                                </option>

                                            ))}

                                        </select>



                                        <br />

                                        <label>Location Focus </label>

                                        <select className="Dropdown" name='location' value={selectedData.location} onChange={handleSettingChange}>

                                            {locations.map((location, index) => (

                                                <option key={index} value={location}>

                                                    {location}

                                                </option>

                                            ))}

                                        </select>



                                        <br />

                                        <label>Currency preference </label>

                                        <select className="Dropdown" name='currency' value={selectedData.currency} onChange={handleSettingChange}>

                                            {currencies.map((currency, index) => (

                                                <option key={index} value={currency}>

                                                    {currency}

                                                </option>

                                            ))}

                                        </select>

                                        <br />

                                        <label> Notifications</label>

                                        <input

                                            type="checkbox"

                                            id="notificationsToggleEdit"

                                            name='notificationsEnabled'

                                            className="toggle-checkbox"

                                            checked={selectedData.notificationsEnabled}

                                            onChange={handleToggleChange}



                                        />

                                        <label htmlFor="notificationsToggleEdit" className="toggle-slider"></label>

                                        <br />

                                        <button type="button" className="btn btn-primary" onClick={handleSaveButton}>Save</button>







                                    </form>

                                </div>

                            )

                        }

                        {

                            isSidePasswordBarOpen && (

                                <div className="passwordbar">

                                    <div className="passwordbar-header">

                                        <h2>Change Password</h2>

                                        <FontAwesomeIcon icon={faTimes} className="cancel-icon" onClick={togglePasswordBar} />

                                    </div>

                                    <form>

                                        <label>You will be required to re-login after uploading the password</label>

                                        <label>Old Password</label>

                                        <div className="input-group">

                                            <input

                                                type={showPassword ? "text" : "password"}

                                                className={`form-control ${formSubmitted && (!password.trim()) ? 'is-invalid' : ''}`}

                                                id="currentpassword"

                                                placeholder="Enter your current password"

                                                value={password}

                                                onChange={handleOldPasswordChange}

                                            />

                                            <span className="input-group-text" onClick={togglePasswordVisibility} style={{ cursor: 'pointer' }}>

                                                {showPassword ? <FaEye /> : <FaEyeSlash />}

                                            </span>

                                        </div>

                                        <br />

                                        <label>New Password </label>

                                        <div className="input-group">

                                            <input

                                                type={showNewPassword ? "text" : "password"}

                                                className={`form-control ${formSubmitted && (!newpassword.trim() ||error || showErrorBox ) ? 'is-invalid' : ''}`}

                                                id="newpassword"

                                                placeholder="Enter your new password"

                                                value={newpassword}

                                                onChange={handleNewPasswordChange}

                                            />

                                            <span className="input-group-text" onClick={toggleNewPasswordVisibility} style={{ cursor: 'pointer' }}>

                                                {showNewPassword ? <FaEye /> : <FaEyeSlash />}

                                            </span>

                                        </div>



                                        <br />

                                        <label>Re-enter New Password </label>

                                        <div className="input-group">

                                            <input

                                                type={showReEnterPassword ? "text" : "password"}

                                                className={`form-control ${formSubmitted && (!reEnterpassword.trim()||error || showErrorBox ) ? 'is-invalid' : ''}`}

                                                id="reenterpassword"

                                                placeholder="ReEnter your new password"

                                                value={reEnterpassword}

                                                onChange={handleReEnterPasswordChange}

                                            />

                                            <span className="input-group-text" onClick={togglerReEnterPasswordVisibility} style={{ cursor: 'pointer' }}>

                                                {showReEnterPassword ? <FaEye /> : <FaEyeSlash />}

                                            </span>

                                        </div>



                                        <br />

                                        <span className="error"> {error}</span>

                                   

                                        <button type="button" className="btn btn-primary" onClick={() => handleUpdateButton()}>Update</button>







                                    </form>

                                </div>

                            )

                        }

                    </div>

                );

            case 'Invite':

                return (

                    <div>

                        <h2>Invite</h2>

                        <hr />

                    </div>

                );

        }

    };

    return (

        <div className="right-div">

            {getContent()}

        </div>

    );

}



export default RightPanel;



//<span className="toggle-label">Enable Notifications</span>

