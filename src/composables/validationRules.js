export const requiredField = [
    value =>{
        if(!value) return 'You must enter a value '
    },
]

export const nameRules = [
    value => {
      if (value.length >= 5) return true
      return '5 characters required'
    },
  ]
  export const phoneRules = [
    value => {
      if (value.length == 10) return true
      return '10 characters required'
    },
  ]

  const emailRegex = /^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/;
 export const emailRules = [
  value => {
    if (emailRegex.test(value)) return true
    return 'enter a valid mail'
  },
]
const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
export const passwordRules = [
  value => {
    if (!passwordRegex.test(value)) return "Password must contain at least one digit, one lowercase letter, and one uppercase letter";
    if (value.length >= 8 && passwordRegex.test(value)) return true
    return 'minimum 8  characters required'
  },
]

 export const confirmPasswordRules = (signUser) =>  {
   return (value) => {
      if (!value) return 'You must enter a password.'
      if (value.length >= 8 && signUser.password == value) return true
      if (signUser.password !== value) return "Confirm password should be the same as password"
      if (value !== signUser.password) return "Confirm password should be the same as password"
      return 'minimum 8  characters required'
    }
}

export const profileRules = [
    value => {
      if (value) return true
      if (!value ) return 'You must upload profile photo' 
    },
  ]