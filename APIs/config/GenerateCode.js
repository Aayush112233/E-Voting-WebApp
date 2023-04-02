function GenerateRandomCode() {
    const min = 1000000;
    const max = 9999999; 
    const randomNumber = Math.floor(Math.random() * (max - min + 1) + min);
    return randomNumber.toString();
  }

  export default GenerateRandomCode;
