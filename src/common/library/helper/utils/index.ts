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