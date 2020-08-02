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

export const subdomainFieldProps = {
  label: 'Subdomain',
  type: 'text',
  required: true,
  rules: [
    v => !v.includes('.') || 'Subdomain should not include a "."',
    v => !['duely', 'api', 'test', 'example', 'admin'].includes(v.toLowerCase()) || 'Not allowed as a subdomain',
    v => /(?=^.{4,253}$)(^((?!-)[a-zA-Z0-9-]{0,62}[a-zA-Z0-9]\.)+[a-zA-Z]{2,63}$)/.test(`${v}.duely.app`) || 'Invalid subdomain'
  ]
};
