import React, { useRef, useState, useEffect } from "react";

import { useNavigate, Link } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { faArrowRightFromBracket, faArrowLeft, faCircleInfo } from '@fortawesome/free-solid-svg-icons';

import { loggedUserState } from "../UiState.ts";

import { useRecoilValue, useResetRecoilState } from "recoil";

import { Modal, Button } from 'react-bootstrap';

import 'bootstrap/dist/css/bootstrap.min.css';

import axios from "axios";

import LeftLinks from "./leftlinks.tsx";

import RightContent from "./rightlinks.tsx";

import { overlayData } from "../utils/Constants.ts";





function Account() {

    const navigate = useNavigate();

    const [showUserDetails, setShowUserDetails] = useState<boolean>(false);

    const userDetailsRef = useRef<HTMLDivElement>(null);

    const userdetails = useRecoilValue(loggedUserState);

    const token = localStorage.getItem('accessToken');

    const firstLetter = userdetails.name.charAt(0).toUpperCase();

    const resetLoggedUser = useResetRecoilState(loggedUserState);

    const [selectedContent, setSelectedContent] = useState<string>('Profile');

    const [showInfo, setShowInfo] = useState<boolean>(false);

    const [page, setPage] = useState(1);

    const totalPages = 3;



    const handleLinkClick = (content: string) => {

        setSelectedContent(content);

    };





    useEffect(() => {

        const handleClickOutside = (event: MouseEvent) => {

            if (userDetailsRef.current && !userDetailsRef.current.contains(event.target as Node)) {

                setShowUserDetails(false);

            }

        };



        document.addEventListener('mousedown', handleClickOutside);

        return () => {

            document.removeEventListener('mousedown', handleClickOutside);

        };

    }, []);



    const toggleDetailsbar = () => {

        setShowUserDetails(!showUserDetails);

    };

    const toggleInfoBar = () => {

        setShowInfo(true);

    }

    const handleClose = () => {

        setShowInfo(false);

        setPage(1);

    }



    const handleNext = () => setPage((prevPage) => prevPage + 1);

    const handlePrevious = () => setPage((prevPage) => (prevPage > 1 ? prevPage - 1 : prevPage));





    const renderContent = () => {

        const { image, text } = overlayData[page - 1];

        switch (page) {

           

            /*case 1:

                const { image, text } = overlayData[page - 1];

                return (

                    <>

                        <div className="modal-image">

                            <img src="/images/sunflower.jpg" alt="Modal" style={{ width: '100%' }} />

                        </div>

                        <div className="modal-info">

                            <p>This is the related information that corresponds to the image displayed on the left side of the modal.</p>

                        </div>

                    </>

                    <>

                        <div className="modal-image">

                            <img src={image} alt="Modal" style={{ width: '100%' }} />

                        </div>

                        <div className="modal-info">

                            <p>{text}</p>

                        </div>

                    </>





                );

            case 2:

                const { image, text } = overlayData[page - 1];

                return (

                    <>

                        <div className="modal-image">

                            <img src="/images/sunflower.jpg" alt="Modal" style={{ width: '100%' }} />

                        </div>

                        <div className="modal-info">

                            <p>This is the new content for the second page.</p>

                        </div>

                    </>

                );

            case 3:

                return (

                    <>

                        <div className="modal-image">

                            <img src="/images/sunflower.jpg" alt="Modal" style={{ width: '100%' }} />

                        </div>

                        <div className="modal-info">

                            <p>This is the new content for the third page.</p>

                        </div>

                    </>

                );

            */



                case 1:                  

                    return (

                        <>

                            <div className="modal-image">

                                <img src={image} alt="Modal" style={{ width: '100%' }} />

                            </div>

                            <div className="modal-info">

                                <p>{text}</p>

                            </div>

                        </>

   

   

                    );

                case 2:                  

                    return (

                        <>

                           <div className="modal-image">

                                <img src={image} alt="Modal" style={{ width: '100%' }} />

                            </div>

                            <div className="modal-info">

                                <p>{text}</p>

                            </div>

                        </>

                    );

                case 3:

                    return (

                        <>

                            <div className="modal-image">

                                <img src={image} alt="Modal" style={{ width: '100%' }} />

                            </div>

                            <div className="modal-info">

                                <p>{text}</p>

                            </div>

                        </>

                    );

   

        }

    };



    const handleLogout = async () => {

        try {

            const accessToken = localStorage.getItem('accessToken');

            const refreshToken = localStorage.getItem('refreshToken');

            const payload = {

                refresh: refreshToken

            }

            const response = await axios.post('/users/logout/', payload, {

                headers: {

                    Authorization: 'Bearer ' + accessToken

                }

            });

            if (response) {

                localStorage.removeItem('token');

                localStorage.removeItem('currency');

                resetLoggedUser();

                navigate('/');

            }

        } catch (error) {

            console.error('Error logging out:', error);

        }

    };

    return (

        <div className='content'>

            <div className="header">

                <h1 id="company-name"> Tarento</h1>

                <header className="account-details">

                    <FontAwesomeIcon icon={faCircleInfo} className="infoIcon" onClick={toggleInfoBar} />

                    <div className="top-details-icon" ref={userDetailsRef} onClick={toggleDetailsbar}>



                        <div className="user-initial">{firstLetter}</div>

                        {showUserDetails && userdetails && token ? (

                            <div className="user-details">

                                <span className="user-info">

                                    <p id="icon">{firstLetter}</p>

                                    <Link to="/Account" id="user-name">{userdetails.name}</Link>

                                </span>

                                <span className='logout'>

                                    <FontAwesomeIcon icon={faArrowRightFromBracket} id='font-icon' />

                                    <button onClick={handleLogout} id='logout-button'>Logout</button>

                                </span>



                            </div>

                        ) : <p></p>}

                    </div>

                </header>

            </div>

            <span className="back">

                <FontAwesomeIcon icon={faArrowLeft} />

                <Link to="/content" id="back-text">Back</Link>

            </span>

            {/* <body> */}

            <div className="main">

                <div className="left-div">

                    <LeftLinks handleLinkClick={handleLinkClick} selectedContent={selectedContent} />

                </div>

                <div className="right-div">

                    <RightContent selectedContent={selectedContent} />

                </div>

            </div>



            <Modal show={showInfo} onHide={handleClose} centered>

                <Modal.Header closeButton />

                <Modal.Body className="modal-body">

                    {renderContent()}

                </Modal.Body>

                <Modal.Footer>

                    {page > 1 && (

                        <Button variant="secondary" onClick={handlePrevious}>

                            Previous

                        </Button>

                    )}

                    {page < 3 && (

                        <Button variant="primary" onClick={handleNext} >

                            Next

                        </Button>

                    )}

                    {page == 3 && (

                        <Button variant="primary" onClick={handleClose} >

                            Continue

                        </Button>

                    )}

                    <div className="page-number">

                        Page {page} / {totalPages}

                    </div>

                </Modal.Footer>

            </Modal>





        </div>

    )

}



export default Account;