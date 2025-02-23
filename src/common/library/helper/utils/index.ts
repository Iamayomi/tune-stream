// export async function generateEmbedding(text: string): Promise<number[]> {
//     // Use OpenAI API or local embedding model
//     const response = await axios.post('https://api.openai.com/v1/embeddings', {
//       input: text,
//       model: "text-embedding-ada-002"
//     }, {
//       headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` }
//     });

//     return response.data.data[0].embedding;
//   }

export async function generateUUID(length: number): Promise<string> {
  const digits = '0123456789abcdefghijklmnopqrstuvwxyz';
  let accountNumber = '';
  for (let i = 0; i < length; i++) {
    accountNumber += digits[Math.floor(Math.random() * digits.length)];
  }
  return accountNumber;
}
