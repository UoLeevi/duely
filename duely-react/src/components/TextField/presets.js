export const passwordFieldProps = {
  label: 'Password',
  type: 'password',
  required: true,
  rules: [ v => v.length >= 6 || 'Minimum password length is 6 characters' ]
};

export const emailFieldProps = {
  label: 'Email',
  type: 'email',
  required: true,
  rules: [ v => /\S+@\S+/.test(v) || 'Invalid email address' ]
};
