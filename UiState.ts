import {atom, AtomEffect } from "recoil";



export const localStorageEffect = (key: string): AtomEffect<any> => ({ setSelf, onSet }: {

  setSelf: (value: any) => void;

  onSet: (callback: (newValue: any) => void) => void;

}) => {

  const savedValue = localStorage.getItem(key);

  if (savedValue != null) {

    setSelf(JSON.parse(savedValue));

  }



  onSet((newValue) => {

    if (newValue != null) {

      localStorage.setItem(key, JSON.stringify(newValue));

    } else {

      localStorage.removeItem(key);

    }

  });

};



export const loggedUserState = atom({

    key: 'loggedUserState',

    default: {

        user_id:'',

        name:'',

        email_id:'',

        designation:'',

        company:'',

        company_type:'',

        phone_number:'',

    },

    effects: [localStorageEffect('loggedUserState')],

});



export const authState = atom({

    key: 'authState',

    default: {

      tokens: {

        token:localStorage.getItem('token'),

        refresh: localStorage.getItem('token')

      },

      user: null,

    },

  });






// import {atom,useSetRecoilState } from "recoil";


// export const loggedUserState = atom({
//     key: 'loggedUser',
//     default: {
//         user_id:'',
//         name:'',
//         email_id:'',
//         designation:'',
//         company:'',
//         company_type:'',
//         phone_number:'',
//     }
// });

// export const authState = atom({
//     key: 'authState',
//     default: {
//       tokens: {
//         token:localStorage.getItem('token'),
//         refresh: localStorage.getItem('token')
//       },
//       user: null,
//     },
//   });