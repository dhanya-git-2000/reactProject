import React ,{ useState }from 'react';

import './App.css';

import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

import Content from './components/content.tsx';

import 'bootstrap/dist/css/bootstrap.min.css';

import Login from './components/login';

import Mainpage from './components/mainpage.tsx';

import Entry from './components/entryPage.tsx';

import Account from './components/account.tsx';

import LeftLinks from './components/leftlinks.tsx';

import RightContent from './components/rightlinks.tsx';





interface LocationState {

  name: string;

  index: number;

  position: string;

  department: string;

  phone: string;

  role: string;

  email_id: string;

  password: string;

}



/*const MainpageWrapper: React.FC = () => {

  const location = useLocation();

  const { state } = location as { state: LocationState };

  return <Mainpage

  name={state.name}

  role={state.role}

  index={state.index}

  position={state.position}

  department={state.department}

  phone={state.phone}

  email_id={state.email_id}

  password={state.password} />;

};*/

function App() {

  return (

    <Router>

      <Routes>

        <Route path="/" element={<Entry />} />

        <Route path="/mainpage" element={<Mainpage />} />

        <Route path="/content" element={<Content />} />

        <Route path="/account" element={<Account />} />

      </Routes>

    </Router>

   

  )

};

export default App;









// import React from 'react';
// import './App.css';
// import { BrowserRouter as Router, Routes, Route, useLocation} from 'react-router-dom';
// import Content from './components/content.tsx';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import Login from './components/login.tsx';
// import Mainpage from './components/mainpage.tsx';
// import Entry from './components/entryPage.tsx';

// interface LocationState {
//   name:string;
//   index:number;
//   position: string;
//   department: string;
//   phone: string;
//   role: string;
//   email_id: string;
//   password: string;
// }

// /*const MainpageWrapper: React.FC = () => {
//   const location = useLocation();
//   const { state } = location as { state: LocationState };
//   return <Mainpage 
//   name={state.name}
//   role={state.role}
//   index={state.index}
//   position={state.position}
//   department={state.department}
//   phone={state.phone}
//   email_id={state.email_id}
//   password={state.password} />;
// };*/
// function App() {
//   return (
//     <Router>
//     <Routes>
//       <Route path="/"element={<Entry/>} />
//       <Route path="/mainpage" element={<Mainpage/>} /> 
//       <Route path="/content" element={<Content/>} /> 
//     </Routes>
//   </Router>
//     )};
// export default App;

