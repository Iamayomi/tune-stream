export async function generateUUID(): Promise<string> {
    const digits = "0123456789abcdefghijklmnopqrstuvwxyz";
    let length: number = 20
    let accountNumber = "";
    for (let i = 0; i < length; i++) {
      accountNumber += digits[Math.floor(Math.random() * digits.length)];
    }
    return accountNumber;
};