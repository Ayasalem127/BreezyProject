exports.isValidEmail = (email) => {
  const regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
  return regex.test(email);
};

exports.isStrongPassword = (password) => {
  const regex = /^(?=.*\d).{6,}$/;
  return regex.test(password); // au moins 6 caractères, 1 chiffre
};
