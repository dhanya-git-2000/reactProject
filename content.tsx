import React, { useRef, useState, useEffect } from "react";

import { useLocation, useNavigate, Link } from 'react-router-dom';

import { authState, loggedUserState } from "../UiState.ts";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { faBars, faTimes, faArrowRightFromBracket } from '@fortawesome/free-solid-svg-icons';

import { useRecoilValue } from "recoil";

import { useResetRecoilState, useSetRecoilState } from 'recoil';

import axios from "axios";

import { IoMdArrowDropup, IoMdArrowDropdown } from "react-icons/io";

import Account from "./account.tsx";

import { getSuggestedQuery } from "@testing-library/react";





interface LocationState {

  email_id: string;

}

const Content: React.FC = () => {

  const navigate = useNavigate();

  const location = useLocation();

  const { state } = location as { state: LocationState };

  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  const [showUserDetails, setShowUserDetails] = useState<boolean>(false);

  const token = localStorage.getItem('accessToken');

  const currency = localStorage.getItem('currency');

  const userdetails = useRecoilValue(loggedUserState);

  const firstLetter = userdetails.name.charAt(0).toUpperCase();

  const resetLoggedUser = useResetRecoilState(loggedUserState);

  const userDetailsRef = useRef<HTMLDivElement>(null);

  const auth = useRecoilValue(authState);

  const [employeeDetails, setEmployeeDetails] = useState<Employee[]>([]);

  interface FormData {

    user_id: string;

    name: string;

    company_type: string;

    designation: string;

    phone_number: string;

    email_id: string;

  }



  const [formData, setFormData] = useState<Employee>({

    user_id: '',

    name: '',

    company_type: '',

    designation: '',

    phone_number: '',

    email_id: '',

    role: '',

  });

  const [formValid, setFormValid] = useState({

    phone_number: false,

    email_id: false

  });

  const [editIndex, setEditIndex] = useState<number | null>(null);

  const [editMode, setEditMode] = useState<boolean>(false);

  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);

  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);

  const [searchTerm, setSearchTerm] = useState<string>('');

  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);

  const [error, setError] = useState<string>('');

  const [searchButtonClicked, setSearchButtonClicked] = useState<boolean>(false);

  const [touchedFields, setTouchedFields] = useState<Partial<Record<keyof Employee, boolean>>>({});

  const [sortConfig, setSortConfig] = useState<SortConfig>({

    key: null,  // Initial key for sorting

    direction: 'ascending',  // Initial direction for sorting

  });

  const [showSorted, setShowSorted] = useState<boolean>(false);





  interface Employee {

    user_id: string;

    name: string;

    company_type: string;

    designation: string;

    phone_number: string;

    email_id: string,

    role: string;

  }

  interface SortConfig {

    key: keyof Employee | null;

    direction: 'ascending' | 'descending';

  }

  const accessToken = localStorage.getItem('accessToken');







  useEffect(() => {

    const fetchEmployees = async () => {

      try {

        const accessToken = localStorage.getItem('accessToken');

        const response = await axios.get('/users/all/', {

          headers: {

            Authorization: 'Bearer ' + accessToken

          }

        });

        setEmployeeDetails(response.data);

        console.log(response.data);

      } catch (error) {

        console.error('Error fetching employee data:', error);

      }

    };



    fetchEmployees();

  }, []);



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





  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {

    if (e) {

      setSearchTerm(e.target.value);

      const searchResults = employeeDetails.filter((employee) =>

        Object.values(employee).some((value) =>

          value.toLowerCase().includes(searchTerm.toLowerCase())

        )

      );

      /*if(searchResults!==null){

      setFilteredEmployees(searchResults);

      }*/

      setFilteredEmployees(searchResults);

      setSearchButtonClicked(true);

    }

    else {

      setSearchTerm('');

      setSearchButtonClicked(false);

    }

  };



  /*const handleSearch = () => {

    const searchResults = employeeDetails.filter((employee) =>

      Object.values(employee).some((value) =>

        value.toLowerCase().includes(searchTerm.toLowerCase())

      )

    );

    /*if(searchResults!==null){

    setFilteredEmployees(searchResults);

    }

    setFilteredEmployees(searchResults);

    setSearchButtonClicked(true);

  };*/



  useEffect(() => {

    setFilteredEmployees(employeeDetails);

  }, [employeeDetails]);

  const toggleSidebar = () => {

    setIsSidebarOpen(!isSidebarOpen);

    if (!isSidebarOpen) {

      setEditMode(false);

      setEditIndex(null);

      setFormData({

        user_id: '',

        name: '',

        company_type: '',

        designation: '',

        phone_number: '',

        email_id: '',

        role: '',

      });

    }

  };



  const toggleDetailsbar = async () => {

    setShowUserDetails(!showUserDetails);

  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {

    const { name, value } = e.target;

    setFormData({

      ...formData,

      [name]: value

    });





    // Mark the field as touched

    setTouchedFields({

      ...touchedFields,

      [name]: true

    });



    // Validate the input

    validateInput(name as keyof FormData, value);

  };

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const phone_numberRegex = /^\d{10}$/;



  const validateInput = (name: keyof FormData, value: string) => {

    switch (name) {

      case 'email_id':

        setFormValid({

          ...formValid,

          email_id: emailRegex.test(value)

        });

        break;

      case 'phone_number':

        setFormValid({

          ...formValid,

          phone_number: phone_numberRegex.test(value)

        });

        break;

      default:

        setFormValid({

          ...formValid,

          [name]: value.trim() !== ''

        });

    }

  };

  const handleEditEmployee = (employee: Employee, index: number) => {

    setFormData(employee);

    setEditMode(true);

    setEditIndex(index);

    setIsSidebarOpen(true);

  };



  const handleDeleteEmployee = () => {

    if (deleteIndex !== null) {

      const updatedEmployees = [...employeeDetails];

      updatedEmployees.splice(deleteIndex, 1);

      setEmployeeDetails(updatedEmployees);

      setShowDeleteModal(false);

      setDeleteIndex(null);

    }

  };

  const handleAddEmployee = () => {

    if (editMode && editIndex !== null) {

      const updatedEmployees = [...employeeDetails];

      updatedEmployees[editIndex] = {

        user_id: formData.user_id,

        name: formData.name,

        company_type: formData.company_type,

        designation: formData.designation,

        phone_number: formData.phone_number,

        email_id: formData.email_id,

        role: formData.role

      };

      setEmployeeDetails(updatedEmployees);

      setEditMode(false);

      setEditIndex(null);

      setIsSidebarOpen(false);

    } else {

      const newEmployee = {

        user_id: formData.user_id,

        name: formData.name,

        company_type: formData.company_type,

        designation: formData.designation,

        phone_number: formData.phone_number,

        email_id: formData.email_id,

        role: formData.role,

      };

      if (Object.values(formValid).every(Boolean)) {

        setEmployeeDetails([...employeeDetails, newEmployee]);

        setIsSidebarOpen(false);

      }

    }

    setFormData({



      user_id: '',

      name: '',

      company_type: '',

      designation: '',

      phone_number: '',

      email_id: '',

      role: ''

    });

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

  /* const renderSortIcon = (column: keyof Employee) => {

     if (sortColumn === column) {

       return (

         <span>

           {sortDirection === 'asc' ? <IoMdArrowDropup /> : <IoMdArrowDropdown />}

         </span>

       );

     }

     return (

       <span>

         <IoMdArrowDropup style={{ visibility: 'hidden' }} />

         <IoMdArrowDropdown style={{ visibility: 'hidden' }} />

       </span>

     );

   };*/

  const sortedData = React.useMemo(() => {

    if (sortConfig.key) {

      const sorted = [...employeeDetails].sort((a, b) => {

        const aValue = a[sortConfig.key as keyof Employee];

        const bValue = b[sortConfig.key as keyof Employee];



        if (sortConfig.direction === 'ascending') {

          if (typeof aValue === 'string' && typeof bValue === 'string') {

            return aValue.localeCompare(bValue);

          }

        }

        if (sortConfig.direction === 'descending') {

          if (typeof aValue === 'string' && typeof bValue === 'string') {

            return bValue.localeCompare(aValue);

          }

        }





        /*if (typeof aValue === 'number' && typeof bValue === 'number') {

          return sortConfig.direction === 'ascending' ? aValue - bValue : bValue - aValue;

        }*/



        return 0;

      });

      setShowSorted(true);

      return sorted;

    }

    return employeeDetails;

  }, [employeeDetails, sortConfig]);





  const requestSort = (key: keyof Employee) => {

    let direction: 'ascending' | 'descending' = 'ascending';

    if (sortConfig.key === key && sortConfig.direction === 'ascending') {

      direction = 'descending';

    }

    setSortConfig({ key, direction });

  };







  return (

    <div className="content-page">

      <span className="header">

        <FontAwesomeIcon icon={faBars} className="top-right-icon" onClick={toggleSidebar} />

        <h3>Tarento</h3>

      </span>

      <div className="account-details">

        <div className="top-details-icon" ref={userDetailsRef} onClick={toggleDetailsbar}>

          <div className="user-initial">{firstLetter}</div>

          {showUserDetails && userdetails && accessToken ? (

            <div className="user-details" id='main-shrink'>

              <span className="user-info">

                <p id="icon">{firstLetter}</p>

                <Link to="/Account" id="user-name">{userdetails.name}</Link>

              </span>

              <hr />

              <span className='logout'>

                <FontAwesomeIcon icon={faArrowRightFromBracket} id='font-icon' />

                <button onClick={handleLogout} id='logout-button'>Logout</button>

              </span>

            </div>

          ) : <p></p>}

        </div>

      </div>

      <main>

        <div className="table-container">

          <div className="d-flex align-items-center justify-content-between mb-3">

            <h2 className="mb-0">Employee List</h2>

            <div id="search-container">

              <input type="text" placeholder="Search..." value={searchTerm} onChange={handleSearchChange} />

            </div>

          </div>

          <div className="table-data">

            <table className="employee-table">

              <thead >

                <tr className="w-100">

                  <th style={{ position: 'sticky' }}>

                    <div className="d-flex flex-row align-items-center">

                      User ID

                      <div className="d-flex flex-column ">

                        <IoMdArrowDropup onClick={() => requestSort('user_id')}

                          style={{ pointerEvents: sortConfig.key === 'user_id' && sortConfig.direction === 'descending' ? 'none' : 'auto', opacity: sortConfig.key === 'user_id' && sortConfig.direction === 'descending' ? 0.5 : 1, fontSize: '25px', marginBottom: '0px' }}

                        />

                        <IoMdArrowDropdown

                          onClick={() => requestSort('user_id')}

                          style={{ pointerEvents: sortConfig.key === 'user_id' && sortConfig.direction === 'ascending' ? 'none' : 'auto', opacity: sortConfig.key === 'user_id' && sortConfig.direction === 'ascending' ? 0.5 : 1, fontSize: '25px ' }}

                        />

                      </div>

                    </div>



                  </th>

                  <th>

                    <div className="d-flex flex-row align-items-center">

                      Name

                      <div className="d-flex flex-column ">

                        <IoMdArrowDropup

                          onClick={() => requestSort('name')}

                          style={{ pointerEvents: sortConfig.key === 'name' && sortConfig.direction === 'descending' ? 'none' : 'auto', opacity: sortConfig.key === 'name' && sortConfig.direction === 'descending' ? 0.5 : 1, fontSize: '25px ' }}

                        />

                        <IoMdArrowDropdown

                          onClick={() => requestSort('name')}

                          style={{ pointerEvents: sortConfig.key === 'name' && sortConfig.direction === 'ascending' ? 'none' : 'auto', opacity: sortConfig.key === 'name' && sortConfig.direction === 'ascending' ? 0.5 : 1, fontSize: '25px ' }}

                        />

                      </div>

                    </div>



                  </th>

                  <th >

                    <div className="d-flex flex-row align-items-center">

                      Company Type

                      <div className="d-flex flex-column ">

                        <IoMdArrowDropup onClick={() => requestSort('company_type')}

                          style={{ pointerEvents: sortConfig.key === 'company_type' && sortConfig.direction === 'descending' ? 'none' : 'auto', opacity: sortConfig.key === 'company_type' && sortConfig.direction === 'descending' ? 0.5 : 1, fontSize: '25px ' }}

                        />

                        <IoMdArrowDropdown onClick={() => requestSort('company_type')}

                          style={{ pointerEvents: sortConfig.key === 'company_type' && sortConfig.direction === 'ascending' ? 'none' : 'auto', opacity: sortConfig.key === 'company_type' && sortConfig.direction === 'ascending' ? 0.5 : 1, fontSize: '25px ' }}

                        />

                      </div>

                    </div>

                  </th>

                  <th>

                    <div className="d-flex flex-row align-items-center">

                      Designation

                      <div className="d-flex flex-column ">

                        <IoMdArrowDropup onClick={() => requestSort('designation')}

                          style={{

                            pointerEvents: sortConfig.key === 'designation' && sortConfig.direction === 'descending' ? 'none' : 'auto', opacity: sortConfig.key === 'designation' && sortConfig.direction === 'descending' ? 0.5 : 1, fontSize: '25px ',

                          }}

                        />

                        <IoMdArrowDropdown onClick={() => requestSort('designation')}

                          style={{ pointerEvents: sortConfig.key === 'designation' && sortConfig.direction === 'ascending' ? 'none' : 'auto', opacity: sortConfig.key === 'designation' && sortConfig.direction === 'ascending' ? 0.5 : 1, fontSize: '25px ' }}

                        />

                      </div></div>

                  </th>

                  <th>

                    <div className="d-flex flex-row align-items-center">

                      Phone Number

                      <div className="d-flex flex-column ">

                        <IoMdArrowDropup onClick={() => requestSort('phone_number')}

                          style={{ pointerEvents: sortConfig.key === 'phone_number' && sortConfig.direction === 'descending' ? 'none' : 'auto', opacity: sortConfig.key === 'phone_number' && sortConfig.direction === 'descending' ? 0.5 : 1, fontSize: '25px ' }}

                        />

                        <IoMdArrowDropdown onClick={() => requestSort('phone_number')}

                          style={{ pointerEvents: sortConfig.key === 'phone_number' && sortConfig.direction === 'ascending' ? 'none' : 'auto', opacity: sortConfig.key === 'phone_number' && sortConfig.direction === 'ascending' ? 0.5 : 1, fontSize: '25px ' }}

                        />

                      </div>

                    </div>

                  </th>

                  <th>

                    <div className="d-flex flex-row align-items-center">

                      Email ID

                      <div className="d-flex flex-column ">

                        <IoMdArrowDropup onClick={() => requestSort('email_id')}

                          style={{ pointerEvents: sortConfig.key === 'email_id' && sortConfig.direction === 'descending' ? 'none' : 'auto', opacity: sortConfig.key === 'email_id' && sortConfig.direction === 'descending' ? 0.5 : 1, fontSize: '25px' }}

                        />

                        <IoMdArrowDropdown onClick={() => requestSort('email_id')}

                          style={{ pointerEvents: sortConfig.key === 'email_id' && sortConfig.direction === 'ascending' ? 'none' : 'auto', opacity: sortConfig.key === 'email_id' && sortConfig.direction === 'ascending' ? 0.5 : 1, fontSize: '25px ' }}

                        />

                      </div>

                    </div>

                  </th>

                </tr>

              </thead>

              <tbody>

                {showSorted ? sortedData.map((employee, index) => (

                  <tr key={index}>

                    <td>{employee.user_id}</td>

                    <td>{employee.name}</td>

                    <td>{employee.company_type}</td>

                    <td>{employee.designation}</td>

                    <td>{employee.phone_number}</td>

                    <td>{employee.email_id}</td>

                  </tr>

                )) :

                  (searchTerm == '') ? employeeDetails.map((employee, index) => (

                    <tr key={index}>

                      <td>{employee.user_id}</td>

                      <td>{employee.name}</td>

                      <td>{employee.company_type}</td>

                      <td>{employee.designation}</td>

                      <td>{employee.phone_number}</td>

                      <td>{employee.email_id}</td>

                    </tr>

                  )) :

                    (searchButtonClicked === true && searchTerm !== '' && filteredEmployees.length !== 0) ? filteredEmployees.map((employee, index) => (

                      <tr key={index}>

                        <td>{employee.user_id}</td>

                        <td>{employee.name}</td>

                        <td>{employee.company_type}</td>

                        <td>{employee.designation}</td>

                        <td>{employee.phone_number}</td>

                        <td>{employee.email_id}</td>

                      </tr>

                    )) : <tr>

                      <td colSpan={6} style={{ textAlign: 'center' }}>No data found!</td>

                    </tr>}

              </tbody>



            </table>

          </div>

        </div>

      </main>

      {isSidebarOpen && (

        <div className="sidebar">

          <div className="sidebar-header">

            <h2>Employee Details</h2>

            <FontAwesomeIcon icon={faTimes} className="cancel-icon" onClick={toggleSidebar} />

          </div>

          <form>

            <label>

              User ID :

              <br />

              <input type="text" name="user_id" className="input" value={formData.user_id} placeholder="Enter userID" onChange={handleInputChange} />

            </label>

            <label>

              Name :

              <br />

              <input type="text" name="name" className="input" value={formData.name} placeholder="Enter name" onChange={handleInputChange} />

            </label>

            <label>

              Company Type :

              <br />

              <input type="text" name="company_type" className="input" value={formData.company_type} placeholder="Enter company_type" onChange={handleInputChange} />

            </label>

            <label>

              Designation :

              <input type="text" name="designation" className="input" value={formData.designation} placeholder="Enter designation" onChange={handleInputChange} />

            </label>

            <label>

              phone_number Number :

              <input type="tel" name="phone_number" value={formData.phone_number} className={`input ${touchedFields.phone_number && !formValid.phone_number ? 'error' : ''}`} placeholder="Enter number" onChange={handleInputChange} maxLength={10} />

              <br />

              {touchedFields.phone_number && !formValid.phone_number && <span className="error-message">Enter 10 digits with a valid format</span>}

            </label>

            <label>

              Email ID :

              <input type="email" name="email_id" value={formData.email_id} className={`input ${touchedFields.email_id && !formValid.email_id ? 'error' : ''}`} placeholder="Enter email" onChange={handleInputChange}></input>

              <br />

              {touchedFields.email_id && !formValid.email_id && <span className="error-message">Enter with a valid format (e.g: xyz@gmail.com) </span>}

            </label>

            <button type="button" className="btn btn-primary" onClick={handleAddEmployee} disabled={!Object.values(formValid).every(Boolean)}>Add</button>

          </form>

        </div>

      )}

    </div>





  );

};

export default Content;



/*

<tr key={index}>

                <td>{userdetails.user_id||employee.user_id}</td>

                <td>{userdetails.name||employee.name}</td>

                <td>{userdetails.company_type||employee.company_type}</td>

                <td>{userdetails.designation||employee.designation}</td>

                <td>{userdetails.phone_number_number||employee.phone_number}</td>

                <td>{userdetails.email_id||employee.email_id}</td>

              </tr>







              <p>{userdetails.user_id}</p>

              <p>{userdetails.company_type}</p>

              <p>{userdetails.designation}</p>

              <p>{userdetails.phone_number_number}</p>

              <p>{userdetails.email_id}</p>

              */
// import React, { useRef, useState ,useEffect} from "react";
// import { useLocation, useNavigate } from 'react-router-dom';
// import { authState, loggedUserState } from "../UiState.ts";
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faBars,faTimes } from '@fortawesome/free-solid-svg-icons';
// import { useRecoilValue } from "recoil";
// import { useResetRecoilState } from 'recoil';
// import axios from "axios";


// interface LocationState {
//   email_id: string;
// }
// const Content: React.FC = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { state } = location as { state: LocationState };
//   const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
//   const [showUserDetails, setShowUserDetails] = useState<boolean>(false);
//   const token = localStorage.getItem('accessToken');
//   const currency = localStorage.getItem('currency');
//   const userdetails = useRecoilValue(loggedUserState);
//   const firstLetter = userdetails.name.charAt(0).toUpperCase();
//   const resetLoggedUser = useResetRecoilState(loggedUserState);
//   const userDetailsRef = useRef<HTMLDivElement>(null);
//   const auth = useRecoilValue(authState);
//   const [employeeDetails, setEmployeeDetails] = useState<Employee[]>([]);
//   interface FormData {
//     user_ID: string;
//     name: string;
//     companyType: string;
//     designation: string;
//     phone: string;
//     email_ID: string;
//   }
  
//   const [formData, setFormData] = useState<Employee>({
//     user_ID:'',
//     name: '',
//     companyType: '',
//     designation: '',
//     phone: '',
//     email_ID:'',
//     role: '',
//   });
//   const [formValid, setFormValid] = useState({
//     phone: false,
//     email_ID: false
//   });
//   const [editIndex, setEditIndex] = useState<number | null>(null);
//   const [editMode, setEditMode] = useState<boolean>(false);
//   const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
//   const [deleteIndex, setDeleteIndex] = useState<number | null>(null);
//   const [searchTerm, setSearchTerm] = useState<string>('');
//   const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
//   const [error, setError] = useState<string>('');
//   const [searchButtonClicked, setSearchButtonClicked] = useState<boolean>(false);
  
//   const [touchedFields, setTouchedFields] = useState<Partial<Record<keyof Employee, boolean>>>({});



//   interface Employee {
//     user_ID: string;
//     name: string;
//     companyType: string;
//     designation: string;
//     phone: string;
//     email_ID:string,
//     role: string;

//   }
//   const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if(e){
//     setSearchTerm(e.target.value);
//     const searchResults = employeeDetails.filter((employee) =>
//       Object.values(employee).some((value) =>
//         value.toLowerCase().includes(searchTerm.toLowerCase())
//       )
//     );
//     /*if(searchResults!==null){
//     setFilteredEmployees(searchResults);
//     }*/
//     setFilteredEmployees(searchResults);
//     setSearchButtonClicked(true);
//   }
//   else{
//     setSearchTerm('');
//     setSearchButtonClicked(false);
//   }
//   };

//   /*const handleSearch = () => {
//     const searchResults = employeeDetails.filter((employee) =>
//       Object.values(employee).some((value) =>
//         value.toLowerCase().includes(searchTerm.toLowerCase())
//       )
//     );
//     /*if(searchResults!==null){
//     setFilteredEmployees(searchResults);
//     }
//     setFilteredEmployees(searchResults);
//     setSearchButtonClicked(true);
//   };*/

//   useEffect(() => {
//     setFilteredEmployees(employeeDetails);
//   }, [employeeDetails]);
//   const toggleSidebar = () => {
//     setIsSidebarOpen(!isSidebarOpen);
//     if (!isSidebarOpen) {
//       setEditMode(false);
//       setEditIndex(null);
//       setFormData({
//         user_ID:'',
//         name: '',
//         companyType: '',
//         designation: '',
//         phone: '',
//         email_ID:'',
//         role: '',
//       });
//     }
//   };

//   const toggleDetailsbar = () => {
//     setShowUserDetails(!showUserDetails);
//   };
//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setFormData({
//       ...formData,
//       [name]: value
//     });
    

//     // Mark the field as touched
//     setTouchedFields({
//       ...touchedFields,
//       [name]: true
//     });

//     // Validate the input
//     validateInput(name as keyof FormData, value);
//   };
//   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//   const phoneRegex = /^\d{10}$/;

//   const validateInput = (name: keyof FormData, value: string) => {
//     switch (name) {
//       case 'email_ID':
//         setFormValid({
//           ...formValid,
//           email_ID: emailRegex.test(value)
//         });
//         break;
//         case 'phone':
//           setFormValid({
//             ...formValid,
//             phone:phoneRegex.test(value)
//           });
//           break;
//         default:
//           setFormValid({
//             ...formValid,
//             [name]: value.trim() !== ''
//           });
//       }
//     };
//   const handleEditEmployee = (employee: Employee, index: number) => {
//     setFormData(employee);
//     setEditMode(true);
//     setEditIndex(index);
//     setIsSidebarOpen(true);
//   };

//   const handleDeleteEmployee = () => {
//     if (deleteIndex !== null) {
//       const updatedEmployees = [...employeeDetails];
//       updatedEmployees.splice(deleteIndex, 1);
//       setEmployeeDetails(updatedEmployees);
//       setShowDeleteModal(false);
//       setDeleteIndex(null);
//     }
//   };
//   const handleAddEmployee = () => {
//     if (editMode && editIndex !== null) {
//       const updatedEmployees = [...employeeDetails];
//       updatedEmployees[editIndex] = {
//         user_ID:formData.user_ID,
//         name: formData.name,
//         companyType: formData.companyType,
//         designation: formData.designation,
//         phone: formData.phone,
//         email_ID: formData.email_ID,
//         role: formData.role
//       };
//       setEmployeeDetails(updatedEmployees);
//       setEditMode(false);
//       setEditIndex(null);
//       setIsSidebarOpen(false);
//     } else {
//       const newEmployee = {
//         user_ID: formData.user_ID,
//         name: formData.name,
//         companyType: formData.companyType,
//         designation: formData.designation,
//         phone: formData.phone,
//         email_ID: formData.email_ID,
//         role: formData.role,
//       };
//       if (Object.values(formValid).every(Boolean)) {
//       setEmployeeDetails([...employeeDetails, newEmployee]);
//       setIsSidebarOpen(false);
//       }
//     }
//     setFormData({

//       user_ID:'',
//       name: '',
//       companyType: '',
//       designation: '',
//       phone: '',
//       email_ID:'',
//       role: ''
//     });
//   };
//   const handleLogout = async () => {
//     try {
//       const accessToken = localStorage.getItem('accessToken');
//       const refreshToken = localStorage.getItem('refreshToken');
//       const payload = {
//         refresh: refreshToken
//       }
//       const response = await axios.post('/users/logout/', payload, {
//         headers: {
//           Authorization: 'Bearer ' + accessToken
//         }
//       });
//       if (response) {
//         localStorage.removeItem('token');
//         localStorage.removeItem('currency');
//         resetLoggedUser();
//         navigate('/');
//       }
//     } catch (error) {
//       console.error('Error logging out:', error);
//     }
//   };



  
//   return (
//     <div className='app'>
//      <FontAwesomeIcon icon={faBars} className="top-right-icon" onClick={toggleSidebar} />
//       <header className="header">
//         <div className="top-details-icon" ref={userDetailsRef} onClick={toggleDetailsbar}>
//           <div className="user-initial">{firstLetter}</div>
//           {showUserDetails && userdetails && token ? (
//             <div className="user-details">
//               <p>{userdetails.name}-<p>{userdetails.user_id}</p></p>
//               <p>{userdetails.company_type}</p>
//               <p>{userdetails.designation}</p>
//               <p>{userdetails.phone_number}</p>
//               <p>{userdetails.email_id}</p>
//               <button onClick={handleLogout}>Logout</button>
//             </div>
//           ) : <p></p>}
//         </div>
//       </header>
//       <main>
//         <div className="table-container">
//           <div className="d-flex align-items-center justify-content-between mb-3">
//             <h2 className="mb-0">Employee List</h2>
//             <div id="search-container">
//                 <input type="text" placeholder="Search..."value={searchTerm} onChange={handleSearchChange}/>
//             </div>
//           </div>
//           <table className="employee-table">
//             <thead>
//               <tr>
//                 <th>User ID</th>
//                 <th>Name</th>
//                 <th>Company Type</th>
//                 <th>Designation</th>
//                 <th>Phone Number</th>
//                 <th>Email ID</th>
//               </tr>
//             </thead>
//             <tbody>    
//             {( searchTerm=='' )?employeeDetails.map((employee, index)=>(
//                 <tr key={index}>
//                 <td>{employee.user_ID}</td>
//                 <td>{employee.name}</td>
//                 <td>{employee.companyType}</td>
//                 <td>{employee.designation}</td>
//                 <td>{employee.phone}</td>
//                 <td>{employee.email_ID}</td>
//               </tr>
//               )):
//               ( searchButtonClicked===true && searchTerm!=='' && filteredEmployees.length!==0)? filteredEmployees.map((employee, index)=>(
//                 <tr key={index}>
//                 <td>{employee.user_ID}</td>
//                 <td>{employee.name}</td>
//                 <td>{employee.companyType}</td>
//                 <td>{employee.designation}</td>
//                 <td>{employee.phone}</td>
//                 <td>{employee.email_ID}</td>
//               </tr>
//               )):<tr>
//               <td colSpan={6} style={{ textAlign: 'center' }}>No data found!</td>
//             </tr>}

//             </tbody>
//           </table>
//         </div>
//       </main>

//       {isSidebarOpen && (
//         <div className="sidebar">
//           <div className="sidebar-header">
//             <h2>Employee Details</h2>
//             <FontAwesomeIcon icon={faTimes} className="cancel-icon" onClick={toggleSidebar} />
//           </div>
//           <form>
//           <label>
//               User ID :
//               <br />
//               <input type="text" name="user_ID" className="input" value={formData.user_ID} placeholder="Enter userID" onChange={handleInputChange} />
//             </label>
//             <label>
//               Name :
//               <br />
//               <input type="text" name="name" className="input" value={formData.name} placeholder="Enter name" onChange={handleInputChange} />
//             </label>
//             <label>
//               Company Type :
//               <br />
//               <input type="text" name="companyType" className="input" value={formData.companyType} placeholder="Enter companyType" onChange={handleInputChange} />
//             </label>
//             <label>
//               Designation :
//               <input type="text" name="designation" className="input" value={formData.designation} placeholder="Enter designation" onChange={handleInputChange} />
//             </label>
//             <label>
//               Phone Number :
//               <input type="tel" name="phone" value={formData.phone} className={`input ${touchedFields.phone && !formValid.phone ? 'error' : ''}`} placeholder="Enter number" onChange={handleInputChange} maxLength={10} />
//             <br/>
//             {touchedFields.phone &&!formValid.phone && <span className="error-message">Enter 10 digits with a valid format</span>}
//             </label>
//             <label>
//                Email ID :
//               <input type="email" name="email_ID" value={formData.email_ID} className={`input ${touchedFields.email_ID && !formValid.email_ID ? 'error' : ''}`} placeholder="Enter email" onChange={handleInputChange}></input>
//               <br />
//               {touchedFields.email_ID && !formValid.email_ID && <span className="error-message">Enter with a valid format (e.g: xyz@gmail.com) </span>}
//             </label>
//             <button type="button" className="btn btn-primary" onClick={handleAddEmployee} disabled={!Object.values(formValid).every(Boolean)}>Add</button>
//           </form>
//         </div>
//       )}
//     </div>


//   );
// };
// export default Content;


// /*
// <tr key={index}>
//                 <td>{userdetails.user_id||employee.user_ID}</td>
//                 <td>{userdetails.name||employee.name}</td>
//                 <td>{userdetails.company_type||employee.companyType}</td>
//                 <td>{userdetails.designation||employee.designation}</td>
//                 <td>{userdetails.phone_number||employee.phone}</td>
//                 <td>{userdetails.email_id||employee.email_ID}</td>
//               </tr>
//               */